import { useContext } from "react";
import NextImage from "next/image";
import cn from "classnames";
import Button from "components/Button";
import Icon from "components/Icon";
import { Scopes } from "./Scopes";
import Versions from "./Versions";
import { DocsContext } from "./context";
import type { IconName } from "components/Icon";
import type { VersionsInfo } from "./types";
import styles from "./Header.module.css";
import forkmeUrl from "./assets/forkme.webp";

interface DocHeaderProps {
  title: string;
  icon?: IconName;
  versions: VersionsInfo;
  githubUrl: string;
  latest: string;
  scopes: string | string[];
  getNewVersionPath?: (ver: string) => string;
}

const GITHUB_DOCS = process.env.NEXT_PUBLIC_GITHUB_DOCS;

const DocHeader = ({
  title,
  icon = "book",
  versions,
  githubUrl,
  getNewVersionPath,
  latest,
  scopes,
}: DocHeaderProps) => {
  const { scope } = useContext(DocsContext);
  // let singular = false;
  // let textScope = "all";

  // if (typeof scopes === "string" && Boolean(scopes)) {
  //   if (!scopes.includes(",")) {
  //     singular = true;
  //   }

  //   textScope = scopes;
  // } else if (Array.isArray(scopes)) {
  //   if (scopes.length > 1) {
  //     textScope = scopes.join(", ");
  //   } else {
  //     singular = true;
  //     textScope = scopes[0];
  //   }
  // }

  // const justTextForScopeInfo = `is ${
  //   Boolean(scopes) ? "only" : ""
  // } available in ${singular ? "the" : ""}`;

  // const textScopeEdition = `${textScope} edition${singular ? "" : "s"}`;

  return (
    <section className={styles.wrapper}>
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
        <p className={styles.subtitle}>Teleport</p>
        <h1 className={styles.title}>{title}</h1>
        {/* {scopes !== "noScope" && (
          <p className={styles.scopeInfo}>
            {`This feature ${justTextForScopeInfo}`} <b>{textScopeEdition}</b>
          </p>
        )} */}
        <div className={styles.dropdowns}>
          <Versions
            {...versions}
            getNewVersionPath={getNewVersionPath}
            disabled={scope === "cloud"}
            latest={latest}
          />
          <Scopes />
          {!!githubUrl && (
            <Button
              as="link"
              shape="md"
              variant="secondary"
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
    </section>
  );
};

export default DocHeader;
