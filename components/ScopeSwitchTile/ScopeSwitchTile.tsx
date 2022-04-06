import { DocsContext } from "layouts/DocsPage/context";
import { ScopeType } from "layouts/DocsPage/types";
import { useContext } from "react";
import wrapperstyles from "components/Tile/TileSet.module.css";
import Link from "components/Link";
import Icon, { IconName } from "components/Icon";
import tilestyles from "components/Tile/Tile.module.css";

export interface ScopeSwitchTileProps {
  children;
  icon: IconName;
  title: string;
  scope: ScopeType;
}

const ScopeSwitchTile = ({
  scope,
  children,
  icon,
  title,
}: ScopeSwitchTileProps) => {
  const { setScope } = useContext(DocsContext);
  return (
    <div
      className={wrapperstyles.tile}
      onClick={(e) => {
        e.preventDefault();
        setScope(scope);
      }}
    >
      <Link className={tilestyles.wrapper} href="#">
        <h3 className={tilestyles.header}>
          <Icon name={icon} size="lg" className={tilestyles.icon} />
          <div className={tilestyles.title}>{title}</div>
        </h3>
        <div className={tilestyles.body}>{children}</div>
      </Link>
    </div>
  );
};

export default ScopeSwitchTile;
