export interface MatchRecord {
  matchLevel: string;
  matchedWords: string;
  value: string;
}

export interface SearchResultRecord {
  content: string;
  docs_ver: string;
  headers: string[];
  label: string;
  objectID: string;
  title: string;
  _highlightResult?: { content?: MatchRecord; headers?: MatchRecord[] };
  _snippetResult?: { content?: MatchRecord; headers?: MatchRecord[] };
}

export interface SearchResultMeta {
  query: string;
  results: SearchResultRecord[];
  version?: string;
}
