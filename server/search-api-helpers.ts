const SITE_INDEX = process.env.ALGOLIA_SITE_INDEX_NAME;
const BLOG_INDEX = process.env.ALGOLIA_BLOG_INDEX_NAME;
const RESOURCES_INDEX = process.env.ALGOLIA_RESOURCES_INDEX_NAME;

export type indexName = "blog" | "site" | "resources";

// Algolia API Parametres list: https://www.algolia.com/doc/api-reference/api-parameters/
export const getSearchQuery = (indexName: indexName, query: string) => {
  return {
    indexName: indexName,
    query: query,
    params: {
      hitsPerPage: 50,
    },
    restrictHighlightAndSnippetArrays: true,
    attributesToHighlight: ["content", "headers"],
    attributesToSnippet: ["content:30", "headers"],
    snippetEllipsisText: "…",
    highlightPreTag: "<b class='found-part'>",
    highlightPostTag: "</b>",
  };
};

export const getSearchQueries = (indexName: indexName, query: string) => {
  let setIndexName = [];

  switch (indexName) {
    case "blog":
      setIndexName = [BLOG_INDEX, RESOURCES_INDEX, SITE_INDEX];
      break;
    case "resources":
      setIndexName = [RESOURCES_INDEX, BLOG_INDEX, SITE_INDEX];
      break;
    default:
      setIndexName = [SITE_INDEX, BLOG_INDEX, RESOURCES_INDEX];
  }

  return setIndexName.map((index) => getSearchQuery(index, query));
};

function debouncePromise(fn, time: number) {
  let timerId = undefined;

  return function debounced(...args) {
    if (timerId) {
      clearTimeout(timerId);
    }

    return new Promise((resolve) => {
      timerId = setTimeout(() => resolve(fn(...args)), time);
    });
  };
}

export const debounced = debouncePromise(
  (items) => Promise.resolve(items),
  500
);
