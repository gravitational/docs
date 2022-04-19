import {
  isValidElement,
  Children,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import HeadlessButton from "components/HeadlessButton";
import { VersionWarning } from "layouts/DocsPage";
import { DocsContext, getScopes } from "layouts/DocsPage/context";
import { ScopesType } from "layouts/DocsPage/types";
import * as styles from "./Tabs.css";

const getSelectedLabel = (
  tabs: React.ReactComponentElement<typeof TabItem>[]
): string => {
  const selectedTab = tabs.find(({ props: { selected } }) => selected);

  return selectedTab ? selectedTab.props.label : tabs[0]?.props.label;
};

export interface TabItemProps {
  selected?: boolean;
  scope?: ScopesType;
  label: string;
  children: React.ReactNode;
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
      className={styles.label({ selected })}
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

  const labels = childTabs.map(({ props: { label } }) => label);

  const [currentLabel, setCurrentLabel] = useState(getSelectedLabel(childTabs));

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
      <div className={styles.header}>
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
