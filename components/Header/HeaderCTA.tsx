import cn from "classnames";
import { useState, useCallback, useRef, MouseEvent } from "react";
import { useClickAway } from "react-use";
import Button from "components/Button";
import Link from "components/Link";
import {
  DropdownMenuOverlay,
  DropdownMenuCTA,
  DropdownMenuItemCTA,
} from "../DropdownMenu";
import styles from "./HeaderCTA.module.css";

const HeaderCTA = () => {
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
    <>
      {isSignInVisible && <DropdownMenuOverlay />}
      <div className={styles.wrapper}>
        <Link
          className={styles.downloadsLink}
          href="https://goteleport.com/download/"
          data-testid="downloads"
        >
          Downloads
        </Link>
        <div className={styles.group} ref={ref}>
          <Button
            as="link"
            href="https://teleport.sh/"
            onClick={toggleSignIn}
            variant="secondary"
            className={styles.cta}
            data-testid="sign-in"
          >
            Sign In
          </Button>
          <div
            className={cn(styles.dropdown, isSignInVisible && styles.visible)}
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
        <Button
          as="link"
          href="/signup/"
          className={styles.cta}
          data-testid="get-started"
        >
          Get Started
        </Button>
      </div>
    </>
  );
};

export default HeaderCTA;
