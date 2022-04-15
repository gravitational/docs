import cn from "classnames";
import * as icons from "./icons";
import { IconName } from "./types";
import { wrapper } from "./Icon.css";

export interface IconProps {
  name: IconName;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Icon = ({ name, size = "md", className }: IconProps) => {
  const IconSVG = icons[name];

  if (!IconSVG) {
    return <span className={cn(wrapper({ size }), className)} />;
  }

  return <IconSVG className={cn(wrapper({ size }), className)} />;
};

export default Icon;
