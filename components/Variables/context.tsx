import { createContext, useCallback, useMemo, useState } from "react";

export interface VarsContextProps {
  fields: {
    [name: string]: string;
  };
  globalFields: {
    [name: string]: boolean;
  };
  initials: {
    [name: string]: string;
  };
  fieldDescriptions: {
    [name: string]: string;
  };
  putField: (
    name: string,
    value: string,
    isGlobal?: boolean,
    description?: string
  ) => void;
  setInitial: (name: string, initial: string) => void;
}

export const VarsContext = createContext<VarsContextProps>({
  fields: {},
  globalFields: {},
  initials: {},
  fieldDescriptions: {},
  putField: () => {},
  setInitial: () => {},
});

interface VarsProviderProps {
  children: React.ReactNode;
}

const getName = (rawName: string) => `global_var_${rawName}`;

const saveValue = (rawName: string, value: string): boolean => {
  const name = getName(rawName);
  try {
    sessionStorage.setItem(name, value);
    return true;
  } catch (e) {
    return false;
  }
};

const getValue = (rawName: string): string | undefined => {
  const name = getName(rawName);
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
  const [initials, setInitials] = useState({});

  // putField is provided to context consumers. Since it calls state setter
  // functions (via useState, above), each call triggers a rerender of
  // VarsProvider, providing up-to-date values to context consumers.
  const putField = (name, value, isGlobal, description) => {
    if (description) {
      setFieldDescriptions((d) => ({ ...d, [name]: description }));
    }

    if (isGlobal) {
      setGlobalFields((f) => ({ ...f, [name]: true }));
    }

    setFields((f) => ({ ...f, [name]: value }));

    if (globalFields[name]) {
      saveValue(name, value);
    }
  };

  const setInitial = (name: string, initial: string) => {
    setInitials((i) => ({ ...i, [name]: initial }));
    setFields((f) => ({ ...f, [name]: initial }));
  };

  const value = {
    fields,
    globalFields,
    fieldDescriptions,
    initials,
    putField,
    setInitial,
  };

  return <VarsContext.Provider value={value}>{children}</VarsContext.Provider>;
};
