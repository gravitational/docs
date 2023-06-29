import Link from "components/Link";
import Image from "next/image";
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
  isImageLink = false,
  imageSrc,
}: MenuItemProps) => {
  return !isImageLink ? (
    <Link href={href} passthrough={passthrough} className={styles.wrapper}>
      <strong className={`${styles.title} ${titleLink && styles.asTitle}`}>
        {title}
      </strong>
    </Link>
  ) : (
    <Link href={href} passthrough={passthrough} className={styles.wrapper}>
      <div className={styles.imageLink}>
        <Image
          src={imageSrc}
          width={280}
          height={139}
          style={{ objectFit: "contain" }}
          alt="featured resource"
        />
        <strong className={styles.title} style={{ paddingLeft: "10px" }}>
          {title}
        </strong>
      </div>
    </Link>
  );
};

export default DropdownMenuItem;
