import { useContext } from "react";
import Button from "components/Button";
import Icon, { IconName } from "components/Icon";
import { Scopes } from "./Scopes";
import Versions from "./Versions";
import NextImage from "next/image";
import { VersionsInfo } from "./types";
import { DocsContext } from "./context";
import styles from "./Header.module.css";
import forkmeUrl from "./assets/forkme.webp";

interface DocHeaderProps {
  title: string;
  icon?: IconName;
  versions: VersionsInfo;
  githubUrl: string;
}

const GITHUB_DOCS = process.env.NEXT_PUBLIC_GITHUB_DOCS;

const DocHeader = ({
  title,
  icon = "book",
  versions,
  githubUrl,
}: DocHeaderProps) => {
  const { scope } = useContext(DocsContext);

  return (
    <div className={styles.wrapper}>
      <a href={GITHUB_DOCS} className={styles["github-link"]}>
        <NextImage
          width="112"
          height="112"
          src={forkmeUrl}
          alt="Fork me on GitHub"
        />
      </a>
      <Icon name={icon} size="xl" className={styles.icon} />
      <div className={styles.description}>
        <div className={styles.subtitle}>Teleport</div>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.dropdowns}>
          <Scopes className={styles.scopes} />
          <Versions {...versions} disabled={scope === "cloud"} />
          {!!githubUrl && (
            <Button
              as="link"
              shape="md"
              variant="secondary-white"
              className={styles.button}
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Improve
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocHeader;
