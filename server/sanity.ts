const PROJECT_ID = process.env["NEXT_PUBLIC_SANITY_PROJECT_ID"] || "";
const DATASET = process.env["NEXT_PUBLIC_SANITY_DATASET"] || "";

const query = ` *[_type == "topBanner"][0] {
      bannerType,
      event -> {
        location,
        link,
        title,
        start,
        end,
        isVirtual,
      },
      title,
      cta,
      link,
      end,
    }`;

export async function fetchEventsFromSanity() {
  const apiUrl = `https://${PROJECT_ID}.api.sanity.io/v1/data/query/${DATASET}?query=${encodeURIComponent(
    query
  )}`;

  const response = await fetch(apiUrl);

  const data = await response.json();
  if (data?.bannerType === "event")
    return { ...data?.event, cta: data?.cta, bannerType: data?.bannerType };
  return data;
}
