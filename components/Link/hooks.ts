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
  // BasePath is "/docs"
  const { asPath, basePath } = useRouter();

  // This strips the prefix of "/docs" from all string hrefs if the beginning of
  // the href is "/docs"
  const noBaseHref = href.startsWith(basePath)
    ? href.substring(basePath.length)
    : href;

  let scope: ScopeType = useContext(DocsContext).scope;

  const { query } = splitPath(href);

  // This needs to be added because all strings of "/docs/" are being stripped down to
  // "/" in noBaseHref. This is called below useContext because of the rule of hooks
  // in which hooks are not able to be called conditionally
  if (href === `${basePath}/`) {
    return href;
  }

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

  const currentHref = normalizePath(asPath);

  let fullHref = resolve(splitPath(currentHref).path, noBaseHref);

  return updateScopeInUrl(fullHref, scope);
};
