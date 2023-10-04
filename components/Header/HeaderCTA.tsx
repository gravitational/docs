import Button from "components/Button";
import styles from "./HeaderCTA.module.css";

const HeaderCTA = () => {
  return (
    <div className={styles.wrapper}>
      <Button
        as="link"
        href="/signup/enterprise/"
        variant="secondary"
        className={styles.cta}
        data-testid="contact-sales"
      >
        Contact Sales
      </Button>
      <Button
        as="link"
        href="/signup/"
        className={styles.cta}
        data-testid="get-started"
      >
        Get Started
      </Button>
    </div>
  );
};

export default HeaderCTA;
