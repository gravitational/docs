import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import type { AppProps } from "next/app";
import { DocsContextProvider } from "layouts/DocsPage/context";
import { posthog, sendEngagedView, sendPageview } from "utils/posthog";
import { TabContextProvider } from "components/Tabs";

// https://larsmagnus.co/blog/how-to-optimize-custom-fonts-with-next-font
// Next Font to enable zero layout shift which is hurting SEO.
import localUbuntu from "next/font/local";
import localLato from "next/font/local";
const ubuntu = localUbuntu({
  src: "../styles/assets/ubuntu-mono-400.woff2",
  variable: "--font-ubunt",
  display: "swap",
});
export const lato = localLato({
  src: [
    {
      path: "../styles/assets/lato-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../styles/assets/lato-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../styles/assets/lato-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../styles/assets/lato-700-italic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../styles/assets/lato-900.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../styles/assets/lato-900-italic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-lato",
  display: "swap",
});

import "styles/varaibles.css";
import "styles/global.css";
import { GoogleAdsEvent } from "utils/tracking";

const NEXT_PUBLIC_GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const NEXT_PUBLIC_GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID;
const NEXT_PUBLIC_GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const MUNCHKIN_ID = process.env.MUNCHKIN_ID;

interface dataLayerItem {
  [key: string]: unknown;
  event?: string;
}

declare global {
  var dataLayer: dataLayerItem[]; // eslint-disable-line no-var
}
const useIsEngaged = () => {
  const router = useRouter();
  const [timerReached, setTimerReached] = useState(false);
  const [secondPageReached, setSecondPageReached] = useState(false);
  const [isEngaged, setIsEngaged] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setTimerReached(true);
    }, 30000);
    const routeChanged = () => {
      setSecondPageReached(true);
    };

    router.events.on("routeChangeComplete", routeChanged);
    return () => {
      router.events.off("routeChangeComplete", routeChanged);
    };
  }, [router.events]);

  useEffect(() => {
    setIsEngaged(secondPageReached && timerReached);
  }, [secondPageReached, timerReached]);

  return isEngaged;
};
const Analytics = () => {
  return (
    <>
      <Script id="add_dataLayer">
        {`window.dataLayer = window.dataLayer || []`}
      </Script>
      {/* Munchin Script */}
      {MUNCHKIN_ID && (
        <>
          <Script id="munchkin-script">
            {`
          (function() {
            var didInit = false;
            function initMunchkin() {
              if(didInit === false) {
                didInit = true;
                Munchkin.init('${MUNCHKIN_ID}');
              }
            }
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = '//munchkin.marketo.net/munchkin.js';
            s.onreadystatechange = function() {
              if (this.readyState == 'complete' || this.readyState == 'loaded') {
                initMunchkin();
              }
            };
            s.onload = initMunchkin;
            document.getElementsByTagName('head')[0].appendChild(s);
          })();
        `}
          </Script>
        </>
      )}
      {/* End Munchin Script */}
      {/* Script for adding Qualified (https://www.qualified.com/)*/}
      <Script id="script_qualified">
        {`
              (function(w,q){
                w['QualifiedObject']=q;
                w[q]=w[q]||function(){
                  (w[q].q=w[q].q||[]).push(arguments)
                };
              })(window,'qualified')
            `}
      </Script>
      <Script src="https://js.qualified.com/qualified.js?token=GWPbwWJLtjykim4W" />
      {/* End script for adding Qualified */}
      {NEXT_PUBLIC_GTM_ID && (
        <>
          {/* Google Tag Manager */}
          <Script id="script_gtm">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${NEXT_PUBLIC_GTM_ID}');`}
          </Script>

          {/* End Google Tag Manager */}
          {/* Google Tag Manager (noscript) */}
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${NEXT_PUBLIC_GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
          {/* End Google Tag Manager (noscript) */}
        </>
      )}
      {NEXT_PUBLIC_GTAG_ID && (
        <>
          {/* GTAG */}
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GTAG_ID}`}
          />
          <Script id="script_gtag">
            {`window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', "${NEXT_PUBLIC_GTAG_ID}", {
                    send_page_view: false
                  });
                  gtag('config', "${NEXT_PUBLIC_GOOGLE_ADS_ID}", {
                    send_page_view: false
                  });`}
          </Script>
          {/* End GTag */}
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${NEXT_PUBLIC_GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
          {/* End Google Tag Manager (noscript) */}
        </>
      )}
      {/* Quailified Script */}
      <Script id="script_qualified">
        {`(function (w, q) {
          w["QualifiedObject"] = q;
          w[q] =
            w[q] ||
            function () {
              (w[q].q = w[q].q || []).push(arguments);
            };
        })(window, "qualified")`}
      </Script>
      <Script src="https://js.qualified.com/qualified.js?token=GWPbwWJLtjykim4W" />
    </>
  );
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const isEngaged = useIsEngaged();

  useEffect(() => {
    if (!isEngaged) return;
    // Trigger engagement view events here
    GoogleAdsEvent("30sView");
    sendEngagedView();
  }, [isEngaged]);

  const Pageviews = () => {
    // Trigger page views here
    // Google Ads Docs Page Conversion event
    GoogleAdsEvent("DocsPageView");
    // Qualified page view
    if (!!window["qualified"]) window["qualified"]("page");
    // Posthog page view
    sendPageview();
  };
  useEffect(() => {
    posthog(); // init posthog
    // Trigger initial load page views
    Pageviews();
    router.events.on("routeChangeComplete", Pageviews);
    return () => {
      router.events.off("routeChangeComplete", Pageviews);
    };
  }, [router.events]);

  return (
    <>
      <style jsx global>{`
        :root {
          --font-base: ${lato.style.fontFamily};
          --font-ubunt: ${ubuntu.style.fontFamily};
        }
      `}</style>
      <Analytics />
      <DocsContextProvider>
        <TabContextProvider>
          <Component {...pageProps} />
        </TabContextProvider>
      </DocsContextProvider>
    </>
  );
};

export default MyApp;
