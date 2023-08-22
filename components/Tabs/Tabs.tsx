import {
  isValidElement,
  Children,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { Dropdown } from "components/Dropdown";
import { DocsContext } from "layouts/DocsPage/context";
import { TabLabelList } from "./TabLabel";
import { TabItemList } from "./TabItem";
import { DataTab, TabsInDropdowns, TabItemProps, TabsProps } from "./types";
import styles from "./Tabs.module.css";
import { TabContext } from "./TabContext";

/**
 * An example of using this component.
 * 
 * - If at least one TabsItem has an inDropdown prop,
 * then TabsItems without an inDropdown prop will be displayed in all Dropdown options.
 * - You can replace the Tab Labels with a dropdown list. To do this, add the prop 
 * `dropdownView` to the Tabs component. 
 * <Tabs dropdownView> ... </Tabs>
 * 
 * <Tabs dropdownCaption="Installing Teleport" dropdownSelected="gatsby">
    <TabItem label="Download" options="gatsby, js">
      [Download MacOS .pkg installer](https://goteleport.com/teleport/download?os=mac) (tsh client only, signed) file, double-click to run the Installer.
    </TabItem>

    <TabItem label="Homebrew" options="js, kotlin, python" selected>
      ```code
      $ brew install teleport
      ```
    </TabItem>

    <TabItem label="Terminal" options="gatsby, python, java">
      ```code
      $ curl -O https://get.gravitational.com/teleport-(=teleport.version=).pkg
      $ sudo installer -pkg teleport-(=teleport.version=).pkg -target / # Installs on Macintosh HD
      # Password:
      # installer: Package name is teleport-(=teleport.version=)
      # installer: Upgrading at base path /
      # installer: The upgrade was successful.
      $ which teleport
      # /usr/local/bin/teleport
      ```
    </TabItem>

    <TabItem label="From Source">
      ```code
        # Checkout teleport-plugins
        $ git clone https://github.com/gravitational/teleport-plugins.git
        $ cd teleport-plugins/access/mattermost
        $ make
      ```
    </TabItem>
  </Tabs>
 */

// getting dropdown options from an individual TabItem
// we analize all TabItems to gather all available Dropdown options
const getDropdownFromItem = (options: string = ""): string[] => {
  return options.split(",").map((item) => item.trim());
};

const isInDropdown = (options: string, dropdownSelected: string): boolean => {
  return getDropdownFromItem(options).includes(dropdownSelected);
};

// this option is added to unify the code.
// It is needed to display tabs correctly if there is no dropdown
const DEFAULT_DROPDOWN = "$all";

export const Tabs = ({
  children,
  dropdownCaption,
  dropdownSelected,
  dropdownView,
}: TabsProps) => {
  const {
    versions: { latest, current },
  } = useContext(DocsContext);

  const { getSelectedLabel, setSelectedLabel } = useContext(TabContext);

  const getSelectedTab = (tabsMeta: DataTab[]) => {
    const labels = tabsMeta.map((t) => t.label);
    const previousLabel = getSelectedLabel(labels);
    if (previousLabel) {
      return previousLabel;
    }
    const selected = tabsMeta.find((t) => t.isPreSelected);
    return selected ? selected.label : tabsMeta[0].label;
  };

  const getSelectedDropdownOption = (options: Array<string>) => {
    const prevLabel = getSelectedLabel(options);
    return prevLabel ? prevLabel : options[0];
  };

  const childTabs = useMemo(
    () =>
      Children.toArray(children).filter(
        (c) => isValidElement(c) && c.props.label && c.props.children
      ) as React.ReactComponentElement<React.FC<TabItemProps>>[],
    [children]
  );

  const dropdownVarsArr = useMemo(() => {
    const dropdownVars: Set<string> = new Set();

    childTabs.forEach(({ props: { options } }) => {
      if (options) {
        const dropdownFromItem = getDropdownFromItem(options);
        dropdownFromItem.forEach((item) => dropdownVars.add(item));
      }
    });

    return Array.from(dropdownVars).sort().concat(DEFAULT_DROPDOWN);
  }, [childTabs]);

  // making data which tabs to display in which dropdown options
  // and which tabs should be selected in every dropdown
  const tabsInDropdown: TabsInDropdowns = useMemo(() => {
    const data: TabsInDropdowns = {};

    for (const dropOption of dropdownVarsArr) {
      data[dropOption] = [];
      childTabs.forEach(({ props: { label, selected, options } }) => {
        let dataTab: DataTab;
        if (options && dropOption !== DEFAULT_DROPDOWN) {
          if (isInDropdown(options, dropOption)) {
            dataTab = { label, isPreSelected: Boolean(selected) };
          }
        } else {
          dataTab = { label, isPreSelected: Boolean(selected) };
        }
        if (dataTab) {
          data[dropOption].push(dataTab);
        }
      });
    }

    return data;
  }, [childTabs, dropdownVarsArr]);

  const selectedDropdownOption = getSelectedDropdownOption(dropdownVarsArr);
  const tabsMeta = tabsInDropdown[selectedDropdownOption];
  const currentTab = getSelectedTab(tabsMeta);
  const setCurrentTab = (label: string) => {
    setSelectedLabel(
      tabsMeta.map((t) => t.label),
      label
    );
  };

  const setSelectedDropdownOpt = (option: string) => {
    setSelectedLabel(dropdownVarsArr, option);
  };

  /* selectedDropdownOption is needed here.
   * We have to change the selected tab when we change a dropdown option
   * getSelectedTab and setCurrentTab we should not specify in the dependency array
   * because these are constants, they do not change
   **/
  useEffect(() => {
    setCurrentTab(getSelectedTab(tabsMeta));
  }, [tabsMeta, selectedDropdownOption]);

  const visibleTabs = dropdownVarsArr.filter((t) => t !== DEFAULT_DROPDOWN);
  const dropOptions = tabsMeta.map((item) => item.label);

  const labels = dropdownView ? (
    <div className={styles["drop-wrapper"]}>
      <p className={styles["drop-title"]}>
        {dropdownCaption || "Choose one of the options"}
      </p>
      <Dropdown
        className={styles.dropdown}
        value={currentTab}
        options={dropOptions}
        onChange={setCurrentTab}
      />
    </div>
  ) : (
    <TabLabelList
      visibleTabs={visibleTabs}
      tabsMeta={tabsMeta}
      currentTab={currentTab}
      onClick={setCurrentTab}
    />
  );

  return (
    <div className={styles.wrapper}>
      {Boolean(visibleTabs.length) && !dropdownView && (
        <div className={styles["drop-wrapper"]}>
          <p className={styles["drop-title"]}>
            {dropdownCaption || "Choose one of the options"}
          </p>
          <Dropdown
            className={styles.dropdown}
            value={selectedDropdownOption}
            options={visibleTabs}
            onChange={setSelectedDropdownOpt}
          />
        </div>
      )}
      {labels}

      <TabItemList
        childTabs={childTabs}
        currentTab={currentTab}
        latestDocVers={latest}
        currentDocVers={current}
        selectedOption={selectedDropdownOption}
      />
    </div>
  );
};
