const PROJECT_ID = process.env["NEXT_PUBLIC_SANITY_PROJECT_ID"] || "";
const DATASET = process.env["NEXT_PUBLIC_SANITY_DATASET"] || "";

const query = `*[_type == "event" && ((now() <= start) || (now() <= end))] | order(start asc) {
    title,
    description,
    link,
    start,
    end,
    location,
    featured,
  }`;

export async function fetchEventsFromSanity() {
  const apiUrl = `https://${PROJECT_ID}.api.sanity.io/v1/data/query/${DATASET}?query=${encodeURIComponent(
    query
  )}`;

  const response = await fetch(apiUrl);

  const data = await response.json();
  return data.result || [];
}
