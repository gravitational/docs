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
}

const findExistingPage = ({
  articleList,
  version,
  currentPageWithVersion,
}: Props) => {
  let foundElement = articleList[version].find(
    (elem) => elem.path === currentPageWithVersion
  );

  // if (!foundElement) {
  //   foundElement.path = articleList[version].find(
  //     (elem) => elem.foundedConfigRedirect === currentPageWithVersion
  //   )?.foundedConfigRedirect;
  // }

  let cutPath = `${currentPageWithVersion.split("/").slice(0, -2).join("/")}/`;
  let i = 0;
  while (!foundElement && i !== 10) {
    foundElement = articleList[version].find((elem) => elem.path === cutPath);
    console.log("cutPath", cutPath);
    cutPath = `${cutPath.split("/").slice(0, -2).join("/")}/`;
    i++;
  }
  console.log("current page", currentPageWithVersion);
  console.log("found elem", foundElement);

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
        });
      }

      setCurrentItem(version);
      router.push(href);
    },
    [latest, router, currentPage, articleList]
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
