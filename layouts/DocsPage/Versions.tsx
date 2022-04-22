import cn from "classnames";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Dropdown } from "components/Dropdown";
import { getCurrentPageWithScope } from "utils/url";
import { findExistingPage } from "utils/findExistingPage";
import type { VersionsInfo, LinkWithRedirectList } from "./types";
import styles from "./Versions.module.css";

const renderVersion = (version: string) => `Version ${version}`;

const Versions = ({
  current,
  latest,
  available,
  disabled,
  className,
  articleList,
}: VersionsInfo) => {
  const router = useRouter();
  const [currentItem, setCurrentItem] = useState<string>(current);
  const currentPage = getCurrentPageWithScope(router.asPath);
  const versions = useMemo(() => [...available].reverse(), [available]);

  const navigateToVersion = useCallback(
    (version: string) => {
      const currentPageWithVersion = `/ver/${version}/${currentPage}`;
      const href = findExistingPage({
        articleList,
        version,
        currentPageWithVersion,
        initialVersion: current,
        initialPage: router.asPath,
        versions,
        latestVersion: latest,
      });

      setCurrentItem(version);
      router.push(href);
    },
    [latest, router, currentPage, articleList, current, versions]
  );

  useEffect(() => {
    setCurrentItem(current);
  }, [current]);

  return (
    <Dropdown
      className={cn(styles.wrapper, className)}
      value={currentItem}
      options={versions}
      disabled={disabled}
      onChange={navigateToVersion}
      renderOption={renderVersion}
    />
  );
};

export default Versions;
