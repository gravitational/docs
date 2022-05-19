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

const getSelectedLabel = (
  tabs: React.ReactComponentElement<typeof TabItem>[]
): string => {
  const selectedTab = tabs.find(({ props: { selected } }) => selected);

  return selectedTab ? selectedTab.props.label : tabs[0]?.props.label;
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
}

export const Tabs = ({ children }: TabsProps) => {
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
  const dropdownVars: Set<string> = new Set();

  childTabs.forEach(({ props: { inDropdown } }) => {
    if (inDropdown) {
      const dropdownFromItem = inDropdown.split(",");
      dropdownFromItem.forEach((item) => dropdownVars.add(item.trim()));
    }
  });

  const dropdownVarsArr = Array.from(dropdownVars).sort();
  const [currentLabel, setCurrentLabel] = useState(getSelectedLabel(childTabs));
  const [selected, setSelected] = useState(dropdownVarsArr[0]);

  const labels = childTabs
    .map(({ props: { label, inDropdown } }) => {
      if (inDropdown) {
        const dropdownFromItem = inDropdown.split(",");

        for (const elem of dropdownFromItem) {
          if (elem.trim() === selected) {
            return label;
          }
        }
      } else {
        return label;
      }
    })
    .filter(Boolean);

  useEffect(() => {
    setCurrentLabel(labels[0]);
  }, [selected]);

  useEffect(() => {
    const scopedTab = childTabs.find(({ props }) =>
      getScopes(props.scope).includes(scope)
    );

    if (scopedTab) {
      setCurrentLabel(scopedTab.props.label);
    }
  }, [scope, childTabs]);

  return (
    <div className={styles.wrapper}>
      {dropdownVarsArr.length ? (
        <div className={styles["drop-wrapper"]}>
          <p className={styles["drop-title"]}>
            In this place will be your text
          </p>
          <Dropdown
            className={styles.dropdown}
            value={selected}
            options={dropdownVarsArr}
            onChange={setSelected}
          />
        </div>
      ) : null}
      <div
        className={cn(
          styles.header,
          dropdownVarsArr.length ? styles["header-shadow"] : null
        )}
      >
        {labels.map((label) => (
          <TabLabel
            key={label}
            label={label}
            onClick={setCurrentLabel}
            selected={label === currentLabel}
          />
        ))}
      </div>
      {childTabs.map((tab) => {
        return (
          <div
            key={tab.props.label}
            className={tab.props.label !== currentLabel ? styles.hidden : null}
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
