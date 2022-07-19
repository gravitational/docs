import cn from "classnames";
import * as icons from "./icons";
import { IconName } from "./types";
import styles from "./Icon.module.css";

export interface IconProps {
  name: IconName;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Icon = ({ name, size = "md", className }: IconProps) => {
  const IconSVG = icons[name];

  if (!IconSVG) {
    return <span className={cn(styles.wrapper, styles[size], className)} />;
  }

  return <IconSVG className={cn(styles.wrapper, styles[size], className)} />;
};

export default Icon;
