import { createElement } from "react";
import { GetStaticProps } from "next";
import rehypeReact from "rehype-react";
import {
  getDocsPaths,
  getDocsPageProps,
  DocsPageProps,
} from "server/docs-helpers";
import { components } from "layouts/DocsPage/components";
import Layout from "layouts/DocsPage";

const renderAst = new rehypeReact({
  createElement,
  components,
}).Compiler;

const DocsPage = ({ meta, AST, tableOfContents }: DocsPageProps) => {
  return (
    <Layout meta={meta} tableOfContents={tableOfContents}>
      {renderAst(AST)}
    </Layout>
  );
};

// Here we generate a list of pages to render with getStaticProps,
// in the future we may try to only generate current version and set
// `fallback: true` to increase build speed

export async function getStaticPaths() {
  return {
    paths: getDocsPaths(),
    fallback: false,
  };
}

// generates JSON with the page data

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
