import React, {
  useEffect,
  useRef,
  createElement,
  Fragment,
  useContext,
  useState,
} from "react";
import { useRouter } from "next/router";
import { DocsContext } from "layouts/DocsPage/context";
import { autocomplete } from "@algolia/autocomplete-js";
import "@algolia/autocomplete-theme-classic";
import { render } from "react-dom";
import { debounced } from "utils/debounced";
import { ProductItem } from "./ProductItem";
import { getSearchResults, getEmptyNotice } from "./utils";
import type { SearchResultRecord } from "./types";
import styles from "./Search.module.css";

const ITEM_LINK: SearchResultRecord = {
  content: "",
  docs_ver: "",
  headers: ["Just click here"],
  label: "",
  objectID: "/docs/search-results/",
  title: "You can open the search results on a separate page",
  _snippetResult: {},
  _highlightResult: {},
};

const SearchAutocomplete = (props) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      container: containerRef.current,
      renderer: { createElement, Fragment },
      onSubmit() {
        window.location.href = "/docs/search-results/";
      },
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

export default function Search() {
  const { versions } = useContext(DocsContext);
  const router = useRouter();

  return (
    <>
      <SearchAutocomplete
        openOnFocus={false}
        placeholder="Search Docs"
        getSources={({ query }) => {
          return debounced([
            {
              sourceId: "docs_search",
              async getItems() {
                const isCurrent = !router.asPath.includes("/ver/");
                const items = await getSearchResults(
                  query,
                  isCurrent ? "current" : versions.current
                );
                if (items.length) items.unshift(ITEM_LINK);
                return items;
              },
              templates: {
                item({ item }) {
                  return <ProductItem hit={item} />;
                },
                noResults() {
                  return getEmptyNotice(query);
                },
              },
            },
          ]);
        }}
      />
    </>
  );
}
