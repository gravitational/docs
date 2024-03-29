import Icon, { IconName } from "../Icon";
import Link from "components/Link";
import styles from "./DropdownMenuCTA.module.css";

export interface MenuCTAItemProps {
  title: string;
  href?: string;
  description?: string;
  children?: MenuCTAItemProps[];
  icon?: IconName;
  passthrough?: boolean;
}

const DropdownMenuItemCTA = ({
  icon,
  title,
  description,
  href,
  passthrough = true, // If no value is sent, default to true
}: MenuCTAItemProps) => {
  return (
    <Link
      href={href}
      passthrough={passthrough}
      className={styles.linkContainer}
    >
      {icon && <Icon name={icon} className={styles.icon} />}
      <strong className={styles.itemTitle}>{title}</strong>
      {description && <span className={styles.description}>{description}</span>}
    </Link>
  );
};

export default DropdownMenuItemCTA;
