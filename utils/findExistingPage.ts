import { useEffect, useState } from "react";
import type { LinkWithRedirectList } from "layouts/DocsPage/types";

export function useRedirectMap() {
  const [articleList, setArticleList] = useState<LinkWithRedirectList>({});

  useEffect(() => {
    if (Object.keys(articleList).length) {
      return;
    }
    async function getRedirectsMap() {
      const res = await require("./articleLinks.json");
      setArticleList(res);
    }

    getRedirectsMap();
  }, [articleList]);

  return articleList;
}

interface Props {
  articleList: LinkWithRedirectList;
  version: string;
  currentPageWithVersion: string;
  initialVersion: string;
  initialPage: string;
  versions: string[];
  latestVersion: string;
}

export const findExistingPage = ({
  articleList,
  version,
  currentPageWithVersion,
  initialVersion,
  initialPage,
  versions,
  latestVersion,
}: Props) => {
  let destinationPage = "/";

  if (version === latestVersion && initialVersion !== latestVersion) {
    destinationPage = `/${currentPageWithVersion
      .split("/")
      .slice(3)
      .join("/")}`;
  } else {
    destinationPage = currentPageWithVersion;
  }

  let foundElement = articleList[version].find(
    (elem) =>
      elem.path === destinationPage ||
      elem.foundedConfigRedirect === destinationPage
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
      if (initialVersion === latestVersion) {
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
    let cutPath = `${destinationPage.split("/").slice(0, -2).join("/")}/`;

    while (!foundElement) {
      foundElement = articleList[version].find((elem) => elem.path === cutPath);
      cutPath = `${cutPath.split("/").slice(0, -2).join("/")}/`;
    }
  }

  return foundElement ? foundElement.path : `/ver/${version}/`;
};
