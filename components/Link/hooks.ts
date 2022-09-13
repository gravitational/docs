import { resolve } from "url";
import { useRouter } from "next/router";
import { useContext } from "react";
import { ScopeType, scopeValues } from "layouts/DocsPage/types";
import {
  normalizePath,
  splitPath,
  isHash,
  isExternalLink,
  isLocalAssetFile,
} from "utils/url";
import { DocsContext, updateScopeInUrl } from "layouts/DocsPage/context";

/*
 * This hook should return current href with resolved rewrites
 */

export const useCurrentHref = () => {
  const { asPath } = useRouter();

  return normalizePath(asPath);
};

/*
 * This hook should return absolute site paths, with resolved rewrites and correct scopes
 */

export const useNormalizedHref = (href: string) => {
  const { asPath, basePath } = useRouter();

  // console.log("BASEPATH", basePath);

  const noBaseHref = href.startsWith(basePath)
    ? href.substring(basePath.length)
    : href;

  let scope: ScopeType = useContext(DocsContext).scope;

  const { query } = splitPath(href);

  // If a valid scope is provided via query parameter, adjust the
  // link to navigate to that scope.
  if (
    query.hasOwnProperty("scope") &&
    scopeValues.includes(query.scope as ScopeType)
  ) {
    scope = query["scope"] as ScopeType;
  }

  if (
    isHash(noBaseHref) ||
    isExternalLink(noBaseHref) ||
    isLocalAssetFile(noBaseHref)
  ) {
    return noBaseHref;
  }

  // console.log("??????", href, asPath);

  const currentHref = normalizePath(asPath);

  // console.log("!!!", currentHref, href);

  let fullHref = resolve(splitPath(currentHref).path, noBaseHref);

  console.log("***", href, noBaseHref, splitPath(currentHref).path);

  return updateScopeInUrl(fullHref, scope);
};
