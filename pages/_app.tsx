import Script from "next/script";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { DocsContextProvider } from "layouts/DocsPage/context";
// import { GTMPageView } from "utils/gtm";

import "styles/varaibles.css";
import "styles/fonts-ubuntu.css";
import "styles/fonts-lato.css";
import "styles/global.css";
import "styles/algolia-search.css";

const NEXT_PUBLIC_GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export interface dataLayerItem {
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
    </>
  );
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    // const onRouteChangeComplete = (url: string) => GTMPageView(url);

    // router.events.on("routeChangeComplete", onRouteChangeComplete);

    // const cleanup = () =>
    //   router.events.off("routeChangeComplete", onRouteChangeComplete);

    // return cleanup;
  }, [router.events, router.query]);

  return (
    <>
      <Analytics />
      <DocsContextProvider>
        <Component {...pageProps} />
      </DocsContextProvider>
    </>
  );
};

export default MyApp;
