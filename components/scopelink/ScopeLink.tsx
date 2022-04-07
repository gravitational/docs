import { ScopeType } from "layouts/DocsPage/types";
import styles from "components/Link/Link.module.css";
import { DocsContext } from "layouts/DocsPage/context";
import { useContext } from "react";
import cn from "classnames";

export interface ScopeLinkProps {
  scope: ScopeType;
  children: React.ReactNode;
}

export const ScopeLink = ({ scope, children }: ScopeLinkProps) => {
  const { setScope } = useContext(DocsContext);

  return (
    <a
      href="#"
      className={cn(styles.wrapper)}
      onClick={(e) => {
        e.preventDefault();
        setScope(scope);
      }}
    >
      {children}
    </a>
  );
};
