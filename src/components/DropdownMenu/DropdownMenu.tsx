import styles from "./DropdownMenu.module.css";

export interface DropdownMenuProps {
  children: React.ReactNode;
}

const DropdownMenu = ({ children }: DropdownMenuProps) => {
  return (
    <div className={styles.wrapper} data-testid="mobile-dropdown">
      <div className={styles.body}>{children}</div>
    </div>
  );
};

export default DropdownMenu;
