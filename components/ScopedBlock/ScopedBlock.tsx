import { useMemo, useContext } from "react";
import { DocsContext, getScopes } from "layouts/DocsPage/context";

interface ScopedBlockProps {
  scope: string | string[];
  children: React.ReactNode;
}

export const ScopedBlock = ({ scope, children }: ScopedBlockProps) => {
  const { scope: currentScope } = useContext(DocsContext);
  const scopes = useMemo(() => getScopes(scope), [scope]);
  const isInCurrentScope = scopes.includes(currentScope);

  return isInCurrentScope ? <>{children}</> : null;
};
