import { TabItemProps, TabItemsListProps } from "./types";
import styles from "./TabItem.module.css";

export const TabItem = ({ children }: TabItemProps) => {
  return (
    <div data-testid="tabitem" className={styles.item}>
      {children}
    </div>
  );
};

/* optionSelected indicates whether one of the dropdown options available for a
 * TabItem is currently selected.
 * @param allOptions The value of the "options" prop in a TabItem
 * @param selectedOption The currently selected option in the Tabs dropdown menu
 */
const optionSelected = function (
  allOptions: string,
  selectedOption: string
): boolean {
  if (!allOptions || !selectedOption) {
    return true;
  }
  const options = allOptions.split(",");
  if (options.length == 0) {
    return true;
  }
  return options.indexOf(selectedOption) != -1;
};

export const TabItemList = ({
  childTabs,
  currentTab,
  latestDocVers,
  currentDocVers,
  selectedOption,
}: TabItemsListProps) => {
  const tabItems = childTabs.map((tab) => {
    // Mark a tab item as hidden unless its label and one of its dropdown
    // options are selected.
    const labeClassName =
      tab.props.label !== currentTab ||
      !optionSelected(tab.props.options, selectedOption)
        ? styles.hidden
        : null;

    return (
      <div key={tab.props.label + tab.props.options} className={labeClassName}>
        {tab}
      </div>
    );
  });

  return <>{tabItems}</>;
};
