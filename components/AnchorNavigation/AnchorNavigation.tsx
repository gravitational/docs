import cn from "classnames";
import Link from "components/Link";
import { HeaderMeta } from "./types";
import { wrapper, menu, header, link } from "./AnchorNavigation.css";

export interface AnchorNavigationProps {
  className?: string;
  headers: HeaderMeta[];
}

const AnchorNavigation = ({ className, headers }: AnchorNavigationProps) => {
  return (
    <nav className={cn(wrapper, className)}>
      <div className={menu}>
        <div className={header}>Table of Contents</div>
        {headers.map(({ id, title }) => {
          return (
            <Link key={id} href={`#${id}`} className={link}>
              {title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default AnchorNavigation;
