import React, { useEffect, useRef, createElement, Fragment } from "react";
import styles from "./Search.module.css";
import { autocomplete } from "@algolia/autocomplete-js";
import "@algolia/autocomplete-theme-classic";
import { render } from "react-dom";
import { debounced } from "utils/debounced";
import { SearchStyles } from "./SearchStyles";

export interface SearchProps {
  id?: string;
  version?: string;
  className?: string;
}

export const getSearchResults = async (query: string) => {
  try {
    const rawResponse = await fetch(`/docs/api/search/?query=${query}`, {
      method: "GET",
    });

    const response = await rawResponse.json();
    return response.map((res) => ({ ...res, label: res.title }));
  } catch (e) {
    console.error(e);
  }
};

const SearchAutocomplete = ({
  id = "search",
  version,
  className,
  ...props
}: SearchProps) => {
  const containerRef = useRef(null);
  // docsearch.js is using "window" inside, so it will break ssr if we import it directly
  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      container: containerRef.current,
      renderer: { createElement, Fragment },
      render({ children }, root) {
        render(children, root);
      },
      ...props,
    });

    return () => {
      search.destroy();
    };
  }, [props]);

  return <div className={styles["wrapper-autocomplete"]} ref={containerRef} />;
};

function ProductItem({ hit }) {
  let foundHeader = "";
  let foundContent = "";

  if (hit._snippetResult.headers?.length) {
    foundHeader = hit._snippetResult.headers[0].value;
  } else if (hit._snippetResult.content) {
    foundContent = hit._snippetResult.content.value;
  }

  return (
    <a href={hit.objectID} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemTitle">
          <p className={styles.title}>{hit.title}</p>
          {foundHeader && (
            <h3 className={styles["found-header"]}>{foundHeader}</h3>
          )}
          {foundContent && (
            <p className={styles["found-content"]}>{foundContent}</p>
          )}
        </div>
      </div>
    </a>
  );
}

export default function Search() {
  return (
    <>
      <SearchStyles />
      <SearchAutocomplete
        openOnFocus={false}
        placeholder="Search Docs"
        getSources={({ query }) => {
          return debounced([
            {
              sourceId: "docs_search",
              async getItems() {
                const result = await getSearchResults(query);
                return result;
              },
              templates: {
                item({ item }) {
                  return <ProductItem hit={item} />;
                },
                noResults() {
                  return `No results were found for the search '${query}'`;
                },
              },
            },
          ]);
        }}
      />
    </>
  );
}
