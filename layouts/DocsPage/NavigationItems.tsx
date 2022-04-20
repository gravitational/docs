import cn from "classnames";
import { useRouter } from "next/router";
import Icon from "components/Icon";
import Link, { useCurrentHref } from "components/Link";
import { getScopeFromUrl } from "./context";
import { NavigationItem } from "./types";
import * as styles from "./NavigationItems.css";

const SCOPELESS_HREF_REGEX = /\?|\#/;

interface DocsNavigationItemsProps {
  entries: NavigationItem[];
  onClick: () => void;
}

export const DocsNavigationItems = ({
  entries,
  onClick,
}: DocsNavigationItemsProps) => {
  const router = useRouter();
  const docPath = useCurrentHref().split(SCOPELESS_HREF_REGEX)[0];
  const urlScope = getScopeFromUrl(router.asPath);

  return (
    <>
      {!!entries.length &&
        entries.map((entry) => {
          const selected = entry.slug === docPath;
          const active =
            selected || entry.entries?.some((entry) => entry.slug === docPath);
          const hidden = Array.isArray(entry.hideInScopes)
            ? entry.hideInScopes.includes(urlScope)
            : entry.hideInScopes === urlScope;

          return (
            <li key={entry.slug}>
              {hidden ? null : (
                <Link
                  className={cn(
                    styles.link,
                    active && styles.active,
                    selected && styles.selected
                  )}
                  href={entry.slug}
                  onClick={onClick}
                >
                  {entry.title}
                  {!!entry.entries?.length && (
                    <Icon
                      size="sm"
                      name="ellipsis"
                      className={styles.ellipsis}
                    />
                  )}
                </Link>
              )}
              {!!entry.entries?.length && (
                <ul className={styles.submenu({ opened: active && !hidden })}>
                  <DocsNavigationItems
                    entries={entry.entries}
                    onClick={onClick}
                  />
                </ul>
              )}
            </li>
          );
        })}
    </>
  );
};
