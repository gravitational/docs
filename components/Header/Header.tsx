import { useState, useCallback } from "react";
import Icon from "components/Icon";
import Logo from "components/Logo";
import Menu from "components/Menu";
import HeadlessButton from "components/HeadlessButton";
import blockBodyScroll from "utils/block-body-scroll";
import HeaderCTA from "./HeaderCTA";
import * as styles from "./Header.css";

const Header = () => {
  const [isNavigationVisible, setIsNavigationVisible] =
    useState<boolean>(false);
  const toggleNavigaton = useCallback(() => {
    setIsNavigationVisible((value) => !value);
    blockBodyScroll(isNavigationVisible);
  }, [isNavigationVisible]);

  return (
    <header className={styles.wrapper}>
      <a href="/" className={styles.logoLink}>
        <Logo />
      </a>
      <HeadlessButton onClick={toggleNavigaton} className={styles.hamburger}>
        <Icon name={isNavigationVisible ? "close" : "hamburger"} size="md" />
      </HeadlessButton>
      <div className={styles.content({ visible: isNavigationVisible })}>
        <Menu />
        <HeaderCTA />
      </div>
    </header>
  );
};

export default Header;
