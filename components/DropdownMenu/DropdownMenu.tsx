import styles from "./DropdownMenu.module.css";

export interface DropdownMenuProps {
  title: string;
  children: React.ReactNode;
}

const DropdownMenu = ({ title, children }: DropdownMenuProps) => {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.header}>{title}</h3>
      <div className={styles.body}>{children}</div>
    </div>
  );
};

export default DropdownMenu;
