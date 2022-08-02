import cn from "classnames";
import type { SearchResultRecord } from "./types";
import styles from "./ProductItem.module.css";
import "@algolia/autocomplete-theme-classic";

interface ProductItemProps {
  hit: SearchResultRecord;
  isExtended?: boolean;
}

export function ProductItem({ hit, isExtended }: ProductItemProps) {
  if (hit.objectID === "/docs/search-results/") {
    return (
      <a href={hit.objectID} className="aa-ItemLink">
        <div className="aa-ItemContent">
          <div className="aa-ItemTitle">
            <p className={styles.title}>
              {hit.title}
              <span className={styles.text}>Just Click Here</span>
            </p>
          </div>
        </div>
      </a>
    );
  }

  let foundHeader = "";
  let foundContent = "";
  let extendFoundContent = "";

  const exactHeaderMatch = hit._snippetResult.headers?.find(
    (header) => header.matchLevel === "full"
  );

  if (hit._snippetResult.content?.matchLevel === "full" || exactHeaderMatch) {
    if (exactHeaderMatch) {
      foundHeader = exactHeaderMatch.value;

      if (isExtended && hit._snippetResult.content) {
        extendFoundContent = hit._snippetResult.content.value;
      }
    } else {
      foundContent = hit._snippetResult.content.value;
    }
  } else if (
    hit._highlightResult.headers?.[0].matchedWords?.length >
    hit._highlightResult.content?.matchedWords?.length
  ) {
    foundHeader = hit._snippetResult.headers[0].value;

    if (isExtended && hit._snippetResult.content) {
      extendFoundContent = hit._snippetResult.content.value;
    }
  } else {
    foundContent = hit._snippetResult.content.value;
  }

  return (
    <a href={hit.objectID} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemTitle">
          <p className={cn(styles.title, isExtended && styles["title-extend"])}>
            {hit.title}
          </p>
          {foundHeader && (
            <h3
              className={styles["found-header"]}
              dangerouslySetInnerHTML={{ __html: foundHeader }}
            ></h3>
          )}
          {foundContent && (
            <p
              className={styles["found-content"]}
              dangerouslySetInnerHTML={{ __html: foundContent }}
            ></p>
          )}
          {isExtended && extendFoundContent && (
            <p
              className={styles["found-content"]}
              dangerouslySetInnerHTML={{ __html: extendFoundContent }}
            ></p>
          )}
        </div>
      </div>
    </a>
  );
}
