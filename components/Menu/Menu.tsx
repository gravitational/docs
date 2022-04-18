import { useState } from "react";
import MenuCategory from "./Category";
import structure from "./structure";
import { wrapper } from "./Menu.css";

const Menu = () => {
  const [openedCategoryId, setOpenedCategoryId] = useState<number>(null);
  return (
    <nav className={wrapper}>
      {structure.map((props, id) => (
        <MenuCategory
          key={id}
          id={id}
          opened={id === openedCategoryId}
          onToggleOpened={setOpenedCategoryId}
          {...props}
        />
      ))}
    </nav>
  );
};

export default Menu;
