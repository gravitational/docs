import { useState } from "react";

import type { NavigationItem } from "../../../server/sanity-types";

import MenuCategory from "./Category";
import styles from "./Menu.module.css";

interface menuProps {
  navbarData?: NavigationItem[];
}
const Menu = ({ navbarData }: menuProps) => {
  const [openedCategoryId, setOpenedCategoryId] = useState<number | null>(null);

  return (
    <nav className={styles.navItems}>
      {navbarData?.map((props, id) => (
        <MenuCategory
          key={id}
          id={id}
          opened={id === openedCategoryId}
          onToggleOpened={setOpenedCategoryId}
          onHover={setOpenedCategoryId}
          {...props}
        />
      ))}
    </nav>
  );
};

export default Menu;
