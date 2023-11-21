/*
Copyright 2015 Gravitational, Inc.

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

package ui

import (
	"context"
	"sort"
	"time"

	"github.com/gravitational/trace"

	"github.com/gravitational/teleport"
	"github.com/gravitational/teleport/api/types"
	"github.com/gravitational/teleport/lib/reversetunnelclient"
	"github.com/gravitational/teleport/lib/services"
)

// Cluster describes a cluster
type Cluster struct {
	// Name is the cluster name
	Name string `json:"name"`
	// LastConnected is the cluster last connected time
	LastConnected time.Time `json:"lastConnected"`
	// Status is the cluster status
	Status string `json:"status"`
	// PublicURL is this cluster public URL (its first available proxy URL),
	// or possibly empty if no proxies could be loaded.
	PublicURL string `json:"publicURL"`
	// AuthVersion is the cluster auth's service version
	AuthVersion string `json:"authVersion"`
	// ProxyVersion is the cluster proxy's service version,
	// or possibly empty if no proxies could be loaded.
	ProxyVersion string `json:"proxyVersion"`
}

// NewClusters creates a slice of Cluster's, containing data about each cluster.
func NewClusters(remoteClusters []reversetunnelclient.RemoteSite) ([]Cluster, error) {
	clusters := make([]Cluster, 0, len(remoteClusters))
	for _, site := range remoteClusters {
		// Other fields such as node count, url, and proxy/auth versions are not set
		// because each cluster will need to make network calls to retrieve information
		// which does not scale well (ie: 1k clusters, each request will take seconds).
		cluster := &Cluster{
			Name:          site.GetName(),
			LastConnected: site.GetLastConnected(),
			Status:        site.GetStatus(),
		}

		clusters = append(clusters, *cluster)
	}

	sort.Slice(clusters, func(i, j int) bool {
		return clusters[i].Name < clusters[j].Name
	})

	return clusters, nil
}

// NewClustersFromRemote creates a slice of Cluster's, containing data about each cluster.
func NewClustersFromRemote(remoteClusters []types.RemoteCluster) ([]Cluster, error) {
	clusters := make([]Cluster, 0, len(remoteClusters))
	for _, rc := range remoteClusters {
		cluster := Cluster{
			Name:          rc.GetName(),
			LastConnected: rc.GetLastHeartbeat(),
			Status:        rc.GetConnectionStatus(),
		}
		clusters = append(clusters, cluster)
	}
	return clusters, nil
}

// GetClusterDetails retrieves and sets details about a cluster
func GetClusterDetails(ctx context.Context, site reversetunnelclient.RemoteSite, opts ...services.MarshalOption) (*Cluster, error) {
	clt, err := site.CachingAccessPoint()
	if err != nil {
		return nil, trace.Wrap(err)
	}

	proxies, err := clt.GetProxies()
	if err != nil {
		return nil, trace.Wrap(err)
	}
	proxyHost, _, err := services.GuessProxyHostAndVersion(proxies)
	if err != nil && !trace.IsNotFound(err) {
		return nil, trace.Wrap(err)
	}

	authServers, err := clt.GetAuthServers()
	if err != nil {
		return nil, trace.Wrap(err)
	}

	// sort auth servers newest first, so we get the most up to date version
	authVersion := ""
	sort.Slice(authServers, func(i, j int) bool {
		return authServers[i].Expiry().After(authServers[j].Expiry())
	})
	if len(authServers) > 0 {
		authVersion = authServers[0].GetTeleportVersion()
	}

	return &Cluster{
		Name:          site.GetName(),
		LastConnected: site.GetLastConnected(),
		Status:        site.GetStatus(),
		PublicURL:     proxyHost,
		AuthVersion:   authVersion,

		// this code runs in the proxy service, so we can safely
		// use the version embedded in the binary
		ProxyVersion: teleport.Version,
	}, nil
}