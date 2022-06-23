import { createContext, useCallback, useMemo, useState } from "react";

export interface VarsContextProps {
  fields: {
    [name: string]: string;
  };
  setField: (name: string, value: string) => void;
  addField: (name: string) => void;
  markGlobalField: (name: string) => void;
}

export const VarsContext = createContext<VarsContextProps>({
  fields: {},
  setField: () => undefined,
  addField: () => undefined,
  markGlobalField: () => undefined,
});

interface VarsContextProviderProps {
  children: React.ReactNode;
}

export const VarsContextProvider = ({ children }: VarsContextProviderProps) => {
  const [fields, setFields] = useState({});
  const [globalFields, setGlobalFields] = useState({});

  const setField = useCallback(
    (name, value = "") => {
      setFields((f) => ({ ...f, [name]: value }));

      if (globalFields[name]) {
        sessionStorage.setItem(`global_var_${name}`, value);
      }
    },
    [globalFields]
  );

  const markGlobalField = useCallback(
    (name) => {
      setGlobalFields((f) => ({ ...f, [name]: true }));

      const fieldValue = sessionStorage.getItem(`global_var_${name}`);
      if (fieldValue) {
        setField(name, fieldValue);
      }
    },
    [setField]
  );

  const value = useMemo(
    () => ({
      fields,
      setField,
      addField: setField,
      markGlobalField,
    }),
    [fields, setField, markGlobalField]
  );

  return <VarsContext.Provider value={value}>{children}</VarsContext.Provider>;
};
