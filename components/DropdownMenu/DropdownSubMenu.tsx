import DropdownMenuItem from "./DropdownMenuItem";
import styles from "./DropdownSubMenu.module.css";

export interface DropdownMenuProps {
  title: string;
  children: React.ReactNode;
  titleLink?: boolean;
  href?: string;
  isImageLink?: boolean;
  childLength?: number;
}

const DropdownSubMenu = ({
  title,
  children,
  titleLink = false,
  href = "/",
  isImageLink = false,
  childLength = 3,
}: DropdownMenuProps) => {
  return (
    <div
      className={`${styles.subMenuWrapper} ${
        childLength > 3 && styles.moreItems
      }`}
    >
      {title && titleLink ? (
        <DropdownMenuItem href={href} title={title} titleLink={true} />
      ) : (
        !isImageLink && title && <h3 className={styles.title}>{title}</h3>
      )}
      <div className={styles.children}>{children}</div>
    </div>
  );
};

export default DropdownSubMenu;
