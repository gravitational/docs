import cn from "classnames";
import Link from "components/Link";
import { HeaderMeta } from "./types";
import styles from "./AnchorNavigation.module.css";

export interface AnchorNavigationProps {
  className?: string;
  headers: HeaderMeta[];
}

const AnchorNavigation = ({ className, headers }: AnchorNavigationProps) => {
  return (
    <nav className={cn(styles.wrapper, className)}>
      <div className={styles.menu}>
        <div className={styles.header}>Table of Contents</div>
        <ul className={styles.ul}>
          {headers.map(({ id, title, rank }) => {
            return rank < 3 ? (
              <li key={id}>
                <Link key={id} href={`#${id}`} className={styles.link}>
                  {title}
                </Link>
              </li>
            ) : (
              <ul className={styles.ulSub} key={id}>
                <li key={id}>
                  <Link key={id} href={`#${id}`} className={styles.link}>
                    {title}
                  </Link>
                </li>
              </ul>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default AnchorNavigation;
