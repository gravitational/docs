import cn from "classnames";
import { wrapper } from "./Logo.css";
import LogoSvg from "./assets/logo.svg?react";

export type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => (
  <LogoSvg className={cn(wrapper, className)} />
);

export default Logo;
