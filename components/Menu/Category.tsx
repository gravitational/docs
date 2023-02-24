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
  description?: string;
  href?: string;
  children?: MenuItemProps[] | MenuCategoryProps[];
  containsSubCategories?: boolean;
  testId: string;
  titleLink?: boolean;
  onClick?: () => void | undefined | Promise<void>;
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
        className={cn(
          styles.wrapper,
          containsSubCategories && styles.withSubMenus
        )}
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
          className={cn(
            styles.dropdown,
            opened && styles.opened,
            containsSubCategories && styles.withSubCategories
          )}
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
                    key={`drdwn${props.title}`}
                    title={props.title}
                    titleLink={props.titleLink}
                    href={props.href}
                  >
                    {props.children?.map((childProps) => (
                      <DropdownMenuItem
                        key={`drdwnchild${childProps.title}`}
                        {...childProps}
                      />
                    ))}
                  </DropdownSubMenu>
                ) : (
                  <DropdownMenuItem key={props.title} {...props} />
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
