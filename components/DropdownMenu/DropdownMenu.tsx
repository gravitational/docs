import styles from "./DropdownMenu.module.css";

export interface DropdownMenuProps {
  title: string;
  children: React.ReactNode;
}

const DropdownMenu = ({ title, children }: DropdownMenuProps) => {
  return (
    <div className={styles.wrapper} data-testid="mobile-dropdown">
      <h3 className={styles.header} data-testid="menu-title">
        {title}
      </h3>
      <div className={styles.body}>{children}</div>
    </div>
  );
};

export default DropdownMenu;
