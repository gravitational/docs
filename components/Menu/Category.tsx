import { useClickAway } from "react-use";
import { useCallback, useRef } from "react";
import * as styles from "./Category.css";

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
}: MenuCategoryComponentProps) => {
  const ref = useRef(null);

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
      }
    },
    [opened, children, id, onToggleOpened]
  );

  return (
    <>
      {opened && <DropdownMenuOverlay />}
      <div className={styles.wrapper} ref={ref}>
        <a
          href={href}
          onClick={toggleOpened}
          className={styles.link({ active: opened })}
        >
          {title}
        </a>
        <div className={styles.dropdown({ opened })}>
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
