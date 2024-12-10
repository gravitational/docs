const isDatalayerEnabled = () => {
  typeof window !== "undefined" && !!window.dataLayer;
};

// Wrapper around datalayer calls to prevent errors

export const TrackingEvent = (
  event: string,
  payload: Record<string, unknown> = {}
): Promise<void> => {
  return new Promise<void>((resolve) => {
    if (isDatalayerEnabled) {
      window.dataLayer.push({
        event,
        ...payload,
        /* eventCallback and eventTimeout are not found in GTM official docs!
        eventCallback is a function which will execute when all tags which fire on
        the event have executed; it is scoped to this promise. Always add eventTimeout
        when you use eventCallback.
        */
        eventCallback: () => resolve(),

        /*eventTimeout takes a number in milliseconds as a value after which it calls eventCallback, so
        even if the tags don't fire or signal completion, eventCallback will be invoked (and
        this promise resolved)
        */
        eventTimeout: 1000,
      });
    } else {
      console.log("Datalayer Tracking Event", payload);
      resolve();
    }
  });
};
