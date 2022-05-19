import { GetStaticProps } from "next";
import { getStaticPathsForDocs, getDocsPagesMap } from "server/paths";
import { getPageInfo } from "server/pages-helpers";
import { fetchVideoMeta } from "server/youtube-meta";
import { getPageMeta } from "server/docs-helpers";
import { transformToAST } from "server/markdown-config";

import Layout from "layouts/DocsPage";

const DocsPage = ({ meta, AST, tableOfConents }) => {
  return <Layout meta={meta} tableOfConents={tableOfConents} AST={AST} />;
};

export async function getStaticPaths() {
  return {
    paths: getStaticPathsForDocs(),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pagesMap = getDocsPagesMap();
  const slug =
    params && Array.isArray(params.slug) ? `/${params.slug.join("/")}/` : "/";

  const filepath = pagesMap[slug];

  const page = getPageInfo(filepath);

  // Adds versions, navigation, githubUrl, etc.
  const pageMeta = getPageMeta(filepath);

  // If we have videoBanner file in config, we load this vide data through YouTube API.
  const { videoBanner } = page.data.frontmatter;

  if (typeof videoBanner === "string") {
    page.data.frontmatter.videoBanner = await fetchVideoMeta(videoBanner);
  }

  return {
    props: {
      meta: { ...page.data.frontmatter, ...pageMeta },
      AST: transformToAST(page.data.content, page),
      tableOfConents: [],
    },
  };
};

export default DocsPage;

export const config = {
  unstable_excludeFiles: ["**/*"],
};
