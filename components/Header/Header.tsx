import cn from "classnames";
import { useState, useCallback, useEffect } from "react";
import Icon from "components/Icon";
import Image from "next/image";
import Menu from "components/Menu";
import HeadlessButton from "components/HeadlessButton";
import blockBodyScroll from "utils/block-body-scroll";
import HeaderCTA from "./HeaderCTA";
import styles from "./Header.module.css";
import Button from "components/Button";
import { EventBanner, getComingEvent } from "components/EventBanner";
// @ts-ignore
import eventData from "../../public/data/events.json";
import data from "../../public/data/navbar.json";
import { HeaderNavigation } from "server/sanity-types";
const Header = () => {
  const [isNavigationVisible, setIsNavigationVisible] =
    useState<boolean>(false);
  const toggleNavigaton = useCallback(() => {
    setIsNavigationVisible((value) => !value);
    blockBodyScroll(isNavigationVisible);
  }, [isNavigationVisible]);

  const { navbarData, bannerButtons } = data as unknown as HeaderNavigation;
  const mobileBtn = navbarData.rightSide?.mobileBtn;
  const logo = navbarData.logo;
  const event = eventData ? getComingEvent(eventData) : null;
  return (
    <>
      {event && <EventBanner initialEvent={event} />}
      <header className={`${styles.wrapper} ${event ? styles.margin : " "}`}>
        <a href="/" className={styles["logo-link"]}>
          <Image src={logo || ""} alt="Teleport logo" width={121} height={24} />
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
          className={cn(styles.content, {
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
    </>
  );
};

export default Header;
