// Moved this types to separate file to simplyfy loaders build that requires them

import type { IconName } from "components/Icon/types";
import { VideoBarProps } from "components/VideoBar/types";

export const scopeValues = ["oss", "cloud", "enterprise"] as const;

export type ScopeType = typeof scopeValues[number];
export type ScopesType = ScopeType | ScopeType[];

export interface NavigationItem {
  title: string;
  slug: string;
  hideInScopes?: ScopesType;
  entries?: NavigationItem[];
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
  githubUrl: string;
  layout?: LayoutName;
  videoBanner?: VideoBarProps;
  navigation: NavigationCategory[];
  versions: VersionsInfo;
}
