import { useState } from "react";
import Flex from "components/Flex";
import MenuCategory from "./Category";
import structure from "./structure";

const Menu = () => {
  const [openedCategoryId, setOpenedCategoryId] = useState<number>(null);
  return (
    <Flex
      as="nav"
      flexDirection={["column", "row"]}
      marginRight="10px"
      width={["100%", "auto"]}
    >
      {structure.map((props, id) => (
        <MenuCategory
          key={id}
          id={id}
          opened={id === openedCategoryId}
          onToggleOpened={setOpenedCategoryId}
          {...props}
        />
      ))}
    </Flex>
  );
};

export default Menu;
