import cn from "classnames";
import Link from "components/Link";
import { HeaderMeta } from "./types";
import * as styles from "./AnchorNavigation.css";

export interface AnchorNavigationProps {
  className?: string;
  headers: HeaderMeta[];
}

const AnchorNavigation = ({ className, headers }: AnchorNavigationProps) => {
  return (
    <nav className={cn(styles.wrapper, className)}>
      <div className={styles.menu}>
        <div className={styles.header}>Table of Contents</div>
        {headers.map(({ id, title }) => {
          return (
            <Link key={id} href={`#${id}`} className={styles.link}>
              {title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default AnchorNavigation;
