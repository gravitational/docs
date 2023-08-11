import { createContext, useState } from "react";
import { createHash } from "crypto";
import type { BinaryToTextEncoding } from "crypto";
import { DataTab } from "./types";
import type { ReactNode } from "react";

export interface TabContextProps {
  getSelectedLabel: (tabs: Array<string>) => string;
  setSelectedLabel: (tabs: Array<string>, selected: string) => void;
}

export const TabContext = createContext<TabContextProps>({
  getSelectedLabel: (tabs: Array<string>): string => {
    return "";
  },
  setSelectedLabel: (tabs: Array<string>, selected: string) => {
    return;
  },
});

const labelHashKey = (labels: Array<string>): string => {
  const labelsCopy = [...labels];
  labelsCopy.sort();
  const hash = createHash("sha256");
  hash.update(labelsCopy.join(""));
  return hash.digest("utf8" as BinaryToTextEncoding);
};

interface TabContextProviderProps {
  children: ReactNode;
}

export const TabContextProvider = ({ children }: TabContextProviderProps) => {
  const [stateForAllLabels, setStateForAllLabels] = useState({});

  const context = {
    getSelectedLabel: (tabs: Array<string>): string => {
      return stateForAllLabels[labelHashKey(tabs)];
    },

    setSelectedLabel: (tabs: Array<string>, selected: string): void => {
      const key = labelHashKey(tabs);
      setStateForAllLabels((prevState) => {
        return { ...prevState, [key]: selected };
      });
    },
  };

  return <TabContext.Provider value={context}>{children}</TabContext.Provider>;
};
