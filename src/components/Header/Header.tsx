import { clsx } from "clsx";
import { useState, useCallback, useEffect } from "react";
import { useWindowSize } from "@docusaurus/theme-common";

import { EventBanner, getComingEvent } from "../EventBanner";

import type { HeaderNavigation } from "../../../server/sanity-types";
import blockBodyScroll from "../../utils/block-body-scroll";
import Icon from "../Icon";
import Menu from "../Menu";
import Button from "../Button";
import HeadlessButton from "../HeadlessButton";

import HeaderCTA from "./HeaderCTA";
import styles from "./Header.module.css";

import eventData from "../../../data/events.json";
import data from "../../../data/navbar.json";

const Header = () => {
  const [isNavigationVisible, setIsNavigationVisible] =
    useState<boolean>(false);
  const toggleNavigaton = useCallback(() => {
    setIsNavigationVisible((value) => !value);
    blockBodyScroll(isNavigationVisible);
  }, [isNavigationVisible]);

  const windowSize = useWindowSize();

  const { navbarData, bannerButtons } = data as unknown as HeaderNavigation;
  const mobileBtn = navbarData.rightSide?.mobileBtn;
  const logo = navbarData.logo;
  const event = eventData ? getComingEvent(eventData) : null;

  useEffect(() => {
    if (event) {
      if (windowSize === "desktop") {
        // Dirty hack to fix the header height for the event banner
        document.documentElement.style.setProperty(
          "--ifm-navbar-height",
          "117px"
        );
      } else if (windowSize === "mobile") {
        document.documentElement.style.setProperty(
          "--ifm-navbar-height",
          "96px"
        );
      }
    }
  }, [event, windowSize]);

  return (
    <div className={styles.header}>
      {event && <EventBanner initialEvent={event} />}
      <header className={`${styles.wrapper} ${event ? styles.margin : " "}`}>
        <a href="/" className={styles["logo-link"]}>
          <img src={logo || ""} alt="Teleport logo" width={121} height={24} />
        </a>
        {mobileBtn && (
          <Button
            as="link"
            href={mobileBtn?.href || ""}
            id={mobileBtn?.id || ""}
            variant="secondary"
            className={styles.mobileCTA}
          >
            {mobileBtn?.title}
          </Button>
        )}
        <HeadlessButton
          onClick={toggleNavigaton}
          className={styles.hamburger}
          data-testid="hamburger"
          aria-details="Toggle Main navigation"
        >
          <Icon
            name={isNavigationVisible ? "closeLarger" : "hamburger"}
            size="lg"
          />
        </HeadlessButton>
        <div
          className={clsx(styles.content, {
            [styles.visible]: isNavigationVisible,
          })}
          style={{ top: event ? "96px" : "48px" }}
        >
          <Menu navbarData={navbarData.menu} />
          {navbarData?.rightSide && (
            <HeaderCTA
              ctas={navbarData.rightSide}
              actionButtons={bannerButtons}
            />
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
