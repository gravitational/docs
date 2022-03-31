import Link from "components/Link";
import Icon, { IconName } from "components/Icon";
import { TileWrapper } from "./TileSet";
import styles from "./TileList.module.css";

export interface TileListItemProps {
  href: string;
  children: React.ReactNode;
}

export const TileListItem = ({ href, children }: TileListItemProps) => {
  return (
    <li className={styles.item}>
      <Link href={href} className={styles["item-link"]}>
        {children}
      </Link>
    </li>
  );
};

export interface TileListProps {
  title: string;
  icon: IconName;
  href?: string;
  children:
    | React.ReactElement<typeof TileListItem>
    | Array<React.ReactElement<typeof TileListItem>>;
}

const TileList = ({ title, icon, href, children }: TileListProps) => {
  return (
    <TileWrapper>
      <div className={styles.wrapper}>
        <h3 className={styles.header}>
          <Icon name={icon} size="md" className={styles.icon} />
          <div className={styles.title} title={title}>
            {title}
          </div>
          {href && (
            <Link href={href} className={styles.button}>
              VIEW ALL
            </Link>
          )}
        </h3>
        <ul className={styles.body}>{children}</ul>
      </div>
    </TileWrapper>
  );
};

export default TileList;
