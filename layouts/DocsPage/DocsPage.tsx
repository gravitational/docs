import { MDXProvider } from "@mdx-js/react";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import AnchorNavigation, { HeaderMeta } from "components/AnchorNavigation";
import Box from "components/Box";
import Button from "components/Button";
import Flex from "components/Flex";
import Head from "components/Head";
import Layout from "components/Layout";
import Link from "components/Link";
import { components } from "./components";
import Notice from "components/Notice";
import VideoBar from "components/VideoBar";
import { DocsContext } from "./context";
import Header from "./Header";
import Footer from "./Footer";
import Navigation, { getCurrentCategoryIndex } from "./Navigation";
import { PageMeta, LayoutName } from "./types";

const getContentWidth = (layout: LayoutName) => {
  switch (layout) {
    case "tocless-doc":
      return "1164px";
    case "section":
      return "auto";
    default:
      return "900px";
  }
};

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
  const router = useRouter();
  const { setVersions } = useContext(DocsContext);

  const { current, latest, available } = versions;

  useEffect(() => {
    setVersions(versions);
  }, [versions, setVersions]);

  const isSectionLayout = layout === "section";
  const isTocVisible = !layout || layout === "doc";

  const categoryId = getCurrentCategoryIndex(navigation, router.asPath);
  const icon = categoryId ? navigation[categoryId]?.icon : "book";

  const isOldVersion = available.indexOf(current) < available.indexOf(latest);
  const isBetaVersion = available.indexOf(current) > available.indexOf(latest);

  return (
    <>
      <Head
        title={title}
        description={description}
        titleSuffix="Teleport Docs"
      />
      <Layout>
        <Flex alignItems="stretch" flexDirection={["column", "row"]}>
          <Box flexShrink={0}>
            <Navigation
              data={navigation}
              section={isSectionLayout}
              currentVersion={versions.current}
            />
          </Box>
          <Flex flexGrow={1} flexDirection="column">
            <Header
              title={h1 || title}
              versions={versions}
              githubUrl={githubUrl}
              icon={icon}
            />
            {videoBanner && (
              <VideoBar
                mb={1}
                boxShadow="0 1px 4px rgba(0, 0, 0, 0.24)"
                {...videoBanner}
              />
            )}
            <Flex bg={isSectionLayout ? "page-bg" : "white"}>
              <Box flexGrow={1} px={[3, 6]} py={[3, 4]}>
                {(isOldVersion || isBetaVersion) && (
                  <Notice mb={4} type="danger">
                    {isOldVersion && (
                      <>
                        This chapter covers a past release: {versions.current}.{" "}
                        We recommend the <Link href="/docs/">latest</Link>{" "}
                        version instead.
                      </>
                    )}
                    {isBetaVersion && (
                      <>
                        This chapter covers an upcoming release:{" "}
                        {versions.current}. We recommend the{" "}
                        <Link href="/">latest</Link> version instead.
                      </>
                    )}
                  </Notice>
                )}
                <Box maxWidth={getContentWidth(layout)}>
                  <Box color="text" lineHeight="26px">
                    <MDXProvider components={components}>
                      {children}
                    </MDXProvider>
                  </Box>
                </Box>
              </Box>
              {!!tableOfConents.length && isTocVisible && (
                <AnchorNavigation
                  headers={tableOfConents}
                  display={["none", "none", "block"]}
                />
              )}
            </Flex>
            <Footer section={isSectionLayout}>
              <Box
                textAlign="center"
                fontSize={["text-l", "text-xl"]}
                lineHeight={["md", "xl"]}
                color="gray"
                px={3}
                mb={3}
              >
                Have a suggestion or can’t find something?
              </Box>
              <Button
                as="a"
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                shape="lg"
                variant="secondary"
              >
                IMPROVE THE DOCS
              </Button>
            </Footer>
          </Flex>
        </Flex>
      </Layout>
    </>
  );
};

export default DocsPage;
