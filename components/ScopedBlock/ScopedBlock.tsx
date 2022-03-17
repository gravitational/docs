import { useRouter } from "next/router";
import { getScopeFromUrl } from "layouts/DocsPage/context";
import { ScopesType } from "layouts/DocsPage/types";

interface ScopedBlockProps {
  scope: ScopesType;
  children: React.ReactNode;
}

export const ScopedBlock = ({ scope, children }: ScopedBlockProps) => {
  const router = useRouter();
  const urlScope = getScopeFromUrl(router.asPath);
  let isDisplayedBlock: boolean;

  if (Array.isArray(scope)) {
    isDisplayedBlock = scope.some((propsScope) => propsScope === urlScope);
  } else {
    isDisplayedBlock = scope === urlScope;
  }

  return isDisplayedBlock ? <>{children}</> : null;
};
