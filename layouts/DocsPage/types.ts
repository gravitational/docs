// Moved this types to separate file to simplyfy loaders build that requires them

import type { IconName } from "components/Icon/types";
import { VideoBarProps } from "components/VideoBar/types";

export interface NavigationItem {
  title: string;
  slug: string;
  entries?: NavigationItem[];
}

export interface NavigationCategory {
  icon: IconName;
  title: string;
  entries: NavigationItem[];
}

export interface VersionsInfo {
  current: string;
  latest: string;
  available: string[];
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
