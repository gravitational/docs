import cn from "classnames";
import { useClickAway } from "react-use";
import { useCallback, useRef } from "react";
import styles from "./Category.module.css";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuOverlay,
  DropdownSubMenu,
  MenuItemProps,
} from "../DropdownMenu";

export interface MenuCategoryProps {
  title: string;
  description: string;
  href: string;
  children?: MenuItemProps[];
  testId: string;
  containsSubCategories?: boolean;
  onClick?: () => void | undefined;
}

interface MenuCategoryComponentProps extends MenuCategoryProps {
  id: number;
  opened: boolean;
  onToggleOpened: (id: number | null) => void;
}

const MenuCategory = ({
  id,
  opened,
  title,
  description,
  children,
  href,
  containsSubCategories,
  onToggleOpened,
  testId,
  onClick,
}: MenuCategoryComponentProps) => {
  const ref = useRef(null);
  const menuTestId = `${testId}-menu`;

  useClickAway(ref, () => {
    if (opened) {
      onToggleOpened(null);
    }
  });

  const toggleOpened = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (children) {
        e.preventDefault();

        onToggleOpened(opened ? null : id);
      } else {
        onClick && onClick();
      }
    },
    [opened, children, id, onToggleOpened, onClick]
  );

  return (
    <>
      {opened && <DropdownMenuOverlay />}
      <div
        className={cn(styles.wrapper, containsSubCategories && styles.subMenus)}
        ref={ref}
      >
        <a
          href={href}
          onClick={toggleOpened}
          className={cn(styles.link, opened && styles.active)}
          data-testid={testId}
        >
          {title}
        </a>
        <div
          className={cn(styles.dropdown, opened && styles.opened)}
          data-testid={menuTestId}
        >
          {children && (
            <DropdownMenu
              title={description}
              displayAsRow={containsSubCategories ? true : false}
            >
              {children.map((props) =>
                containsSubCategories ? (
                  <DropdownSubMenu
                    key={props.href}
                    title={props.title}
                    titleLink={props.titleLink}
                    href={props.href}
                  >
                    {props.children?.map((childProps) => (
                      <DropdownMenuItem key={childProps.href} {...childProps} />
                    ))}
                  </DropdownSubMenu>
                ) : (
                  <DropdownMenuItem key={props.href} {...props} />
                )
              )}
            </DropdownMenu>
          )}
        </div>
      </div>
    </>
  );
};

export default MenuCategory;
