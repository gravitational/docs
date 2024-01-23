import { useState } from "react";
import MenuCategory from "./Category";
import structure from "./structure";
import styles from "./Menu.module.css";

const Menu = () => {
  const [openedCategoryId, setOpenedCategoryId] = useState<number | null>(null);

  return (
    <nav className={styles.navItems}>
      {structure.map((props, id) => (
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
