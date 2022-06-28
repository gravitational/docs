import { createContext, useCallback, useMemo, useState } from "react";

export interface VarsContextProps {
  fields: {
    [name: string]: string;
  };
  globalFields: {
    [name: string]: boolean;
  };
  setField(name: string, value: string): void;
  addField(name: string, isGlobal?: boolean): void;
}

export const VarsContext = createContext<VarsContextProps>({
  fields: {},
  globalFields: {},
  setField: () => {},
  addField: () => {},
});

interface VarsProviderProps {
  children: React.ReactNode;
}

const getName = (rawName) => `global_var_${rawName}`;

const saveValue = (raw_name, value): boolean => {
  const name = getName(raw_name);
  try {
    sessionStorage.setItem(name, value);
    return true;
  } catch (e) {
    return false;
  }
};

const getValue = (raw_name): string | void => {
  const name = getName(raw_name);
  try {
    return sessionStorage.getItem(name) || "";
  } catch (e) {
    return undefined;
  }
};

export const VarsProvider = ({ children }: VarsProviderProps) => {
  const [fields, setFields] = useState({});
  const [globalFields, setGlobalFields] = useState({});

  const setField = useCallback(
    (name, value = "") => {
      setFields((f) => ({ ...f, [name]: value }));

      if (globalFields[name]) {
        saveValue(name, value);
      }
    },
    [globalFields]
  );

  const addField = useCallback(
    (name, isGlobal) => {
      if (isGlobal) {
        setGlobalFields((f) => ({ ...f, [name]: true }));
      }

      setField(name, isGlobal ? getValue(name) : "");
    },
    [setField]
  );

  const value = useMemo(
    () => ({
      fields,
      globalFields,
      setField,
      addField,
    }),
    [fields, globalFields, addField, setField]
  );

  return <VarsContext.Provider value={value}>{children}</VarsContext.Provider>;
};
