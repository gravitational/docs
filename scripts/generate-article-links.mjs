import { resolve } from "path";
import dotEnv from "dotenv";
import { generateArticleLinks } from "../.build/server/paths.mjs";

/* dotEnv is used here to read .env file values that are used inside server/rss */

dotEnv.config();

if (process.env.NODE_ENV === "development") {
  dotEnv.config({ path: resolve(".env.development") });
} else {
  dotEnv.config({ path: resolve(".env.production") });
}

generateArticleLinks(`${process.env.NEXT_PUBLIC_HOST}/docs`);
