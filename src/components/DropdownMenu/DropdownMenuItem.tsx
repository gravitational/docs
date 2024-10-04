import { clsx } from "clsx";

import Link from "../Link";

import styles from "./DropdownMenuItem.module.css";

export interface MenuItemProps {
  itemType: string | "normal" | "image";
  icon?: string | null;
  title?: string | null;
  description?: string | null;
  link: string | null;
  imageItem?: {
    imageTitle?: string | null;
    useMetadata: boolean | null;
    customImage?: {
      itemImage: string;
      itemTitle: string;
      imageCTA?: string;
      imageDate?: string;
    } | null;
  };
  children?: MenuItemProps[];
}

const DropdownMenuItem = ({
  itemType,
  title,
  link = "",
  icon,
  description,
  imageItem,
  itemAmount,
  ...props
}: MenuItemProps & { itemAmount?: number }) => {
  const { imageTitle, customImage } = imageItem || {};
  return itemType !== "image" ? (
    <Link
      className={clsx(styles.styledLink, !description && styles.center)}
      href={link}
    >
      <img src={icon || ""} width={35} height={35} alt="" />
      <div className={styles.item}>
        <p className={styles.itemTitle}>{title}</p>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </Link>
  ) : (
    <div className={styles.wrapper}>
      {imageTitle && <h3 className={styles.imageTitle}>{imageTitle}</h3>}
      <Link className={styles.styledLink} href={link}>
        <div className={styles.imageItem}>
          <div className={styles.imageBox}>
            <img
              src={customImage?.itemImage || ""}
              width={180}
              height={100}
              sizes="180px"
              alt=""
            />
          </div>
          <div className={clsx(styles.item, styles.imageItemText)} {...props}>
            <p className={styles.imageItemTitle}>{customImage?.itemTitle}</p>
            {customImage?.imageDate && (
              <p className={styles.dateText}>{customImage?.imageDate}</p>
            )}
            <p className={styles.paragraph}>{customImage?.imageCTA}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DropdownMenuItem;
