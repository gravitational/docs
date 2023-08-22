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

// labelHashKey returns the key that TabContextProvider uses to get and set the
// selected tab label or dropdown menu item within a particular combination of
// lables/menu items.
const labelHashKey = (labels: Array<string>): string => {
  const labelsCopy = [...labels];
  labelsCopy.sort();
  return labelsCopy.join("");
};

interface TabContextProviderProps {
  children: ReactNode;
}

// TabContextProvider tracks the currently selected tab label and dropdown menu
// option in each Tabs component that has rendered.
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
