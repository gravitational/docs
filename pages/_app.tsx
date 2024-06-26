import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import type { AppProps } from "next/app";
import { DocsContextProvider } from "layouts/DocsPage/context";
import { posthog, sendPageview } from "utils/posthog";
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

const NEXT_PUBLIC_REDDIT_ID = process.env.NEXT_PUBLIC_REDDIT_ID;
const NEXT_PUBLIC_GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const NEXT_PUBLIC_GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID;
const MUNCHKIN_ID = process.env.MUNCHKIN_ID;

interface dataLayerItem {
  [key: string]: unknown;
  event?: string;
}

declare global {
  var dataLayer: dataLayerItem[]; // eslint-disable-line no-var
}

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
                  });`}
          </Script>
          {/* End GTag */}
        </>
      )}

      {NEXT_PUBLIC_REDDIT_ID && (
        <>
          {/* Reddit Pixel */}
          <Script id="reddit-pixel">
            {`!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','${NEXT_PUBLIC_REDDIT_ID}');rdt('track', 'PageVisit');`}
          </Script>
          {/* DO NOT MODIFY UNLESS TO REPLACE A USER IDENTIFIER /*}
      {/* End Reddit Pixel */}
        </>
      )}
    </>
  );
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    posthog(); // init posthog

    router.events.on("routeChangeComplete", sendPageview);

    return () => {
      router.events.off("routeChangeComplete", sendPageview);
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
