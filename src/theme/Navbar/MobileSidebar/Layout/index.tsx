import React from "react";
import clsx from "clsx";
import { useNavbarSecondaryMenu } from "@docusaurus/theme-common/internal";
import type { Props } from "@theme/Navbar/MobileSidebar/Layout";
import SearchBar from "@theme/SearchBar";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import { translate } from "@docusaurus/Translate";
import IconClose from "@theme/Icon/Close";
import Version from "@theme-original/NavbarItem/DocsVersionDropdownNavbarItem";

export default function NavbarMobileSidebarLayout({
  primaryMenu,
  secondaryMenu,
}: Props): JSX.Element {
  const { shown: secondaryMenuShown } = useNavbarSecondaryMenu();
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <div className="navbar-sidebar">
      <div className="navbar-sidebar__controls">
        <div className="navbar-sidebar__versions">
          Version: <Version dropdownItemsBefore={[]} dropdownItemsAfter={[]} />
        </div>
        <button
          type="button"
          aria-label={translate({
            id: "theme.docs.sidebar.closeSidebarButtonAriaLabel",
            message: "Close navigation bar",
            description: "The ARIA label for close button of mobile sidebar",
          })}
          className="clean-btn navbar-sidebar__close"
          onClick={() => mobileSidebar.toggle()}
        >
          <IconClose color="var(--ifm-color-emphasis-600)" />
        </button>
      </div>
      <div className="navbar-sidebar__search">
        <SearchBar />
      </div>
      <div
        className={clsx("navbar-sidebar__items", {
          "navbar-sidebar__items--show-secondary": secondaryMenuShown,
        })}
      >
        <div className="navbar-sidebar__item menu">{primaryMenu}</div>
        <div className="navbar-sidebar__item menu">{secondaryMenu}</div>
      </div>
    </div>
  );
}
