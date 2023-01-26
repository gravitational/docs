import { createElement } from "react";
import { GetStaticProps } from "next";
import rehypeReact from "rehype-react";
import { getDocsPaths, getDocsPageProps } from "server/docs-helpers";
import { components } from "layouts/DocsPage/components";
import Layout, { PageMeta } from "layouts/DocsPage";
import { HeaderMeta } from "components/AnchorNavigation";

const renderAst = new rehypeReact({
  createElement,
  components,
}).Compiler;

export interface DocsPageProps {
  meta: PageMeta;
  tableOfContents: HeaderMeta[];
  AST: unknown;
}

const DocsPage = ({ meta, AST, tableOfContents }: DocsPageProps) => {
  return (
    <Layout meta={meta} tableOfContents={tableOfContents}>
      {renderAst(AST)}
    </Layout>
  );
};

export async function getStaticPaths() {
  return {
    paths: getDocsPaths(),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug =
    params && Array.isArray(params.slug) ? `/${params.slug.join("/")}/` : "/";

  return {
    props: await getDocsPageProps(slug),
  };
};

export default DocsPage;

// This line will remove docs pages and images from @vercel/nft results.
// Without it docs will not build because of serverless function size errors.
// Right now it disables everything, but if we want to enable incremental builds
// we may want to remove mdx pages and code examples from the flag.
// It will also require manually moving image files to public folder before next build,
// becase if we move them as a part of build size of image folder will also cause
// serverless function limit problem.

export const config = {
  unstable_excludeFiles: ["**/*"],
};
