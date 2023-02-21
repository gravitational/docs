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
}

const DropdownMenuItem = ({
  icon,
  image,
  title,
  description,
  href,
  passthrough = true, // If no value is sent, default to true
}: MenuItemProps) => {
  return (
    <Link href={href} passthrough={passthrough} className={styles.wrapper}>
      {image && (
        <div className={styles["image-wrapper"]}>
          <NextImage
            src={image}
            alt=""
            width="60"
            height="60"
            className={styles.image}
          />
        </div>
      )}
      {icon && <Icon name={icon} className={styles.icon} />}
      <strong className={styles.title}>{title}</strong>
      <span className={styles.description}>{description}</span>
    </Link>
  );
};

export default DropdownMenuItem;
