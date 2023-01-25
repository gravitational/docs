import bundleAnalyzer from "@next/bundle-analyzer";
import { loadConfig } from "./.build/server/config-site.mjs";
import { getRedirects } from "./.build/server/paths.mjs";
import { securityHeaders } from "./server/headers.mjs";
import { deprecatedVersionRedirects } from "./server/redirects/redirects.mjs";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const { latest } = loadConfig();

export default withBundleAnalyzer({
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  basePath: "/docs",
  redirects: async () => [...deprecatedVersionRedirects, ...getRedirects()],
  headers: async () => [
    {
      source: "/:path*",
      headers: securityHeaders,
    },
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
  webpack: (config) => {
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

    return config;
  },
});
