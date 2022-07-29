import { useCallback, useEffect, useState } from "react";
import { unpackSearchResults } from "utils/general";
import { getEmptyNotice, getSearchResults } from "./utils";
import { ProductItem } from "./ProductItem";
import type { SearchResultRecord } from "./types";
import styles from "./SeparateSearch.module.css";

const SEARCH_THRESHOLD = 1000;

export default function SeparateSearch() {
  const [savedSearchResults] = useState(() => unpackSearchResults());
  const version = savedSearchResults?.version || "current";
  const [delayed, setDelayed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(savedSearchResults?.query || "");
  const [results, setResults] = useState<SearchResultRecord[]>(
    savedSearchResults?.results || []
  );

  useEffect(() => {
    let stopped = false;

    const doSearch = async (toSearch: string) => {
      try {
        setLoading(true);
        const results = await getSearchResults(toSearch, version);
        if (stopped) return;
        setResults(results);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    if (!value) {
      setResults([]);
      return;
    }

    if (value === savedSearchResults?.query) {
      setResults(savedSearchResults?.results);
      return;
    }

    setDelayed(true);

    const timer = setTimeout(() => {
      setDelayed(false);
      doSearch(value);
    }, SEARCH_THRESHOLD);

    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [version, value, savedSearchResults]);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  let notice: string = "";

  if (value && !results.length && !loading && !delayed) {
    notice = getEmptyNotice(value);
  } else if (loading) {
    notice = "Pending results";
  }

  let placeholder = `Search Docs`;

  if (version !== "current") {
    placeholder += ` (version ${version})`;
  }

  return (
    <div className={styles["wrapper-content"]}>
      <input
        className={styles.input}
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
      />
      <ul className={styles["results-list"]}>
        {results.map((r) => {
          return (
            <li key={r.objectID} className={styles["results-row"]}>
              <ProductItem hit={r} isExtended={true} />
            </li>
          );
        })}
      </ul>
      {!!notice && <p className={styles.notice}>{notice}</p>}
    </div>
  );
}
