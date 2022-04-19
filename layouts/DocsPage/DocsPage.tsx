import cn from "classnames";
import { MDXProvider } from "@mdx-js/react";
import { useContext, useEffect, useState } from "react";
import AnchorNavigation, { HeaderMeta } from "components/AnchorNavigation";
import Button from "components/Button";
import Head from "components/Head";
import SiteHeader from "components/Header";
import Link, { useCurrentHref } from "components/Link";
import Notice from "components/Notice";
import VideoBar from "components/VideoBar";
import { getCurrentPageWithScope } from "utils/url";
import { components } from "./components";
import { DocsContext } from "./context";
import Header from "./Header";
import Footer from "./Footer";
import Navigation, { getCurrentCategoryIndex } from "./Navigation";
import { PageMeta, LinkWithRedirectList } from "./types";

import styles from "./DocsPage.module.css";

interface DocsPageProps {
  meta: PageMeta;
  tableOfConents: HeaderMeta[];
  children: React.ReactNode;
}

const DocsPage = ({
  meta: {
    h1,
    title,
    description,
    layout,
    videoBanner,
    navigation,
    versions,
    githubUrl,
  },
  tableOfConents,
  children,
}: DocsPageProps) => {
  const route = useCurrentHref();
  const currentPage = getCurrentPageWithScope(route);
  const { setVersions } = useContext(DocsContext);
  const [articleList, setArticleList] = useState<LinkWithRedirectList>({});

  const { current, latest, available } = versions;

  useEffect(() => {
    async function getRedirectsMap() {
      const res = await require("../../utils/articleLinks.json");
      setArticleList(res);
    }

    getRedirectsMap();
    setVersions(versions);
  }, [versions, setVersions]);

  const isSectionLayout = layout === "section";
  const isTocVisible = (!layout || layout === "doc") && tableOfConents.length;

  const categoryId = getCurrentCategoryIndex(navigation, route);
  const icon = navigation[categoryId]?.icon || "book";

  const isOldVersion = available.indexOf(current) < available.indexOf(latest);
  const isBetaVersion = available.indexOf(current) > available.indexOf(latest);
  let redirectFromBeta = false;

  let foundElement = articleList[latest]?.find(
    (elem) =>
      `/${currentPage}` === elem.path ||
      `/${currentPage}` === elem.foundedConfigRedirect
  );

  if (isBetaVersion && !foundElement) {
    foundElement = articleList[current]?.find(
      (elem) => `/${currentPage}` === elem.foundedConfigRedirect
    );
    if (foundElement) {
      redirectFromBeta = true;
    }
  }

  if (!foundElement) {
    let cutPath = `${currentPage.split("/").slice(0, -2).join("/")}/`;
    let i = 0;

    while (!foundElement && i < 10) {
      foundElement = articleList[latest]?.find((elem) => elem.path === cutPath);
      cutPath = `${cutPath.split("/").slice(0, -2).join("/")}/`;

      if (cutPath === "/") break;
    }
  }

  const path = foundElement ? foundElement.path : "/";

  let pathFromBeta = "/";
  if (redirectFromBeta) {
    pathFromBeta = foundElement.foundedConfigRedirect;
  } else if (foundElement) {
    pathFromBeta = foundElement.path;
  }

  return (
    <>
      <Head
        title={title}
        description={description}
        titleSuffix="Teleport Docs"
      />
      <SiteHeader />
      <main className={styles.wrapper}>
        <div className={styles.navigation}>
          <Navigation
            data={navigation}
            section={isSectionLayout}
            currentVersion={versions.current}
          />
        </div>
        <div className={styles.body}>
          <Header
            title={h1 || title}
            versions={versions}
            githubUrl={githubUrl}
            icon={icon}
          />
          {videoBanner && (
            <VideoBar className={styles.video} {...videoBanner} />
          )}
          <div className={cn(styles["main-wrapper"], styles[layout])}>
            <div className={styles.main}>
              {(isOldVersion || isBetaVersion) && (
                <Notice type="danger" className={styles.notice}>
                  {isOldVersion && (
                    <>
                      This chapter covers a past release: {versions.current}. We
                      recommend the <Link href={`/docs${path}`}>latest</Link>{" "}
                      version instead.
                    </>
                  )}
                  {isBetaVersion && (
                    <>
                      This chapter covers an upcoming release:{" "}
                      {versions.current}. We recommend the{" "}
                      <Link href={`${pathFromBeta}`}>latest</Link> version
                      instead.
                    </>
                  )}
                </Notice>
              )}
              <div className={cn(styles.text, styles[layout])}>
                <MDXProvider components={components}>{children}</MDXProvider>
              </div>
            </div>
            {isTocVisible && (
              <AnchorNavigation
                headers={tableOfConents}
                className={styles["anchor-navigation"]}
              />
            )}
          </div>
          <Footer section={isSectionLayout}>
            <div className={styles.footer}>
              Have a suggestion or can’t find something?
            </div>
            <Button
              as="link"
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              shape="lg"
              variant="secondary"
            >
              IMPROVE THE DOCS
            </Button>
          </Footer>
        </div>
      </main>
    </>
  );
};

export default DocsPage;
