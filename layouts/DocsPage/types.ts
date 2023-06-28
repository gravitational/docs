// Moved this types to separate file to simplyfy loaders build that requires them

import type { IconName } from "components/Icon/types";
import { VideoBarProps } from "components/VideoBar/types";

export const scopeValues = ["oss", "enterprise", "cloud", "team"] as const;

export type ScopeType = (typeof scopeValues)[number];
export type ScopesType = ScopeType | ScopeType[];

export type ScopesInMeta = [""] | ["noScope"] | ScopeType[];

interface BaseNavigationItem {
  title: string;
  slug: string;
  entries?: NavigationItem[];
}
export interface RawNavigationItem extends BaseNavigationItem {
  forScopes?: ScopeType[];
}

export interface NavigationItem extends BaseNavigationItem {
  forScopes: ScopesInMeta;
}

export interface NavigationCategory {
  icon: IconName;
  title: string;
  entries: NavigationItem[];
}

interface LinkWithRedirect {
  path: string;
  foundedConfigRedirect?: string;
}

export interface LinkWithRedirectList {
  [key: string]: LinkWithRedirect[];
}

export interface VersionsInfo {
  current: string;
  latest: string;
  available: string[];
  disabled?: boolean;
  className?: string;
  getNewVersionPath?: (ver: string) => string;
}

export interface VersionsDropdown {
  value: string;
  deprecated: boolean;
}

export type LayoutName = "doc" | "section" | "tocless-doc";

export interface PageMeta {
  title?: string;
  description?: string;
  h1?: string;
  keywords: string[];
  githubUrl: string;
  layout?: LayoutName;
  videoBanner?: VideoBarProps;
  navigation: NavigationCategory[];
  versions: VersionsInfo;
  scopes: ScopesInMeta;
}
