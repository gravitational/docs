import DropdownMenuItem from "./DropdownMenuItem";
import styles from "./DropdownSubMenu.module.css";

export interface DropdownMenuProps {
  title: string;
  children: React.ReactNode;
  titleLink?: boolean;
  href?: string;
}

const DropdownSubMenu = ({
  title,
  children,
  titleLink = false,
  href = "/",
}: DropdownMenuProps) => {
  return (
    <div className={styles.subMenuWrapper}>
      {title && titleLink ? (
        <DropdownMenuItem href={href} title={title} titleLink={true} />
      ) : (
        title && <h3 className={styles.title}>{title}</h3>
      )}
      <div className={styles.children}>{children}</div>
    </div>
  );
};

export default DropdownSubMenu;
