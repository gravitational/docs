const DOCS_INDEX = process.env.ALGOLIA_DOCS_INDEX_NAME;

// Algolia API Parametres list: https://www.algolia.com/doc/api-reference/api-parameters/
export const getSearchQueries = (query: string, docsVer: string) => {
  return [
    {
      indexName: DOCS_INDEX,
      query: query,
      params: {
        hitsPerPage: 50,
      },
      filters: `docs_ver:${docsVer}`,
      restrictHighlightAndSnippetArrays: true,
      attributesToHighlight: ["content", "headers"],
      attributesToSnippet: ["content:30", "headers"],
      snippetEllipsisText: "…",
      highlightPreTag: "<b class='found-part'>",
      highlightPostTag: "</b>",
    },
  ];
};
