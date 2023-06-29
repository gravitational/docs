import Link from "components/Link";
import styles from "./DropdownMenuItem.module.css";

export interface MenuItemProps {
  title: string;
  href?: string;
  titleLink?: boolean;
  isImageLink?: boolean;
  imageSrc?: string;
  children?: MenuItemProps[];
  passthrough?: boolean;
}

const DropdownMenuItem = ({
  title,
  href = "/",
  passthrough = true, // If no value is sent, default to true
  titleLink = false,
}: MenuItemProps) => {
  return (
    <Link href={href} passthrough={passthrough} className={styles.wrapper}>
      <strong className={`${styles.title} ${titleLink && styles.asTitle}`}>
        {title}
      </strong>
    </Link>
  );
};

export default DropdownMenuItem;
