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
  transpilePackages: ["@inkeep/widgets", "react-syntax-highlighter"],
  redirects: async () => [
    ...deprecatedVersionRedirects,
    ...getRedirects(),
    {
      source: `/ver/${latest}/:path*`,
      destination: "/:path*",
      permanent: false,
    },
  ],
  headers: async () => [
    {
      source: "/:path*",
      headers: securityHeaders,
    },
  ],
  images: {
    path: "/docs/_next/image",
    disableStaticImages: true,
    domains: ["i.ytimg.com", "goteleport.com"], // Images for youtube preview, goteleport.com for featured resource
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
  // This line will remove docs pages and images from @vercel/nft results.
  // Without it docs will not build because of serverless function size errors.
  // Right now it disables everything, but if we want to enable incremental builds
  // we may want to remove mdx pages and code examples from the flag.
  // It will also require manually moving image files to public folder before next build,
  // becase if we move them as a part of build size of image folder will also cause
  // serverless function limit problem.
  experimental: {
    outputFileTracingExcludes: {
      "/[[...slug]]": ["**/*"],
    },
  },
});
