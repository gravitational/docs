import { resolve } from "url";
import { useRouter } from "next/router";
import { useContext } from "react";
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

  const noBaseHref = href.startsWith(basePath)
    ? href.substring(basePath.length)
    : href;

  const { scope } = useContext(DocsContext);

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
