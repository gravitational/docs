/*=========================================================
  Google Tag Manager - clone of /next, not all functionality here is implemented in /blog
=========================================================*/
export const isTagManagerEnabled = () =>
  typeof window !== "undefined" && !!window.dataLayer;

// Wrapper around GTM calls to prevent errors then used locally with disabled GTM.
export const GTMEvent = (
  event: string,
  payload: Record<string, unknown>
): Promise<void> => {
  return new Promise<void>((resolve) => {
    if (isTagManagerEnabled()) {
      window.dataLayer.push({
        event,
        ...payload,

        /**eventCallback and eventTimeout are not found in GTM official docs!
        eventCallback is a function which will execute when all tags which fire on
        the event have executed; it is scoped to this promise. Always add eventTimeout
        when you use eventCallback.
        */
        eventCallback: () => resolve(),

        /**eventTimeout takes a number in milliseconds as a value after which it calls eventCallback, so
        even if the tags don't fire or signal completion, eventCallback will be invoked (and 
        this promise resolved)
        */
        eventTimeout: 1000,
      });
    } else {
      console.log("GTM is not enabled.");
      console.log("GTM Event", payload);
      resolve();
    }
  });
};

export const GTMPageView = (page: string) => GTMEvent("pageview", { page });

export type DataLayerEvent = {
  event: string;
} & Record<string, unknown>;

export const addDataLayerEvent = ({ event, ...args }: DataLayerEvent) => {
  window.dataLayer = window.dataLayer || []; // Ensure data later array;
  window.dataLayer.push({ event, ...args }); // Accepts any valid GTM argument
};

/*=========================================================
  Google Analytics
=========================================================*/
export enum EventCategory {
  PricingButtons = "Pricing Buttons",
  EnterpriseSignupButtons = "Enterprise Signup Buttons",
  DownloadButtons = "Download Buttons",
  ExperimentConversion = "Experiment Conversion",
}

export enum EventAction {
  ButtonClick = "Button Click",
}

export enum EventLabel {}

export type AnalyticsEvent = {
  action: EventAction | `${EventAction}`;
  category: EventCategory | `${EventCategory}`;
  label: string;
  value?: number;
};

export const sendAnalyticsEvent = ({
  action,
  category,
  label,
  value,
}: AnalyticsEvent) => {
  const { pathname = "" } = window?.location;
  const path = `${action} ${pathname}`;

  window?.gtag("event", path, {
    event_category: category,
    event_label: label,
    value,
  });
};
