/*
 * Wrapper around GTM calls to prevent erros then used locally with disabled GTM.
 */

interface Event {
  [key: string]: unknown;
  event: string;
}

declare global {
  var dataLayer: Event[]; // eslint-disable-line no-var
}

const isGTMEnabled = () => typeof window !== "undefined" && !!window.dataLayer;

export const GTMEvent = (
  event: string,
  payload: Record<string, unknown>
): Promise<void> => {
  return new Promise<void>((resolve) => {
    if (isGTMEnabled()) {
      dataLayer.push({
        event,
        ...payload,
        eventCallback: () => resolve(),
        eventTimeout: 1000, // Automatically resolves callback if it is not fired before timeout
      });
    } else {
      console.log("GTM Event", payload);

      resolve();
    }
  });
};

export const GTMPageView = (page: string) => GTMEvent("pageview", { page });
