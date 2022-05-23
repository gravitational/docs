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

/**
 * An example of using this component.
 * 
 * - If at least one TabsItem has an inDropdown prop,
 * then TabsItems without an inDropdown prop will be displayed in all Dropdown options.
 * 
 * <Tabs dropdownCaption="Installing Teleport" dropdownSelected="gatsby">
    <TabItem label="Download" inDropdown="gatsby, js">
      [Download MacOS .pkg installer](https://goteleport.com/teleport/download?os=mac) (tsh client only, signed) file, double-click to run the Installer.
    </TabItem>

    <TabItem label="Homebrew" inDropdown="js, kotlin, python" selected>
      ```code
      $ brew install teleport
      ```
    </TabItem>

    <TabItem label="Terminal" inDropdown="gatsby, python, java">
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

    <TabItem scope={["oss", "enterprise"]} label="From Source">
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

// this option is added to unify the code.
// It is needed to display tabs correctly if there is no dropdown
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

  // making data which tabs to display in which dropdown options
  // and which tabs should be selected in every dropdown
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
