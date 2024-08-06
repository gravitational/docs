import cn from "classnames";
import { useState, useCallback, useEffect } from "react";
import HeadlessButton from "components/HeadlessButton";
import Search from "components/Search";
import Icon from "components/Icon";
import Link, { useCurrentHref } from "components/Link";
import {
  NavigationItem,
  NavigationCategory,
  ScopeType,
  ScopesInMeta,
} from "./types";
import styles from "./Navigation.module.css";
import { useVersionAgnosticPages } from "utils/useVersionAgnosticPages";
import { dirname } from "path";

const SCOPELESS_HREF_REGEX = /\?|\#/;

const SCOPE_DICTIONARY: Record<string, ScopeType> = {
  code3: "oss",
  building2: "enterprise",
  cloud2: "cloud",
};

interface DocsNavigationItemsProps {
  entries: NavigationItem[];
  onClick: () => void;
  currentPath: string;
  level?: number;
}

const DocsNavigationItems = ({
  entries,
  onClick,
  currentPath,
  level,
}: DocsNavigationItemsProps) => {
  const docPath = currentPath.split(SCOPELESS_HREF_REGEX)[0];
  const { getVersionAgnosticRoute } = useVersionAgnosticPages();
  const maxLevel = 3;
  if (!level) {
    level = 1;
  }

  return (
    <>
      {!!entries.length &&
        entries.map((entry) => {
          // Determine whether to highlight the entry in the navigation sidebar.
          // We highlight an entry if:
          // - It is the currently selected entry.
          // - One of its entries is either the currently selected entry or the
          //   parent of the currently selected entry.
          const selected = entry.slug === docPath;
          const active = hasChildEntry(entry, docPath);

          return (
            <li key={entry.slug}>
              <Link
                className={cn(
                  styles.link,
                  styles[`link-${level}`],
                  active && styles.active,
                  selected && styles.selected
                )}
                href={getVersionAgnosticRoute(entry.slug)}
                onClick={onClick}
              >
                {entry.title}
                {!!entry.entries?.length && (
                  <Icon size="sm" name="ellipsis" className={styles.ellipsis} />
                )}
              </Link>
              {!!entry.entries?.length && level <= maxLevel && (
                <ul className={cn(styles.submenu, active && styles.opened)}>
                  <DocsNavigationItems
                    entries={entry.entries}
                    onClick={onClick}
                    currentPath={currentPath}
                    level={level + 1}
                  />
                </ul>
              )}
            </li>
          );
        })}
    </>
  );
};

// hasChildEntry recursively descends through entry to determine if it or one of
// its children has the provided slug.
function hasChildEntry(entry: NavigationCategory, slug: string) {
  if (entry.slug === slug) {
    return true;
  }
  if (!entry.entries) {
    return false;
  }
  return entry.entries.some((e) => {
    return hasChildEntry(e, slug);
  });
}

interface DocNavigationCategoryProps extends NavigationCategory {
  id: number;
  opened: boolean;
  onToggleOpened: (value: number) => void;
  onClick: () => void;
  currentPath: string;
}

const DocNavigationCategory = ({
  id,
  opened,
  onToggleOpened,
  onClick,
  icon,
  title,
  entries,
  currentPath,
}: DocNavigationCategoryProps) => {
  const toggleOpened = useCallback(
    () => onToggleOpened(opened ? null : id),
    [id, opened, onToggleOpened]
  );

  return (
    <>
      <HeadlessButton
        className={cn(styles["category-header"], opened && styles.opened)}
        onClick={toggleOpened}
      >
        <Icon name={icon} className={styles["icon-category"]} />
        <div className={styles["category-title"]}>{title}</div>
        <Icon size="sm" name="arrow" className={styles["icon-arrow"]} />
      </HeadlessButton>
      {opened && (
        <ul className={styles["category-links"]}>
          <DocsNavigationItems
            entries={entries}
            onClick={onClick}
            currentPath={currentPath}
          />
        </ul>
      )}
    </>
  );
};

const hasSlug = (items: NavigationItem[], href: string) => {
  return items.some(({ slug, entries }) => {
    return slug === href || (!!entries && hasSlug(entries, href));
  });
};

export const getCurrentCategoryIndex = (
  categories: NavigationCategory[],
  href: string
) => {
  const scopelessHref = href.split(SCOPELESS_HREF_REGEX)[0];
  const index = categories.findIndex(({ entries }) =>
    hasSlug(entries, scopelessHref)
  );

  return index !== -1 ? index : null;
};

interface DocNavigationProps {
  section?: boolean;
  currentVersion?: string;
  data: NavigationCategory[];
  currentPathGetter?: () => string;
}

const DocNavigation = ({
  data,
  section,
  currentVersion,
  currentPathGetter,
}: DocNavigationProps) => {
  if (!currentPathGetter) {
    currentPathGetter = useCurrentHref;
  }
  const route = currentPathGetter();

  const [openedId, setOpenedId] = useState<number>(
    getCurrentCategoryIndex(data, route)
  );
  const [visible, setVisible] = useState<boolean>(false);
  const toggleMenu = useCallback(() => setVisible((visible) => !visible), []);

  useEffect(() => {
    setOpenedId(getCurrentCategoryIndex(data, route));
  }, [data, route]);

  return (
    <div className={cn(styles.wrapper, section && styles.section)}>
      <div className={styles.searchbar}>
        <Search />
        <HeadlessButton onClick={toggleMenu} className={styles.menu}>
          <Icon name={visible ? "close" : "hamburger"} size="md" />
        </HeadlessButton>
      </div>
      <nav className={cn(styles.nav, visible && styles.visible)}>
        <ul className={styles.categories}>
          {data.map((props, index) => (
            <li key={index}>
              <DocNavigationCategory
                key={index}
                id={index}
                opened={index === openedId}
                onToggleOpened={setOpenedId}
                onClick={toggleMenu}
                currentPath={route}
                {...props}
              />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default DocNavigation;
