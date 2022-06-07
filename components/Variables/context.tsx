import { createContext, useCallback, useMemo, useState } from "react";

export interface VarsContextProps {
  fields: {
    [name: string]: string;
  };
  setField: (name: string, value: string) => void;
  addField: (name: string) => void;
}

export const VarsContext = createContext<VarsContextProps>({
  fields: {},
  setField: () => undefined,
  addField: () => undefined,
});

interface VarsContextProviderProps {
  children: React.ReactNode;
}

export const VarsContextProvider = ({ children }: VarsContextProviderProps) => {
  const [fields, setFields] = useState({});

  const setField = useCallback((name, value = "") => {
    setFields((f) => ({ ...f, [name]: value }));
  }, []);

  const value = useMemo(
    () => ({
      fields,
      setField,
      addField: setField,
    }),
    [fields, setField]
  );

  return <VarsContext.Provider value={value}>{children}</VarsContext.Provider>;
};
