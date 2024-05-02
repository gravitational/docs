/* GTAG GA4 Events */

export const isGtagEnabled = () =>
  typeof window !== "undefined" && !!window.dataLayer;

// Wraepper around GA4 tracking calls to prevent errors when used locally

export const TrackingEvent = (
  event: string,
  payload: Record<string, unknown> = {}
) => {
  return new Promise<void>((resolve) => {
    if (isGtagEnabled()) {
      window.gtag("event", event, {
        ...payload,
      });
    } else {
      console.log("GA4 Tracking Event", payload);
      resolve();
    }
  });
};
