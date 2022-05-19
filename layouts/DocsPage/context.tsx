import { useRouter } from "next/router";
import { createContext, useState, useEffect } from "react";
import { splitPath, buildPath } from "utils/url";
import { VersionsInfo, scopeValues, ScopeType } from "./types";

export const getScopes = (scopes?: string | string[]): ScopeType[] => {
  if (typeof scopes === "string") {
    return scopes
      .split(",")
      .map((scope) => scope.trim())
      .filter((scope) =>
        scopeValues.includes(scope as ScopeType)
      ) as ScopeType[];
  } else if (Array.isArray(scopes)) {
    return scopes.filter((scope) =>
      scopeValues.includes(scope as ScopeType)
    ) as ScopeType[];
  } else {
    return [];
  }
};

export const getScopeFromUrl = (asPath: string): ScopeType => {
  const { query } = splitPath(asPath);

  const scope = query.scope as ScopeType;

  return scopeValues.includes(scope) ? scope : "oss";
};

export const updateScopeInUrl = (asPath: string, scope: ScopeType): string => {
  const urlParts = splitPath(asPath);

  if (scope === "oss") {
    if (urlParts.query.scope) {
      delete urlParts.query.scope;
    }
  } else {
    urlParts.query.scope = scope;
  }

  return buildPath(urlParts);
};

export interface DocsContextProps {
  scope: ScopeType;
  setScope: (scope: ScopeType) => void;
  versions: VersionsInfo;
  setVersions: (version: VersionsInfo) => void;
}

const defaultVersions = {
  latest: process.env.DOCS_LATEST_VERSION,
  current: "",
  available: [],
};

export const DocsContext = createContext<DocsContextProps>({
  scope: "oss",
  setScope: () => undefined,
  versions: defaultVersions,
  setVersions: () => undefined,
});

interface DocsContextProviderProps {
  children: React.ReactNode;
}

export const DocsContextProvider = ({ children }: DocsContextProviderProps) => {
  const router = useRouter();
  const current = router.asPath.startsWith("/ver/")
    ? router.asPath.split("/")[2]
    : "";

  const urlScope = getScopeFromUrl(router.asPath);
  const [ready, setReady] = useState<boolean>(false);
  const [scope, setScope] = useState<ScopeType>("oss");
  const [versions, setVersions] = useState<VersionsInfo>({
    ...defaultVersions,
    current,
  });

  // We set these variables to prevent incosistency with ssr
  useEffect(() => {
    if (!ready) {
      setScope(urlScope);
      setReady(true);
    } else {
      if (scope === "cloud" && versions.current !== versions.latest) {
        router.replace("/?scope=cloud");
      } else if (scope !== urlScope) {
        router.replace(
          updateScopeInUrl(router.asPath, scope),
          updateScopeInUrl(router.asPath, scope),
          { shallow: true }
        );
      }
    }
  }, [scope, ready, urlScope, router, versions]);

  return (
    <DocsContext.Provider
      value={{
        scope,
        setScope,
        versions,
        setVersions,
      }}
    >
      {children}
    </DocsContext.Provider>
  );
};
