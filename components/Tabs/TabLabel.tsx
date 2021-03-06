import cn from "classnames";
import HeadlessButton from "components/HeadlessButton";
import { TabsLabel, TabLabelsListProps } from "./types";
import styles from "./TabLabel.module.css";

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

export const TabLabelList = ({
  visibleTabs,
  tabsMeta,
  currentTab,
  onClick,
}: TabLabelsListProps) => {
  return (
    <ul
      className={cn(styles.header, {
        [styles["header-shadow"]]: visibleTabs.length,
      })}
    >
      {tabsMeta.map(({ label }) => (
        <li key={label}>
          <TabLabel
            key={label}
            label={label}
            onClick={onClick}
            selected={label === currentTab}
          />
        </li>
      ))}
    </ul>
  );
};
