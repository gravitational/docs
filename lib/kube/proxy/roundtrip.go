/*
Copyright 2015 The Kubernetes Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package proxy

import (
	"bufio"
	"bytes"
	"context"
	"crypto/tls"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gravitational/trace"
	log "github.com/sirupsen/logrus"
	apierrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/serializer"
	"k8s.io/apimachinery/pkg/util/httpstream"
	streamspdy "k8s.io/apimachinery/pkg/util/httpstream/spdy"
	utilnet "k8s.io/apimachinery/pkg/util/net"
	"k8s.io/apimachinery/third_party/forked/golang/netutil"

	"github.com/gravitational/teleport/lib/auth"
	"github.com/gravitational/teleport/lib/utils"
)

// SpdyRoundTripper knows how to upgrade an HTTP request to one that supports
// multiplexed streams. After RoundTrip() is invoked, Conn will be set
// and usable. SpdyRoundTripper implements the UpgradeRoundTripper interface.
type SpdyRoundTripper struct {
	roundTripperConfig

	/* TODO according to http://golang.org/pkg/net/http/#RoundTripper, a RoundTripper
	   must be safe for use by multiple concurrent goroutines. If this is absolutely
	   necessary, we could keep a map from http.Request to net.Conn. In practice,
	   a client will create an http.Client, set the transport to a new insteace of
	   SpdyRoundTripper, and use it a single time, so this hopefully won't be an issue.
	*/
	// conn is the underlying network connection to the remote server.
	conn net.Conn
}

var (
	_ utilnet.TLSClientConfigHolder  = &SpdyRoundTripper{}
	_ httpstream.UpgradeRoundTripper = &SpdyRoundTripper{}
	_ utilnet.Dialer                 = &SpdyRoundTripper{}
)

type roundTripperConfig struct {
	// ctx is a context for this round tripper
	ctx context.Context
	// authCtx is the auth context to use for this round tripper
	authCtx authContext
	// dialWithContext is the function used connect to remote address
	dialWithContext dialContextFunc
	// tlsConfig holds the TLS configuration settings to use when connecting
	// to the remote server.
	tlsConfig *tls.Config
	// pingPeriod is the period at which to send pings to the remote server to
	// keep the SPDY connection alive.
	pingPeriod time.Duration
	// originalHeaders are the headers that were passed from the original request.
	// These headers are used to set the headers on the new request if the user
	// requested Kubernetes impersonation.
	originalHeaders http.Header
	// useIdentityForwarding controls whether the proxy should forward the
	// identity of the user making the request to the remote server using the
	// auth.TeleportImpersonateUserHeader and auth.TeleportImpersonateIPHeader
	// headers instead of relying on the certificate to transport it.
	useIdentityForwarding bool
}

// NewSpdyRoundTripperWithDialer creates a new SpdyRoundTripper that will use
// the specified tlsConfig. This function is mostly meant for unit tests.
func NewSpdyRoundTripperWithDialer(cfg roundTripperConfig) *SpdyRoundTripper {
	return &SpdyRoundTripper{roundTripperConfig: cfg}
}

// TLSClientConfig implements pkg/util/net.TLSClientConfigHolder for proper TLS checking during
// proxying with a spdy roundtripper.
func (s *SpdyRoundTripper) TLSClientConfig() *tls.Config {
	return s.tlsConfig
}

// Dial implements k8s.io/apimachinery/pkg/util/net.Dialer.
func (s *SpdyRoundTripper) Dial(req *http.Request) (net.Conn, error) {
	conn, err := s.dial(req.URL)
	if err != nil {
		return nil, err
	}

	if err := req.Write(conn); err != nil {
		conn.Close()
		return nil, err
	}

	return conn, nil
}

