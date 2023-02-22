import NextHead from "next/head";
import { useRouter } from "next/router";

import { buildCanonicalUrl, host } from "utils/url";
import { getFirstLvlNav } from "utils/general";

const formatTitle = (suffix: string, title?: string) => {
  const base = title ? `${title} | ` : "";

  return base + suffix;
};

const getURLVariants = (url: string, firstLvlNav: string): JSX.Element => {
  const rels = ["alternate", "alternate", "alternate"];

  switch (firstLvlNav) {
    case "cloud":
      rels[2] = "canonical";
      break;
    case "enterprise":
      rels[1] = "canonical";
      break;
    default:
      rels[0] = "canonical";
  }

  return (
    <>
      <link rel={rels[0]} href={url} />
      <link rel={rels[1]} href={`${url}?scope=enterprise`} />
      <link rel={rels[2]} href={`${url}?scope=cloud`} />
    </>
  );
};
export interface HeadProps {
  title: string;
  description?: string;
  titleSuffix?: string;
  url?: string;
  noIndex?: boolean;
  keywords?: Array<String>;
}

const Head = ({
  description: propsDescription,
  title: propsTitle,
  titleSuffix,
  url: propsUrl,
  noIndex,
  keywords: propsKeywords,
}: HeadProps) => {
  const router = useRouter();
  const url = buildCanonicalUrl(router.basePath, propsUrl || router.asPath);
  const title = formatTitle(titleSuffix, propsTitle);
  const description = propsDescription || "";
  const firstLvlNav = getFirstLvlNav(router.asPath);
  const keywords = propsKeywords || [];

  return (
    <NextHead>
      <title>{title}</title>
      <link rel="icon" href="/docs/favicon.ico" />
      <link rel="icon" href="/docs/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/docs/apple.png" />
      <link rel="manifest" href="/docs/manifest.webmanifest" />
      {getURLVariants(url, firstLvlNav)}
      <meta name="description" content={description} />
      <meta name="author" content="Teleport" />
      {noIndex && <meta name="robots" content="noindex" />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${host}/docs/og-image.png`} />
      <meta property="keywords" content={keywords.join(", ")} />
    </NextHead>
  );
};

Head.defaultProps = {
  titleSuffix: "Teleport",
  description:
    "Teleport is available for free as an open source download. We also offer commercial subscription plans priced on the number of computing resources accessible via Teleport.",
  noIndex: false,
};

export default Head;
