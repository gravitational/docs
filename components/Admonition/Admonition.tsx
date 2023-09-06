import cn from "classnames";
import { useContext, useMemo } from "react";
import { DocsContext } from "layouts/DocsPage/context";
import styles from "./Admonition.module.css";

const capitalize = (text: string): string =>
  text.replace(/^\w/, (c) => c.toUpperCase());

const types = ["warning", "tip", "note", "danger"] as const;

export interface AdmonitionProps {
  type: (typeof types)[number];
  title: string;
  children: React.ReactNode;
  scope?: string | string[];
}

const Admonition = ({
  type = "tip",
  title,
  children,
  scope,
}: AdmonitionProps) => {
  const resolvedType = type && types.includes(type) ? type : "tip";

  return (
    <div className={cn(styles.wrapper, styles[resolvedType])}>
      <div className={styles.header}>{title || capitalize(type)}</div>
      <div className={styles.body}>{children}</div>
    </div>
  );
};

export default Admonition;
