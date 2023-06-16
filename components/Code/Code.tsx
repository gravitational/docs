import cn from "classnames";
import styles from "./Code.module.css";

export type CodeProps = {
  children: React.ReactNode;
  className?: string;
};

export const Code = ({ children, className }: CodeProps) => {
  return <pre className={cn(styles.wrapper, className)}>{children}</pre>;
};
