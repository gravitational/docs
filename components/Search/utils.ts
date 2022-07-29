import type { SearchResultRecord, SearchResultMeta } from "./types";

export const SEACH_RESULTS_KEY = "docs-search-results";

export const storeSearchResults = (data: SearchResultMeta): boolean => {
  try {
    sessionStorage.setItem(SEACH_RESULTS_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
};

export const getSearchResults = async (
  query: string,
  version?: string
): Promise<SearchResultRecord[]> => {
  try {
    let url = `/docs/api/search/?query=${query}`;

    if (version) {
      url += `&ver=${version}`;
    }

    const rawResponse = await fetch(url, {
      method: "GET",
    });

    const response = await rawResponse.json();
    const results: SearchResultRecord[] = response.map((res) => ({
      ...res,
      label: res.title,
    }));

    storeSearchResults({ query, results, version });

    return results;
  } catch (e) {
    console.error(e);
  }
};

export const getEmptyNotice = (query: string): string => {
  return `No results were found for the search '${query}'`;
};
