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
import MagnifierMobile from "./assets/magnify-mobile.svg?react";
import Link from "components/Link";
import {
  EventBanner,
  EventProps,
  getComingEvent,
} from "components/EventBanner";
// @ts-ignore
import eventData from "../../public/data/events.json";

const Header = () => {
  const selectedEvent = eventData
    ? getComingEvent(eventData as EventProps)
    : null;
  const [isNavigationVisible, setIsNavigationVisible] =
    useState<boolean>(false);
  const toggleNavigaton = useCallback(() => {
    setIsNavigationVisible((value) => !value);
    blockBodyScroll(isNavigationVisible);
  }, [isNavigationVisible]);
  return (
    <>
      {selectedEvent && (
        <EventBanner initialEvent={selectedEvent as EventProps} />
      )}
      <header
        className={`${styles.wrapper} ${selectedEvent ? styles.margin : " "}`}
      >
        <a href="/" className={styles["logo-link"]}>
          <Logo />
        </a>
        <NavSearch
          className={styles.navSearchMobile}
          testid="mobile-search"
          aria-label="search website"
        />
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
          style={{ top: selectedEvent ? "96px" : "48px" }}
        >
          <Menu />
          <HeaderCTA />
        </div>
      </header>
    </>
  );
};
export const NavSearch = ({
  testid,
  className,
  ...props
}: {
  testid: string;
  className: string;
}) => (
  <div {...props} className={className}>
    <a
      className={styles.searchlink}
      href={`https://${HOST}/search/`}
      data-testid={testid}
    >
      <MagnifierMobile className={styles.mobileMagnifier} />
      <Magnifier className={styles.magnifier} />
    </a>
  </div>
);
export default Header;
