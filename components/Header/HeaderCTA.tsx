import Button from "components/Button";
import styles from "./HeaderCTA.module.css";
import { NavSearch } from "./Header";

const HeaderCTA = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBox}>
        <NavSearch testid="search" />
      </div>
      <Button
        as="link"
        href="/signup/"
        className={styles.cta}
        data-testid="get-started"
      >
        Get Started
      </Button>
      <Button
        as="link"
        href="/signup/enterprise/"
        variant="secondary"
        className={styles.cta}
        data-testid="contact-sales"
      >
        Contact Sales
      </Button>
    </div>
  );
};

export default HeaderCTA;
