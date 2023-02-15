import styles from "./DropdownMenuCTA.module.css";

export interface DropdownMenuCTAProps {
  title: string;
  children: React.ReactNode;
}

const DropdownMenuCTA = ({ title, children }: DropdownMenuCTAProps) => {
  return (
    <div className={styles.dropdownContainer}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.children}>{children}</div>
    </div>
  );
};

export default DropdownMenuCTA;
