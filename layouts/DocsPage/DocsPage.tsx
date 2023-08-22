import type { PageMeta } from "./types";

import cn from "classnames";
import { useContext, useEffect } from "react";
import { VarsProvider } from "components/Variables";
import AnchorNavigation, { HeaderMeta } from "components/AnchorNavigation";
import Button from "components/Button";
import Head from "components/Head";
import SiteHeader from "components/Header";
import Link, { useCurrentHref } from "components/Link";
import Notice from "components/Notice";
import VideoBar from "components/VideoBar";
import { useFindDestinationPath } from "utils/useFindDestinationPath";

import { DocsContext } from "./context";
import Header from "./Header";
import Footer from "./Footer";
import Navigation, { getCurrentCategoryIndex } from "./Navigation";

import Feedback from "components/Feedback";

import styles from "./DocsPage.module.css";

export interface DocsPageProps {
  meta: PageMeta;
  tableOfContents: HeaderMeta[];
  children: React.ReactNode;
}

const DocsPage = ({
  meta: {
    h1,
    title,
    description,
    keywords,
    layout,
    videoBanner,
    navigation,
    versions,
    githubUrl,
    scopes,
  },
  tableOfContents,
  children,
}: DocsPageProps) => {
  const route = useCurrentHref();

  const { setVersions } = useContext(DocsContext);

  const { current, latest, available } = versions;
  const getPath = useFindDestinationPath(versions);

  useEffect(() => {
    setVersions(versions);
  }, [versions, setVersions]);

  const isSectionLayout = layout === "section";
  const isTocVisible = (!layout || layout === "doc") && tableOfContents.length;

  const categoryId = getCurrentCategoryIndex(navigation, route);
  const icon = navigation[categoryId]?.icon || "book";

  const isOldVersion = available.indexOf(current) < available.indexOf(latest);
  const isBetaVersion = available.indexOf(current) > available.indexOf(latest);

  let path = getPath(latest);

  return (
    <>
      <Head
        title={title}
        description={description}
        titleSuffix="Teleport Docs"
        keywords={keywords}
      />
      <SiteHeader />
      <main className={styles.wrapper}>
        <div className={styles.navigation}>
          <Navigation
            data={navigation}
            section={isSectionLayout}
            currentVersion={current}
          />
        </div>

        <div className={styles.body}>
          <Header
            title={h1 || title}
            versions={versions}
            githubUrl={githubUrl}
            icon={icon}
            getNewVersionPath={getPath}
            latest={latest}
            scopes={scopes}
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
                      This chapter covers a past release: {current}. We
                      recommend the <Link href={`/docs${path}`}>latest</Link>{" "}
                      version instead.
                    </>
                  )}
                  {isBetaVersion && (
                    <>
                      This chapter covers an upcoming release: {current}. We
                      recommend the <Link href={`/docs${path}`}>latest</Link>{" "}
                      version instead.
                    </>
                  )}
                </Notice>
              )}
              <VarsProvider>
                <div className={cn(styles.text, styles[layout])}>
                  {children}
                </div>
              </VarsProvider>
            </div>
            {isTocVisible && (
              <AnchorNavigation
                githubUrl={githubUrl}
                headers={tableOfContents}
                className={styles["anchor-navigation"]}
              />
            )}
          </div>
          <Footer section={isSectionLayout}></Footer>
        </div>
      </main>
    </>
  );
};

export default DocsPage;
