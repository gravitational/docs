export interface DataTab {
  label: string;
  isPreSelected: boolean;
}

export interface TabsInDropdowns {
  [key: string]: DataTab[];
}

export interface TabItemProps {
  label: string;
  children: React.ReactNode;
  selected?: boolean;
  scope?: string | string[];
  options?: string;
}

export interface TabsLabel {
  selected: boolean;
  label: string;
  onClick: (label: string) => void;
}

export interface TabsProps {
  children: React.ReactNode;
  dropdownCaption?: string;
  dropdownSelected?: string;
  dropdownView?: boolean;
}

export interface TabItemsListProps {
  childTabs: React.ReactComponentElement<React.FC<TabItemProps>>[];
  currentTab: string;
  selectedOption: string;
  latestDocVers: string;
  currentDocVers: string;
}

export interface TabLabelsListProps {
  visibleTabs: string[];
  tabsMeta: DataTab[];
  currentTab: string;
  onClick: (label: string) => void;
}
