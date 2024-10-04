import { clsx } from "clsx";

import type { IconName } from "./types";
import * as icons from "./icons";
import styles from "./Icon.module.css";

export interface IconProps {
  name: IconName;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  inline?: boolean;
}

const Icon = ({ name, size = "md", className, inline = false }: IconProps) => {
  const IconSVG = icons[name];

  if (!IconSVG) {
    return <span className={clsx(styles.wrapper, styles[size], className)} />;
  }

  return (
    <IconSVG
      className={clsx(styles.wrapper, styles[size], className, {
        [styles.inline]: inline,
      })}
    />
  );
};

export default Icon;
