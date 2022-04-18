import cn from "classnames";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Dropdown } from "components/Dropdown";
import { getCurrentPageWithScope } from "utils/url";
import type { VersionsInfo, LinkWithRedirectList } from "./types";
import styles from "./Versions.module.css";

const renderVersion = (version: string) => `Version ${version}`;

interface Props {
  articleList: LinkWithRedirectList;
  version: string;
  currentPageWithVersion: string;
  initialVersion: string;
  initialPage: string;
  versions: string[];
}

const findExistingPage = ({
  articleList,
  version,
  currentPageWithVersion,
  initialVersion,
  initialPage,
  versions,
}: Props) => {
  let foundElement = articleList[version].find(
    (elem) => elem.path === currentPageWithVersion
  );

  if (Number(initialVersion) < Number(version) && !foundElement) {
    const sortVersions = versions.sort((a, b) => Number(a) - Number(b));
    const startedIndex = sortVersions.indexOf(initialVersion);
    const endedIndex = sortVersions.indexOf(version);
    const appropriateVersionRange = sortVersions.slice(
      startedIndex + 1,
      endedIndex + 1
    );
    let foundedRedirection = "";

    appropriateVersionRange.forEach((elemVers, index) => {
      const initialPageWithNewVersion = initialPage.replace(
        initialVersion,
        elemVers
      );

      if (foundedRedirection && foundElement) {
        const foundedRedirectionWithNewVersion = foundElement.path.replace(
          appropriateVersionRange[index - 1],
          elemVers
        );

        foundElement = articleList[elemVers].find(
          (elem) =>
            elem.foundedConfigRedirect === foundedRedirectionWithNewVersion
        );
        console.log("elemVers", elemVers);
        console.log("foundElement", foundElement);
      } else {
        foundElement = articleList[elemVers].find(
          (elem) => elem.foundedConfigRedirect === initialPageWithNewVersion
        );
      }

      if (foundElement) {
        foundedRedirection = foundElement.foundedConfigRedirect;
      }
    });
  }

  if (!foundElement) {
    foundElement = articleList[version].find(
      (elem) => elem.foundedConfigRedirect === currentPageWithVersion
    );
  }

  let cutPath = `${currentPageWithVersion.split("/").slice(0, -2).join("/")}/`;

  while (!foundElement) {
    foundElement = articleList[version].find((elem) => elem.path === cutPath);
    cutPath = `${cutPath.split("/").slice(0, -2).join("/")}/`;
  }

  return foundElement ? foundElement.path : `/ver/${version}/`;
};

const Versions = ({
  current,
  latest,
  available,
  disabled,
  className,
}: VersionsInfo) => {
  const router = useRouter();
  const [currentItem, setCurrentItem] = useState<string>(current);
  const [articleList, setArticleList] = useState<LinkWithRedirectList>({});
  const currentPage = getCurrentPageWithScope(router.asPath);
  const versions = useMemo(() => [...available].reverse(), [available]);

  useEffect(() => {
    async function getRedirectsMap() {
      const res = await require("../../utils/articleLinks.json");
      setArticleList(res);
    }

    getRedirectsMap();
  }, []);

  const navigateToVersion = useCallback(
    (version: string) => {
      const isLatest = version === latest;
      const currentPageWithVersion = `/ver/${version}/${currentPage}`;
      let href = "";

      if (isLatest) {
        href = `/${currentPage}`;
      } else {
        href = findExistingPage({
          articleList,
          version,
          currentPageWithVersion,
          initialVersion: current,
          initialPage: router.asPath,
          versions,
        });
      }

      setCurrentItem(version);
      router.push(href);
    },
    [latest, router, currentPage, articleList, current]
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
