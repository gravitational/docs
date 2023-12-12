import { useRouter } from "next/router";
import { createContext, useState, useEffect } from "react";
import { splitPath, buildPath } from "utils/url";
import { VersionsInfo, scopeValues, ScopeType } from "./types";

export interface DocsContextProps {
  versions: VersionsInfo;
  setVersions: (version: VersionsInfo) => void;
}

const defaultVersions = {
  latest: process.env.DOCS_LATEST_VERSION,
  current: "",
  available: [],
};

export const DocsContext = createContext<DocsContextProps>({
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

  const [ready, setReady] = useState<boolean>(false);
  const [versions, setVersions] = useState<VersionsInfo>({
    ...defaultVersions,
    current,
  });

  // We set these variables to prevent incosistency with ssr
  useEffect(() => {
    if (!ready) {
      setReady(true);
    }
  }, [ready, router, versions]);

  return (
    <DocsContext.Provider
      value={{
        versions,
        setVersions,
      }}
    >
      {children}
    </DocsContext.Provider>
  );
};