// dial dials the host specified by url, using TLS if appropriate.
func (s *SpdyRoundTripper) dial(url *url.URL) (net.Conn, error) {
	dialAddr := netutil.CanonicalAddr(url)

	if url.Scheme == "http" {
		switch {
		case s.dialWithContext != nil:
			return s.dialWithContext(s.ctx, "tcp", dialAddr)
		default:
			return net.Dial("tcp", dialAddr)
		}
	}

	// TODO validate the TLSClientConfig is set up?
	var conn *tls.Conn
	var err error
	if s.dialWithContext == nil {
		conn, err = tls.Dial("tcp", dialAddr, s.tlsConfig)
	} else {
		conn, err = utils.TLSDial(s.ctx, utils.DialWithContextFunc(s.dialWithContext), "tcp", dialAddr, s.tlsConfig)
	}
	if err != nil {
		return nil, trace.Wrap(err)
	}

	// Client handshake will verify the server hostname and cert chain. That
	// way we can err our before first read/write.
	if err := conn.Handshake(); err != nil {
		return nil, trace.Wrap(err)
	}

	return conn, nil
}

// RoundTrip executes the Request and upgrades it. After a successful upgrade,
// clients may call SpdyRoundTripper.Connection() to retrieve the upgraded
// connection.
func (s *SpdyRoundTripper) RoundTrip(req *http.Request) (*http.Response, error) {
	header := utilnet.CloneHeader(req.Header)
	// copyImpersonationHeaders copies the headers from the original request to the new
	// request headers. This is necessary to forward the original user's impersonation
	// when multiple kubernetes_users are available.
	copyImpersonationHeaders(header, s.originalHeaders)
	header.Set(httpstream.HeaderConnection, httpstream.HeaderUpgrade)
	header.Set(httpstream.HeaderUpgrade, streamspdy.HeaderSpdy31)
	if err := setupImpersonationHeaders(log.StandardLogger(), s.authCtx, header); err != nil {
		return nil, trace.Wrap(err)
	}

	var (
		conn        net.Conn
		rawResponse []byte
		err         error
	)

	// If we're using identity forwarding, we need to add the impersonation
	// headers to the request before we send the request.
	if s.useIdentityForwarding {
		if header, err = auth.IdentityForwardingHeaders(s.ctx, header); err != nil {
			return nil, trace.Wrap(err)
		}
	}

	clone := utilnet.CloneRequest(req)
	clone.Header = header
	conn, err = s.Dial(clone)
	if err != nil {
		return nil, err
	}

	responseReader := bufio.NewReader(
		io.MultiReader(
			bytes.NewBuffer(rawResponse),
			conn,
		),
	)

	resp, err := http.ReadResponse(responseReader, nil)
	if err != nil {
		if conn != nil {
			conn.Close()
		}
		return nil, err
	}

	s.conn = conn

	return resp, nil
}

// NewConnection validates the upgrade response, creating and returning a new
// httpstream.Connection if there were no errors.
func (s *SpdyRoundTripper) NewConnection(resp *http.Response) (httpstream.Connection, error) {
	connectionHeader := strings.ToLower(resp.Header.Get(httpstream.HeaderConnection))
	upgradeHeader := strings.ToLower(resp.Header.Get(httpstream.HeaderUpgrade))
	if (resp.StatusCode != http.StatusSwitchingProtocols) || !strings.Contains(connectionHeader, strings.ToLower(httpstream.HeaderUpgrade)) || !strings.Contains(upgradeHeader, strings.ToLower(streamspdy.HeaderSpdy31)) {
		defer resp.Body.Close()
		responseError := ""
		responseErrorBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			responseError = "unable to read error from server response"
		} else {
			// TODO: I don't belong here, I should be abstracted from this class
			if obj, _, err := statusCodecs.UniversalDecoder().Decode(responseErrorBytes, nil, &metav1.Status{}); err == nil {
				if status, ok := obj.(*metav1.Status); ok {
					return nil, &apierrors.StatusError{ErrStatus: *status}
				}
			}
			responseError = string(responseErrorBytes)
			responseError = strings.TrimSpace(responseError)
		}

		return nil, fmt.Errorf("unable to upgrade connection: %s", responseError)
	}

	return streamspdy.NewClientConnectionWithPings(s.conn, s.pingPeriod)
}

// statusScheme is private scheme for the decoding here until someone fixes the TODO in NewConnection
var statusScheme = runtime.NewScheme()

// ParameterCodec knows about query parameters used with the meta v1 API spec.
var statusCodecs = serializer.NewCodecFactory(statusScheme)

func init() {
	statusScheme.AddUnversionedTypes(metav1.SchemeGroupVersion,
		&metav1.Status{},
	)
}