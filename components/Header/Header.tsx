import cn from "classnames";
import { useState, useCallback, useEffect } from "react";
import Icon from "components/Icon";
import Logo from "components/Logo";
import Menu from "components/Menu";
import HeadlessButton from "components/HeadlessButton";
import blockBodyScroll from "utils/block-body-scroll";
import HeaderCTA from "./HeaderCTA";
import styles from "./Header.module.css";
import Magnifier from "./assets/magnify.svg?react";
import Link from "components/Link";
import { EventBanner, EventProps } from "components/EventBanner";
import eventData from "../../public/events.json";

const Header = () => {
  const [events] = useState<EventProps[]>(eventData);
  const [screenWidth, setScreenWidth] = useState(900);
  const [isNavigationVisible, setIsNavigationVisible] =
    useState<boolean>(false);
  const toggleNavigaton = useCallback(() => {
    setIsNavigationVisible((value) => !value);
    blockBodyScroll(isNavigationVisible);
  }, [isNavigationVisible]);

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [screenWidth]);
  return (
    <>
      <EventBanner events={events} />
      <header
        style={{ top: !!events.length && screenWidth < 900 ? "48px" : 0 }}
        className={styles.wrapper}
      >
        <a href="/" className={styles["logo-link"]}>
          <Logo />
        </a>
        <div className={styles.searchLink}>
          <NavSearch testid="mobile-search" aria-details="Search website" />
        </div>
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
          style={{ top: !!events ? "96px" : "48px" }}
        >
          <Menu />
          <HeaderCTA />
        </div>
      </header>
    </>
  );
};

export const NavSearch = ({ testid }: { testid: string }) => (
  <Link href="https://goteleport.com/search/" data-testid={testid}>
    <Magnifier width="24px" height="24px" />
  </Link>
);

export default Header;
