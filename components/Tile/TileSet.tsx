import Tile from "./Tile";
import TileList from "./TileList";
import * as styles from "./TileSet.css";

type TileType = React.ReactElement<typeof Tile>;
type TileListTyle = React.ReactElement<typeof TileList>;

export interface TileWrapperProps {
  children: React.ReactNode;
}

export const TileWrapper = ({ children }: TileWrapperProps) => {
  return <div className={styles.tile}>{children}</div>;
};

export interface TileSetProps {
  children: TileType | TileListTyle | Array<TileType | TileListTyle>;
}

const TileSet = ({ children }: TileSetProps) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default TileSet;
