import Icon, { IconName } from "components/Icon";
import Link from "components/Link";
import { TileWrapper } from "./TileSet";
import styles from "./Tile.module.css";

export interface TileProps {
  children: React.ReactNode;
  href: string;
  icon: IconName;
  title: string;
}

const Tile = ({ children, href, icon, title }: TileProps) => {
  return (
    <TileWrapper>
      <Link className={styles.wrapper} href={href}>
        <h3 className={styles.header}>
          <Icon name={icon} size="lg" className={styles.icon} />
          <div className={styles.title}>{title}</div>
        </h3>
        <div className={styles.body}>{children}</div>
      </Link>
    </TileWrapper>
  );
};

export default Tile;
