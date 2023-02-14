import styles from "./DropdownMenu.module.css";

export interface DropdownMenuProps {
  title: string;
  children: React.ReactNode;
  displayAsRow?: boolean;
}

const DropdownMenu = ({ title, children, displayAsRow }: DropdownMenuProps) => {
  return (
    <div className={styles.wrapper} data-testid="mobile-dropdown">
      <div className={styles.body}>{children}</div>
    </div>
  );
};

export default DropdownMenu;
