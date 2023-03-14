import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getPathWithoutVersion } from "utils/url";
import type {
  LinkWithRedirectList,
  VersionsInfo,
} from "layouts/DocsPage/types";

function useRedirectMap() {
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
  targetPageWithVersion: string;
  initialVersion: string;
  initialPage: string;
  versions: string[];
  latestVersion: string;
}

const findExistingPage = ({
  articleList,
  version,
  targetPageWithVersion,
  initialVersion,
  initialPage,
  versions,
  latestVersion,
}: Props) => {
  let destinationPage = "/";

  if (version === latestVersion && initialVersion !== latestVersion) {
    destinationPage = `/${targetPageWithVersion.split("/").slice(3).join("/")}`;
  } else {
    destinationPage = targetPageWithVersion;
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

  if (foundElement?.path.startsWith("/ver/")) {
    return foundElement.path;
  } else if (foundElement) {
    return `/ver/${version}${foundElement.path}`;
  }

  return `/ver/${version}/`;
};

export function useFindDestinationPath(versions: VersionsInfo) {
  const { current, latest, available } = versions;
  const router = useRouter();

  const articleList = useRedirectMap();

  return useCallback(
    (versDestination: string) => {
      const targetPageWithVersion = `/ver/${versDestination}/${getPathWithoutVersion(
        router.asPath
      )}`;
      let path = "/";

      if (Object.keys(articleList).length) {
        path = findExistingPage({
          articleList,
          version: versDestination,
          targetPageWithVersion,
          initialVersion: current,
          initialPage: router.asPath,
          versions: available,
          latestVersion: latest,
        });
      }

      // return non-versioned path for current version
      return path.replace(`/ver/${latest}`, "");
    },
    [articleList, available, current, latest, router.asPath]
  );
}
