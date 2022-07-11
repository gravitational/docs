/*
 * Simple sitemap generator.
 */

import { writeFileSync } from "fs";
import { format } from "date-fns";
import { findFirstLvlNav } from "../utils/general";

const defaultLastmod = format(new Date(), "yyyy-MM-dd");

interface SitemapPage {
  loc: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

const generateSitemapPage = (
  root: string,
  { loc, lastmod = defaultLastmod, changefreq = "daily", priority }: SitemapPage
) => {
  const firstLvlNav = findFirstLvlNav(loc);
  let updateLoc = "";

  switch (firstLvlNav) {
    case "cloud":
      updateLoc = `${updateLoc}?scope=cloud`;
      break;
    case "enterprise":
      updateLoc = `${updateLoc}?scope=enterprise`;
      break;
    default:
      updateLoc = loc;
  }

  return (
    "  <url>\n" +
    `    <loc>${root}${updateLoc}</loc>\n` +
    `    <lastmod>${lastmod}</lastmod>\n` +
    `    <changefreq>${changefreq}</changefreq>\n` +
    (priority ? `    <priority>${priority}</priority>\n` : "") +
    "  </url>\n"
  );
};

interface Sitemap {
  pages: SitemapPage[];
  path: string;
  root: string;
}

export const generateSitemap = ({ pages, path, root }: Sitemap) => {
  const sourcemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    pages.map((page) => generateSitemapPage(root, page)).join("") +
    "</urlset>";

  writeFileSync(path, sourcemap);
};
