import styles from "./DropdownMenu.module.css";

export interface DropdownMenuProps {
  title: string;
  children: React.ReactNode;
  displayAsRow?: boolean;
}

const DropdownMenu = ({ title, children, displayAsRow }: DropdownMenuProps) => {
  return (
    <div
      className={`${styles.wrapper} ${displayAsRow && styles.asRow}`}
      data-testid="mobile-dropdown"
    >
      {title && <h3 className={styles.menuTitle}>{title}</h3>}
      <div className={`${styles.body} ${displayAsRow && styles.withSubMenus}`}>
        {children}
      </div>
    </div>
  );
};

export default DropdownMenu;
