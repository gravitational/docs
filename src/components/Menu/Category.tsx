import { clsx } from "clsx";
import { useClickAway } from "react-use";
import { useCallback, useRef, useState, useEffect } from "react";

import type { NavigationItem } from "../../../server/sanity-types";
import Icon from "../Icon";
import Link from "../Link";
import {
  DropdownMenu,
  DropdownSection,
  DropdownMenuItem,
  DropdownSubMenu,
} from "../DropdownMenu";

import styles from "./Category.module.css";

export interface MenuCategoryProps {
  title: string;
  url?: string;
  isDropdown?: string;
  testId?: string;
  menuType?: string;
  columns?: NavigationItem["columns"];
  submenus?: NavigationItem["submenus"];
  onClick?: () => void | undefined | Promise<void>;
}

interface MenuCategoryComponentProps extends MenuCategoryProps {
  id: number;
  opened: boolean;
  onToggleOpened: (id: number | null) => void;
  onHover: (id: number | null) => void;
}

const MenuCategory = ({
  id,
  opened,
  title,
  menuType,
  isDropdown,
  columns,
  submenus,
  url,
  onToggleOpened,
  onHover,
  testId,
  onClick,
}: MenuCategoryComponentProps) => {
  const ref = useRef(null);
  const menuTestId = `${testId}-menu`;
  const [isMobile, setIsMobile] = useState(false);
  const handleResize = () => {
    setIsMobile(window.innerWidth < 1125);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useClickAway(ref, () => {
    if (!isMobile && opened) {
      onToggleOpened(null);
    }
  });

  const children =
    isDropdown === "dropdown"
      ? menuType === "submenus"
        ? submenus
        : columns
      : null;
  const toggleOpened = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (children) {
        e?.preventDefault();
        !opened ? onToggleOpened(id) : onToggleOpened(null);
      } else {
        onClick && onClick();
      }
    },
    [opened, children, id, onToggleOpened, onClick]
  );
  const open = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onHover(id);
    },
    [id, onHover]
  );

  const containsSubCategories = !!columns || !!submenus;

  return (
    <>
      <div
        className={clsx(
          styles.wrapper,
          containsSubCategories && styles.withSubMenus
        )}
        ref={ref}
        onMouseLeave={() => toggleOpened(null)}
      >
        {isDropdown === "link" ? (
          <Link
            href={url || ""}
            onClick={toggleOpened}
            onMouseEnter={open}
            className={clsx(styles.link, opened ? styles.active : "")}
            data-testid={testId}
          >
            {title}
          </Link>
        ) : (
          <span
            className={clsx(styles.menuButton, opened ? styles.opened : "")}
            onClick={toggleOpened}
            onMouseEnter={open}
            data-testid={testId}
          >
            {title}
            {isDropdown === "dropdown" && (
              <div className={styles.iconWrapper}>
                <Icon
                  name="arrowRight"
                  className={clsx(styles.icon, opened && styles.opened)}
                  size={isMobile ? "md" : "sm"}
                />
              </div>
            )}
          </span>
        )}
        {children && (
          <div
            className={clsx(styles.dropdown, opened && styles.opened)}
            onMouseLeave={() => toggleOpened(null)}
            data-testid={menuTestId}
          >
            <DropdownMenu>
              {menuType === "submenus" ? (
                <DropdownSubMenu items={submenus} />
              ) : (
                columns.map(({ columnSections }, index) => (
                  <div
                    className={clsx(
                      styles.columnBox,
                      index !== columns?.length - 1 && styles.showBorder
                    )}
                    key={`columnBox${index}`}
                  >
                    {columnSections?.map((sectionProps, i) => (
                      <DropdownSection
                        key={`${
                          sectionProps?.title || "dropdown-section"
                        }-${i}`}
                        titleLink={false}
                        isImageLink={false}
                        childLength={children.length}
                        title={sectionProps?.title || undefined}
                        subtitle={sectionProps?.subtitle || undefined}
                        isFirst={index === 0}
                        className={clsx(
                          styles.dropdownSection,
                          sectionProps?.sectionItems?.find(
                            ({ itemType }) =>
                              itemType === "normal" && styles.normal
                          )
                        )}
                      >
                        {sectionProps?.sectionItems?.map(
                          (sectionItemProps, idx) => (
                            <DropdownMenuItem
                              key={`${
                                sectionItemProps?.title || "dropdown-menu-item"
                              }-${idx}`}
                              {...sectionItemProps}
                              itemAmount={columns.length}
                            />
                          )
                        )}
                      </DropdownSection>
                    ))}
                  </div>
                ))
              )}
            </DropdownMenu>
          </div>
        )}
      </div>
    </>
  );
};

export default MenuCategory;
