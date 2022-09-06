import cn from "classnames";
import { useState, useCallback, useRef, MouseEvent } from "react";
import { useClickAway } from "react-use";
import Button from "components/Button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuOverlay,
} from "../DropdownMenu";
import styles from "./HeaderCTA.module.css";
import { sendAnalyticsEvent } from "utils/tracking";

const HeaderCTA = () => {
  const onClick = () =>
    sendAnalyticsEvent({
      action: "Button Click",
      category: "Pricing Buttons",
      label: "Navbar Get Started Button",
    });

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
        <div className={styles.group} ref={ref}>
          <Button
            as="link"
            href="https://teleport.sh/"
            onClick={toggleSignIn}
            variant="secondary"
            className={styles.cta}
          >
            Sign In
          </Button>
          <div
            className={cn(styles.dropdown, isSignInVisible && styles.visible)}
          >
            <DropdownMenu title="Sign in to Teleport">
              <DropdownMenuItem
                href="https://teleport.sh/"
                icon="clouds"
                title="Teleport Cloud Login"
                description="Login to your Teleport Account"
              />
              <DropdownMenuItem
                href="https://dashboard.gravitational.com/web/login"
                icon="download"
                title="Dashboard Login"
                description="Legacy Login &amp; Teleport Enterprise Downloads"
              />
            </DropdownMenu>
          </div>
        </div>
        <Button as="link" href="/pricing/" className={styles.cta}>
          Get Started
        </Button>
      </div>
    </>
  );
};

export default HeaderCTA;
