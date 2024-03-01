// Moved this types to separate file to simplyfy loaders build that requires them

import type { IconName } from "components/Icon/types";
import { VideoBarProps } from "components/VideoBar/types";

export const scopeValues = ["oss", "enterprise", "cloud"] as const;

export type ScopeType = (typeof scopeValues)[number];
export type ScopesType = ScopeType | ScopeType[];

export type ComplexScopesConfig =
  | "oss,cloud"
  | "oss,enterprise"
  | "enterprise,oss"
  | "enterprise,cloud"
  | "cloud,oss"
  | "cloud,enterprise"
  | "oss,enterprise,cloud"
  | "oss,cloud,enterprise"
  | "enterprise,oss,cloud"
  | "enterprise,cloud,oss"
  | "cloud,enterprise,oss"
  | "cloud,oss,enterprise";

type ScopesConfig = ScopeType | ComplexScopesConfig;

export type ScopesInMeta = [""] | ["noScope"] | ScopeType[];

interface BaseNavigationItem {
  title: string;
  slug: string;
  entries?: NavigationItem[];
}
export interface RawNavigationItem extends BaseNavigationItem {
  forScopes?: ScopesConfig | ScopeType[];
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
