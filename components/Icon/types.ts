import * as icons from "./icons";

export type IconName = keyof typeof icons;

const allIconNames = new Set(Object.keys(icons));

export const isIconName = (iconSrc: string): iconSrc is IconName =>
  allIconNames.has(iconSrc);
