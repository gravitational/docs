import type { NextApiRequest, NextApiResponse } from "next";
import algoliasearch from "algoliasearch";

const APP_ID = process.env.ALGOLIA_APP_ID;
const API_KEY = process.env.ALGOLIA_API_KEY;
const DOCS_INDEX = process.env.ALGOLIA_DOCS_INDEX_NAME;

const client = algoliasearch(APP_ID, API_KEY);
const index = client.initIndex(DOCS_INDEX);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let rawResults = [];
  let docsVer = req.query.ver;

  if (!docsVer) {
    docsVer = req.headers.referer.includes("ver/")
      ? req.headers.referer.split("ver/")[1].split("/")[0]
      : "current";
  }

  try {
    const { hits } = await index.search(req.query.query as string, {
      hitsPerPage: 50,
      filters: `docs_ver:${docsVer}`,
      restrictHighlightAndSnippetArrays: true,
      attributesToHighlight: ["content", "headers"],
      attributesToSnippet: ["content:20", "headers"],
      snippetEllipsisText: "…",
      highlightPreTag: "<b class='found-part'>",
      highlightPostTag: "</b>",
    });

    rawResults = hits;

    const finishResult = rawResults.map((hit) => {
      const title = hit.title?.includes("|")
        ? hit.title.split("|")[0].trim()
        : hit.title;
      hit._highlightResult.headers?.sort(
        (a, b) => b.matchedWords.length - a.matchedWords.length
      );
      return { ...hit, title };
    });
    res.status(200).json(finishResult);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
