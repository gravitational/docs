export const isGtagEnabled = () => {
  return typeof window !== "undefined" && !!window.dataLayer;
};
type ConversionLabel = "DocsPageView" | "30sView";
export const GoogleAdsEvent = (
  conversion_label: ConversionLabel,
  payload: Record<string, unknown> = {}
): Promise<void> => {
  return new Promise<void>((resolve) => {
    if (isGtagEnabled()) {
      const getLabel = (label: ConversionLabel) => {
        switch (label) {
          case "DocsPageView":
            return "bhkmCKaO5_AYEN2k6cID";
          case "30sView":
            return "Dt85CKqO7vAYEN2k6cID";
        }
      };
      // Define that we're sending a Google Ads conversion event
      // https://developers.google.com/tag-platform/devguides/events#google_ads_conversions
      // the gtag() function in the docs effectively just calls window.dataLayer.push()
      window.dataLayer.push({
        event: "conversion",
        // send_to: Defines the type of conversion we're sending
        send_to: `${process.env["NEXT_PUBLIC_GOOGLE_ADS_ID"]}/${getLabel(
          conversion_label
        )}`,
        // Payload: rest of the values for the conversion
        ...payload,
        /*eventCallback and eventTimeout are not found in GTM official docs!
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
      console.log("Google Ads Tracking Event", payload);
      resolve();
    }
  });
};
