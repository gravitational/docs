import cn from "classnames";
import { useCallback } from "react";
import HeadlessButton from "components/HeadlessButton";
import Icon from "components/Icon";
import { NavigationCategory } from "./types";
import { DocsNavigationItems } from "./NavigationItems";
import * as styles from "./NavigationCategory.css";

interface DocNavigationCategoryProps extends NavigationCategory {
  id: number;
  opened: boolean;
  onToggleOpened: (value: number) => void;
  onClick: () => void;
}

export const DocNavigationCategory = ({
  id,
  opened,
  onToggleOpened,
  onClick,
  icon,
  title,
  entries,
}: DocNavigationCategoryProps) => {
  const toggleOpened = useCallback(
    () => onToggleOpened(opened ? null : id),
    [id, opened, onToggleOpened]
  );

  return (
    <>
      <HeadlessButton
        className={cn(styles.header, opened && styles.opened)}
        onClick={toggleOpened}
      >
        <Icon name={icon} className={styles.category} />
        <div className={styles.title}>{title}</div>
        <Icon size="sm" name="arrow" className={styles.arrow} />
      </HeadlessButton>
      {opened && (
        <ul className={styles.links}>
          <DocsNavigationItems entries={entries} onClick={onClick} />
        </ul>
      )}
    </>
  );
};
