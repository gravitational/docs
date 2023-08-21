const PROJECT_ID = process.env["NEXT_PUBLIC_SANITY_PROJECT_ID"] || "";
const DATASET = process.env["NEXT_PUBLIC_SANITY_DATASET"] || "";

const query = `*[_type == "event" && ((now() <= start) || (now() <= end))] | order(start asc) {
    title,
    description,
    link,
    start,
    end,
    location
  }`;

export async function fetchEventsFromSanity() {
  const apiUrl = `https://${PROJECT_ID}.api.sanity.io/v1/data/query/${DATASET}?query=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching Sanity document:", error);
    throw error;
  }
}
