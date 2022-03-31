import cn from "classnames";
import styles from "./Logo.module.css";
import LogoSvg from "./assets/logo.svg?react";

export type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => (
  <LogoSvg className={cn(styles.wrapper, className)} />
);

export default Logo;
