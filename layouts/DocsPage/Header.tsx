import { useContext } from "react";
import NextImage from "next/image";
import Button from "components/Button";
import Icon from "components/Icon";
import { Scopes } from "./Scopes";
import Versions from "./Versions";
import { DocsContext } from "./context";
import type { IconName } from "components/Icon";
import type { VersionsInfo, ScopesInMeta } from "./types";
import styles from "./Header.module.css";
import forkmeUrl from "./assets/forkme.webp";

interface DocHeaderProps {
  title: string;
  icon?: IconName;
  scopes: ScopesInMeta;
  githubUrl?: string;
  latest?: string;
  versions?: VersionsInfo;
  getNewVersionPath?: (ver: string) => string;
}

const GITHUB_DOCS = process.env.NEXT_PUBLIC_GITHUB_DOCS;

const DocHeader = ({
  title,
  icon = "book",
  versions,
  getNewVersionPath,
  latest,
  scopes,
}: DocHeaderProps) => {
  return (
    <section className={styles.wrapper}>
      <a href={GITHUB_DOCS} className={styles["github-link"]}>
        <NextImage
          width={112}
          height={112}
          priority={true}
          src={forkmeUrl}
          alt="Fork me on GitHub"
        />
      </a>
      <Icon name={icon} size="xl" className={styles.icon} />
      <div className={styles.description}>
        <p className={styles.subtitle}>Teleport</p>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.dropdowns}>
          {versions && latest && (
            <Versions
              {...versions}
              className={styles.versions}
              getNewVersionPath={getNewVersionPath}
              latest={latest}
            />
          )}
          <Scopes className={styles.scopes} scopes={scopes} />
        </div>
      </div>
    </section>
  );
};

export default DocHeader;
