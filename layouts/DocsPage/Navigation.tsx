import { useState, useCallback, useEffect } from "react";
import HeadlessButton from "components/HeadlessButton";
import Search from "components/Search";
import Icon from "components/Icon";
import { useCurrentHref } from "components/Link";
import { NavigationItem, NavigationCategory } from "./types";
import * as styles from "./Navigation.css";
import { DocNavigationCategory } from "./NavigationCategory";

const SCOPELESS_HREF_REGEX = /\?|\#/;

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
  section: boolean;
  currentVersion?: string;
  data: NavigationCategory[];
}

const DocNavigation = ({ data, section }: DocNavigationProps) => {
  const route = useCurrentHref();

  const [openedId, setOpenedId] = useState<number>(
    getCurrentCategoryIndex(data, route)
  );
  const [visible, setVisible] = useState<boolean>(false);
  const toggleMenu = useCallback(() => setVisible((visible) => !visible), []);

  useEffect(() => {
    setOpenedId(getCurrentCategoryIndex(data, route));
  }, [data, route]);

  return (
    <div className={styles.wrapper({ section })}>
      <div className={styles.searchbar}>
        <Search />
        <HeadlessButton onClick={toggleMenu} className={styles.menu}>
          <Icon name={visible ? "close" : "hamburger"} size="md" />
        </HeadlessButton>
      </div>
      <nav className={styles.nav({ visible })}>
        <ul className={styles.categories}>
          {data.map((props, index) => (
            <li key={index}>
              <DocNavigationCategory
                key={index}
                id={index}
                opened={index === openedId}
                onToggleOpened={setOpenedId}
                onClick={toggleMenu}
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
