import { useContext } from "react";
import Icon from "components/Icon";
import Link from "components/Link";
import { DocsContext } from "./context";
import * as styles from "./VersionWarning.css";

export const VersionWarning = () => {
  const {
    versions: { current },
  } = useContext(DocsContext);

  return (
    <div className={styles.wrapper}>
      <Icon name="clouds" className={styles.icon} />
      Cloud is not available for Teleport v{current}.
      <br />
      Please use the{" "}
      <Link href="/" scheme="docs">
        latest version of Teleport Enterprise documentation
      </Link>
      .
    </div>
  );
};
