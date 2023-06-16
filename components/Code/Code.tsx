import cn from "classnames";
import styles from "./Code.module.css";

export interface CodeLineProps {
  children: React.ReactNode;
}

export function CodeLine(props: CodeLineProps) {
  return <span className={styles.line} {...props} />;
}

export type CodeProps = {
  children: React.ReactNode;
  className?: string;
};

export const Code = ({ children, className }: CodeProps) => {
  return <pre className={cn(styles.wrapper, className)}>{children}</pre>;
};
