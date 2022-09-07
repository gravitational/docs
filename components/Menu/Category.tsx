import cn from "classnames";
import { useClickAway } from "react-use";
import { useCallback, useRef } from "react";
import styles from "./Category.module.css";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuOverlay,
  MenuItemProps,
} from "../DropdownMenu";

export interface MenuCategoryProps {
  title: string;
  description: string;
  href: string;
  children?: MenuItemProps[];
  testId: string;
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
      <div className={styles.wrapper} ref={ref}>
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
            <DropdownMenu title={description}>
              {children.map((props) => (
                <DropdownMenuItem key={props.href} {...props} />
              ))}
            </DropdownMenu>
          )}
        </div>
      </div>
    </>
  );
};

export default MenuCategory;
