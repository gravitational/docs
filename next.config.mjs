import bundleAnalyzer from "@next/bundle-analyzer";
import { loadConfig } from "./.build/server/config-site.mjs";
import { getRedirects } from "./.build/server/paths.mjs";
import mdxDocsOptions from "./.build/server/mdx-config-docs.mjs";
import { securityHeaders } from "./server/headers.mjs";
import { deprecatedVersionRedirects } from "./server/redirects/redirects.mjs";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const { latest } = loadConfig();

export default withBundleAnalyzer({
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  basePath: "/docs",
  rewrites: async () => [
    // This redirect will make root pages URIs redirected to the current version
    // Because existing pages take precendence redirects, it will ignore paths for other versions
    {
      source: "/:path*",
      destination: `/ver/${latest}/:path*`,
    },
  ],
  redirects: async () => [
    ...deprecatedVersionRedirects,
    ...getRedirects()],
  headers: async () => [
    {
      source: "/:path*",
      headers: securityHeaders,
    }
  ],
  images: {
    path: "/docs/_next/image",
    disableStaticImages: true,
    domains: ["i.ytimg.com"], // Images for youtube preview
  },
  trailingSlash: true,
  env: {
    DOCS_LATEST_VERSION: latest,
  },
  webpack: (config, options) => {
    // silencing warnings until https://github.com/vercel/next.js/issues/33693 is resolved
    config.infrastructureLogging = {
      level: "error",
    };

    config.module.rules.push({
      test: /\.(png|jpg|webp|gif|mp4|webm|ogg|swf|ogv|woff2)$/i,
      type: "asset/resource",
    });

    config.module.rules.push({
      test: /\.svg$/,
      oneOf: [
        {
          issuer: /\.[mjt]sx?$/,
          resourceQuery: /react/,
          use: "@svgr/webpack",
        },
        {
          type: "asset/resource",
        },
      ],
    });

    config.module.rules.push({
      test: /\.(md|mdx)$/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: "@mdx-js/loader",
          options: mdxDocsOptions,
        },
      ],
    });

    return config;
  },
});
