import posthogGlobal from "posthog-js";
import type { PostHog } from "posthog-js";

// Imported the keys directly to prevent circular dependencies error with NX

const PH_API_KEY = process.env["NEXT_PUBLIC_POSTHOG_API_KEY"];
const PH_API_URL = process.env["NEXT_PUBLIC_POSTHOG_API_URL"];
const PH_IS_ENABLED = process.env["NEXT_PUBLIC_POSTHOG_ENABLED"] === "true";

let inited = false;

export const posthog = async (): Promise<PostHog | undefined> => {
  return new Promise((resolve) => {
    if (inited) {
      resolve(posthogGlobal);

      return;
    }

    if (PH_IS_ENABLED && PH_API_URL && PH_API_KEY) {
      posthogGlobal.init(PH_API_KEY, {
        api_host: PH_API_URL,
        advanced_disable_decide: true,
        get_device_id: (id) => `web.${id}`,
        loaded: (ph) => {
          inited = true;
          window["posthog"] = ph;
          resolve(ph);
        },
      });

      return;
    }

    resolve(undefined);
  });
};

export const sendPageview = async () => {
  const ph = await posthog();
  ph?.capture("$pageview");
};

export const sendPageNotFoundError = async () => {
  const ph = await posthog();
  ph?.capture("web.errors.pageNotFound");
};

export const sendDocsFeedback = async (rating: string, comment: string) => {
  const ph = await posthog();

  ph?.capture("web.docs.feedback", {
    "web.docs.rating": rating,
    "web.docs.comment": comment,
  });
};
