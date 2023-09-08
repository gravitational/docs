import cn from "classnames";
import { useState, useCallback } from "react";
import Icon from "components/Icon";
import Logo from "components/Logo";
import Menu from "components/Menu";
import HeadlessButton from "components/HeadlessButton";
import blockBodyScroll from "utils/block-body-scroll";
import HeaderCTA from "./HeaderCTA";
import styles from "./Header.module.css";
import Magnifier from "./assets/magnify.svg?react";
import Link from "components/Link";

const Header = () => {
  const [isNavigationVisible, setIsNavigationVisible] =
    useState<boolean>(false);
  const toggleNavigaton = useCallback(() => {
    setIsNavigationVisible((value) => !value);
    blockBodyScroll(isNavigationVisible);
  }, [isNavigationVisible]);

  return (
    <header className={styles.wrapper}>
      <a href="/" className={styles["logo-link"]}>
        <Logo />
      </a>
      <HeadlessButton
        onClick={toggleNavigaton}
        className={styles.hamburger}
        data-testid="hamburger"
        aria-details="Toggle Main navigation"
      >
        <Icon name={isNavigationVisible ? "close" : "hamburger"} size="md" />
      </HeadlessButton>
      <div
        className={cn(styles.content, {
          [styles.visible]: isNavigationVisible,
        })}
      >
        <Menu />
        <HeaderCTA />
      </div>
    </header>
  );
};

export default Header;
