import NextImage from "next/image";
import Link from "components/Link";
import { TileWrapper } from "./TileSet";
import styles from "./TileImage.module.css";

export interface TileImageProps {
  alt: string;
  buttonLabel: string;
  children: React.ReactNode;
  href: string;
  src: string;
  title: string;
}

const TileImage = ({
  alt = "",
  buttonLabel = "Get Started",
  children,
  href,
  src,
  title,
}: TileImageProps) => {
  return (
    <TileWrapper>
      <div className={styles.wrapper}>
        <Link href={href} className={styles["image-wrapper"]}>
          <NextImage
            src={src}
            alt={alt}
            layout="fill"
            className={styles.image}
          />
        </Link>
        <div className={styles.body}>
          <h3 className={styles.title}>
            <Link href={href} className={styles["title-link"]}>
              {title}
            </Link>
          </h3>
          <div className={styles.description}>{children}</div>
          <Link href={href} className={styles.button}>
            {buttonLabel}
          </Link>
        </div>
      </div>
    </TileWrapper>
  );
};

export default TileImage;
