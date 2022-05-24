import { VersionWarning } from "layouts/DocsPage";
import { TabItemProps, TabItemsListProps } from "./types";
import styles from "./TabItem.module.css";

export const TabItem = ({ children }: TabItemProps) => {
  return <div className={styles.item}>{children}</div>;
};

export const TabItemsList = ({
  childTabs,
  currentTab,
  latestDocVers,
  currentDocVers,
}: TabItemsListProps) => {
  const tabItems = childTabs.map((tab) => {
    const labeClassName = tab.props.label !== currentTab ? styles.hidden : null;

    return (
      <div key={tab.props.label} className={labeClassName}>
        {tab.props.scope === "cloud" && latestDocVers !== currentDocVers ? (
          <TabItem label={tab.props.label}>
            <VersionWarning />
          </TabItem>
        ) : (
          tab
        )}
      </div>
    );
  });

  return <>{tabItems}</>;
};
