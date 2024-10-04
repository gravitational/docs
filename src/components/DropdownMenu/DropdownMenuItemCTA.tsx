import Icon, { IconName } from "../Icon";
import Link from "../Link";

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
}: MenuCTAItemProps) => {
  return (
    <Link href={href} className={styles.linkContainer}>
      {icon && <Icon name={icon} className={styles.icon} />}
      <strong className={styles.itemTitle}>{title}</strong>
      {description && <span className={styles.description}>{description}</span>}
    </Link>
  );
};

export default DropdownMenuItemCTA;
