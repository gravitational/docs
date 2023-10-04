import { useState, useRef, useCallback, MouseEvent } from "react";
import { useClickAway } from "react-use";
import MenuCategory from "./Category";
import structure from "./structure";
import styles from "./Menu.module.css";
import categoryStyles from "./Category.module.css";
import cn from "classnames";
import { DropdownMenuCTA, DropdownMenuItemCTA } from "../DropdownMenu";

const Menu = () => {
  const [openedCategoryId, setOpenedCategoryId] = useState<number | null>(null);
  const ref = useRef(null);

  const [isSignInVisible, setIsSignInVisible] = useState<boolean>(false);
  const toggleSignIn = useCallback((e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    setIsSignInVisible((value) => !value);
  }, []);

  useClickAway(ref, () => {
    if (isSignInVisible) {
      setIsSignInVisible(false);
    }
  });

  return (
    <nav className={styles.navItems}>
      {structure.map((props, id) => (
        <MenuCategory
          key={id}
          id={id}
          opened={id === openedCategoryId}
          onToggleOpened={setOpenedCategoryId}
          {...props}
        />
      ))}
      <div style={{ position: "relative" }}>
        <a
          href="https://teleport.sh/"
          onClick={toggleSignIn}
          className={cn(categoryStyles.link, isSignInVisible && styles.visible)}
          data-testid="sign-in"
        >
          Sign In
        </a>
        <div
          className={cn(
            styles.signInDropdown,
            isSignInVisible && styles.visible
          )}
          data-testid="sign-in-menu"
        >
          <DropdownMenuCTA title="Sign in to Teleport">
            <DropdownMenuItemCTA
              href="https://teleport.sh/"
              icon="clouds"
              title="Teleport Cloud Login"
              description="Login to your Teleport Account"
            />
            <DropdownMenuItemCTA
              href="https://dashboard.gravitational.com/web/login/"
              icon="download"
              title="Dashboard Login"
              description="Legacy Login &amp; Teleport Enterprise Downloads"
            />
          </DropdownMenuCTA>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
