import { createContext, useCallback, useMemo, useState } from "react";

export interface VarsContextProps {
  fields: {
    [name: string]: string;
  };
  globalFields: {
    [name: string]: boolean;
  };
  fieldDescriptions: {
    [name: string]: string;
  };
  setField(name: string, value: string, description: string): void;
  addField(name: string, isGlobal?: boolean, description?: string): void;
}

export const VarsContext = createContext<VarsContextProps>({
  fields: {},
  globalFields: {},
  fieldDescriptions: {},
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
  const [fieldDescriptions, setFieldDescriptions] = useState({});

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
    (name, isGlobal, description) => {
      if (description) {
        setFieldDescriptions((d) => ({ ...d, [name]: description }));
      }

      if ((isGlobal && name in globalFields) || name in fields) {
        return;
      }

      if (isGlobal) {
        setGlobalFields((f) => ({ ...f, [name]: true }));
      }

      setField(name, isGlobal ? getValue(name) : "");
    },
    [setField, fields, globalFields]
  );

  const value = useMemo(
    () => ({
      fields,
      globalFields,
      fieldDescriptions,
      setField,
      addField,
    }),
    [fields, globalFields, fieldDescriptions, addField, setField]
  );

  return <VarsContext.Provider value={value}>{children}</VarsContext.Provider>;
};
