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
    (elem) =>
      elem.path === currentPageWithVersion ||
      elem.foundedConfigRedirect === currentPageWithVersion
  );

  const sortVersions = versions.sort((a, b) => Number(a) - Number(b));
  const initialIndex = sortVersions.indexOf(initialVersion);
  const distinationIndex = sortVersions.indexOf(version);

  let appropriateVersionRange = sortVersions.slice(
    initialIndex + 1,
    distinationIndex + 1
  );

  //In this case we need to check for redirects from the version from which we are switching.
  //There is no need to check for redirects in the destination version
  if (initialIndex > distinationIndex) {
    appropriateVersionRange = sortVersions
      .slice(distinationIndex + 1, initialIndex + 1)
      .sort((a, b) => Number(b) - Number(a));
  }

  if (!foundElement) {
    let foundedRedirection = "";
    appropriateVersionRange.forEach((elemVers, index) => {
      let initialPageWithNewVersion = initialPage.replace(
        initialVersion,
        elemVers
      );
      if (initialVersion === "9.0") {
        initialPageWithNewVersion = `/ver/${elemVers}${initialPage}`;
      }

      if (Number(initialVersion) < Number(version)) {
        if (foundedRedirection && foundElement) {
          const foundedRedirectionWithNewVersion = foundElement.path.replace(
            appropriateVersionRange[index - 1],
            elemVers
          );

          foundElement = articleList[elemVers].find(
            (elem) =>
              elem.foundedConfigRedirect === foundedRedirectionWithNewVersion
          );
        } else {
          foundElement = articleList[elemVers].find(
            (elem) => elem.foundedConfigRedirect === initialPageWithNewVersion
          );
        }
      }

      if (Number(initialVersion) > Number(version)) {
        const prevVers = versions[sortVersions.indexOf(elemVers) - 1];
        console.log(foundElement);

        if (foundElement) {
          const pathInPreviewVers = foundElement.path.replace(
            elemVers,
            prevVers
          );
          const redirectInPreviewVers =
            foundElement.foundedConfigRedirect?.replace(elemVers, prevVers);

          foundElement = articleList[prevVers].find(
            (elem) =>
              elem.path === pathInPreviewVers ||
              elem.path === redirectInPreviewVers
          );
        }

        if (!foundElement) {
          articleList[elemVers].forEach((elem) => {
            if (
              elem.path === initialPageWithNewVersion &&
              elem.foundedConfigRedirect
            ) {
              const pathRedirectInPreviewVers =
                elem.foundedConfigRedirect.replace(elemVers, prevVers);

              foundElement = articleList[prevVers].find(
                (elem) => elem.path === pathRedirectInPreviewVers
              );
            }
          });
        }
      }

      if (foundElement) {
        foundedRedirection = foundElement.foundedConfigRedirect;
      }
    });
  }

  //if the page is not found and a redirect for it is not found,
  //then try to find the page to the node above
  if (!foundElement) {
    let cutPath = `${currentPageWithVersion
      .split("/")
      .slice(0, -2)
      .join("/")}/`;

    while (!foundElement) {
      foundElement = articleList[version].find((elem) => elem.path === cutPath);
      cutPath = `${cutPath.split("/").slice(0, -2).join("/")}/`;
    }
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
