import { useState, useRef } from "react";
import { useClickAway } from "react-use";

import { HeaderNavigation } from "../../../server/sanity-types";
import Button from "../Button";
import Link from "../Link";
import Icon from "../Icon";

import styles from "./HeaderCTA.module.css";

const HeaderCTA = ({
  ctas,
  actionButtons,
}: {
  ctas: HeaderNavigation["navbarData"]["rightSide"];
  actionButtons: HeaderNavigation["bannerButtons"];
}) => {
  const { CTAs } = ctas || {};
  const { first, second } = actionButtons || {};
  const ref = useRef(null);

  const [isSignInVisible, setIsSignInVisible] = useState<boolean>(false);

  useClickAway(ref, () => {
    if (isSignInVisible) {
      setIsSignInVisible(false);
    }
  });

  return (
    <div className={styles.wrapper}>
      {CTAs && (
        <div className={styles.ctaWrapper}>
          {CTAs.map((cta, i) => (
            <Button
              as="link"
              className={styles.cta}
              href={cta.href}
              key={`navCTA-${cta.href}-${i}`}
              variant={i !== 0 ? "secondary" : "primary"}
              id={cta?.id || ""}
              shape="md"
            >
              {cta.title}
            </Button>
          ))}
        </div>
      )}
      {(first || second) && (
        <div className={styles.actionButtonFlex}>
          {first && (
            <Link className={styles.styledLink} href={first?.url || ""}>
              <div className={styles.flex}>
                {first?.title}
                <Icon name="arrowRight" />
              </div>
            </Link>
          )}
          {second && (
            <Link className={styles.styledLink} href={second?.url || ""}>
              <div className={styles.flex}>
                {second?.title}
                <Icon name="arrowRight" />
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderCTA;
