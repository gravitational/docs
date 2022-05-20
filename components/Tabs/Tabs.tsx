import cn from "classnames";
import {
  isValidElement,
  Children,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import HeadlessButton from "components/HeadlessButton";
import { Dropdown } from "components/Dropdown";
import { VersionWarning } from "layouts/DocsPage";
import { DocsContext, getScopes } from "layouts/DocsPage/context";
import styles from "./Tabs.module.css";

const getDropdownFromItem = (inDropdown: string = ""): string[] => {
  return inDropdown.split(",").map((item) => item.trim());
};

const isInDropdown = (
  inDropdown: string,
  dropdownSelected: string
): boolean => {
  return getDropdownFromItem(inDropdown).includes(dropdownSelected);
};

interface DataTab {
  label: string;
  isPreSelected: boolean;
}

interface TabsInDropdowns {
  [key: string]: DataTab[];
}

const getSelectedTab = (tabsMeta: DataTab[]) => {
  const selected = tabsMeta.find((t) => t.isPreSelected);
  return selected ? selected.label : tabsMeta[0].label;
};

export interface TabItemProps {
  label: string;
  children: React.ReactNode;
  selected?: boolean;
  scope?: string | string[];
  inDropdown?: string;
}

export const TabItem = ({ children }: TabItemProps) => {
  return <div className={styles.item}>{children}</div>;
};

interface TabsLabel {
  selected: boolean;
  label: string;
  onClick: (label: string) => void;
}

const TabLabel = ({ selected, label, onClick }: TabsLabel) => {
  return (
    <HeadlessButton
      disabled={selected}
      onClick={() => onClick(label)}
      className={cn(styles.label, selected ? styles.selected : styles.default)}
    >
      {label}
    </HeadlessButton>
  );
};

export interface TabsProps {
  children: React.ReactNode;
  dropdownCaption?: string;
  dropdownSelected?: string;
}

const FAKE_DROPDOWN = "$all";

export const Tabs = ({
  children,
  dropdownCaption,
  dropdownSelected,
}: TabsProps) => {
  const {
    scope,
    versions: { latest, current },
  } = useContext(DocsContext);

  const childTabs = useMemo(
    () =>
      Children.toArray(children).filter(
        (c) => isValidElement(c) && c.props.label && c.props.children
      ) as React.ReactComponentElement<typeof TabItem>[],
    [children]
  );

  const dropdownVarsArr = useMemo(() => {
    const dropdownVars: Set<string> = new Set();

    childTabs.forEach(({ props: { inDropdown } }) => {
      if (inDropdown) {
        const dropdownFromItem = getDropdownFromItem(inDropdown);
        dropdownFromItem.forEach((item) => dropdownVars.add(item));
      }
    });

    return Array.from(dropdownVars).sort().concat(FAKE_DROPDOWN);
  }, [childTabs]);

  const tabsInDropdown: TabsInDropdowns = useMemo(() => {
    const data: TabsInDropdowns = {};

    for (const option of dropdownVarsArr) {
      data[option] = [];
      childTabs.forEach(({ props: { label, selected, inDropdown } }) => {
        let dataTab: DataTab;
        if (inDropdown && option !== FAKE_DROPDOWN) {
          if (isInDropdown(inDropdown, option)) {
            dataTab = { label, isPreSelected: Boolean(selected) };
          }
        } else {
          dataTab = { label, isPreSelected: Boolean(selected) };
        }
        if (dataTab) {
          data[option].push(dataTab);
        }
      });
    }

    return data;
  }, [childTabs, dropdownVarsArr]);

  const [selectedDropdownOption, setSelectedDropdownOpt] = useState(
    dropdownSelected ? dropdownSelected : dropdownVarsArr[0]
  );
  const tabsMeta = tabsInDropdown[selectedDropdownOption];
  const [currentTab, setCurrentTab] = useState(getSelectedTab(tabsMeta));

  useEffect(() => {
    setCurrentTab(getSelectedTab(tabsMeta));
  }, [tabsMeta, selectedDropdownOption]);

  useEffect(() => {
    const scopedTab = childTabs.find(({ props }) =>
      getScopes(props.scope).includes(scope)
    );

    if (scopedTab) {
      setCurrentTab(scopedTab.props.label);
    }
  }, [scope, childTabs]);

  const visibleTabs = dropdownVarsArr.filter((t) => t !== FAKE_DROPDOWN);

  return (
    <div className={styles.wrapper}>
      {visibleTabs.length ? (
        <div className={styles["drop-wrapper"]}>
          <p className={styles["drop-title"]}>
            {dropdownCaption ? dropdownCaption : "Choose one of the options"}
          </p>
          <Dropdown
            className={styles.dropdown}
            value={selectedDropdownOption}
            options={visibleTabs}
            onChange={setSelectedDropdownOpt}
          />
        </div>
      ) : null}
      <div
        className={cn(
          styles.header,
          visibleTabs.length ? styles["header-shadow"] : null
        )}
      >
        {tabsMeta.map((t) => (
          <TabLabel
            key={t.label}
            label={t.label}
            onClick={setCurrentTab}
            selected={t.label === currentTab}
          />
        ))}
      </div>
      {childTabs.map((tab) => {
        return (
          <div
            key={tab.props.label}
            className={tab.props.label !== currentTab ? styles.hidden : null}
          >
            {tab.props.scope === "cloud" && latest !== current ? (
              <TabItem label={tab.props.label}>
                <VersionWarning />
              </TabItem>
            ) : (
              tab
            )}
          </div>
        );
      })}
    </div>
  );
};

Tabs.Item = TabItem;
