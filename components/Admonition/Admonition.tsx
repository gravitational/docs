import cn from "classnames";
import { useContext, useMemo } from "react";
import { DocsContext, getScopes } from "layouts/DocsPage/context";
import { ScopesType } from "layouts/DocsPage/types";
import { wrapper, header, body } from "./Admonition.css";

const capitalize = (text: string): string =>
  text.replace(/^\w/, (c) => c.toUpperCase());

const types = ["warning", "tip", "note", "danger"] as const;

export interface AdmonitionProps {
  type: typeof types[number];
  title: string;
  children: React.ReactNode;
  scopeOnly: boolean;
  scope?: ScopesType;
}

const Admonition = ({
  type = "tip",
  title,
  children,
  scopeOnly = false,
  scope,
}: AdmonitionProps) => {
  const resolvedType = type && types.includes(type) ? type : "tip";
  const { scope: currentScope } = useContext(DocsContext);
  const scopes = useMemo(() => getScopes(scope), [scope]);
  const isInCurrentScope = scopes.includes(currentScope);
  const isHidden = scopeOnly && !isInCurrentScope;

  return (
    <div className={wrapper({ type: isHidden ? "hidden" : resolvedType })}>
      <div className={header}>{title || capitalize(type)}</div>
      <div className={body}>{children}</div>
    </div>
  );
};

export default Admonition;
