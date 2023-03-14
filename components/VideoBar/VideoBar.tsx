import cn from "classnames";
import NextImage from "next/image";
import Icon from "components/Icon";
import Button from "components/Button";
import { VideoBarProps } from "./types";
import styles from "./VideoBar.module.css";

export default function VideoBar({
  thumbnail,
  href,
  title,
  duration,
  className,
}: VideoBarProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(styles.wrapper, className)}
    >
      <div className={styles.image}>
        <Icon name="play" className={styles.icon} />
        <NextImage
          src={thumbnail}
          width={80}
          height={40}
          alt={title}
          className={styles.objectFit}
        />
      </div>
      <div className={styles.info}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {duration && <p className={styles.duration}>Length: {duration}</p>}
        </div>
        <Button className={styles.button}>Watch video</Button>
      </div>
    </a>
  );
}
