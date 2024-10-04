import { clsx } from "clsx";
import Icon from "../Icon";
import Button from "../Button";
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
      className={clsx(styles.wrapper, className)}
    >
      <div className={styles.image}>
        <Icon name="play" className={styles.icon} />
        <img
          src={thumbnail}
          width={80}
          height={40}
          alt={title}
          className={styles.objectFit}
        />
      </div>
      <div className={styles.info}>
        <div>
          <div className={styles.title}>{title}</div>
          {duration && <p className={styles.duration}>Length: {duration}</p>}
        </div>
        <Button className={styles.button} as="button">
          Watch video
        </Button>
      </div>
    </a>
  );
}
