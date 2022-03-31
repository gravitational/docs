import cn from "classnames";
import { useEffect } from "react";
import Icon from "components/Icon";
import docVersions from "../../config.json";
import styles from "./Search.module.css";

export interface SearchProps {
  id?: string;
  version?: string;
  className?: string;
}

const ALGOLIA_HITS = 5 * docVersions.versions.length;
const CURRENT_VERS = docVersions.versions.find((vers) => vers.latest).name;

const Search = ({
  id = "search",
  version,
  className,
  ...props
}: SearchProps) => {
  // docsearch.js is using "window" inside, so it will break ssr if we import it directly
  useEffect(() => {
    import("docsearch.js").then(({ default: docsearch }) => {
      docsearch({
        apiKey: process.env.NEXT_PUBLIC_DOCSEARCH_API_KEY,
        indexName: "goteleport",
        inputSelector: `[data-docsearch-input="${id}"]`,
        debug: false,
        algoliaOptions: {
          hitsPerPage: ALGOLIA_HITS,
        },
        transformData: function (hits) {
          return hits
            .filter((hit) => {
              if (CURRENT_VERS === version) {
                return !hit.url.includes("/ver/");
              }

              return hit.url.includes(version);
            })
            .slice(0, 5);
        },
      });
    });
  }, [id, version]);

  return (
    <>
      <div className={cn(styles.wrapper, className)} {...props}>
        <Icon name="magnify" className={styles.icon} />
        <input
          className={styles.input}
          type="text"
          placeholder="Search docs..."
          data-docsearch-input={id}
        />
      </div>
    </>
  );
};

export default Search;
