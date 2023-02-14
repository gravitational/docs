import NextImage from "next/image";
import Link from "components/Link";
import Icon, { IconName } from "components/Icon";
import styles from "./DropdownMenuItem.module.css";

export interface MenuItemProps {
  title: string;
  description: string;
  href: string;
  icon?: IconName;
  image?: string;
  passthrough?: boolean;
  titleLink?: boolean;
  children?: MenuItemProps[];
}

const DropdownMenuItem = ({
  title,
  href,
  passthrough = true, // If no value is sent, default to true
}: MenuItemProps) => {
  return (
    <Link href={href} passthrough={passthrough} className={styles.wrapper}>
      <strong className={styles.title}>{title}</strong>
    </Link>
  );
};

export default DropdownMenuItem;
