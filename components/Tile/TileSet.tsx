import TileList from "./TileList";
import styles from "./TileSet.module.css";

type TileListTyle = React.ReactElement<typeof TileList>;

export interface TileWrapperProps {
  children: React.ReactNode;
}

export const TileWrapper = ({ children }: TileWrapperProps) => {
  return <div className={styles.tile}>{children}</div>;
};

export interface TileSetProps {
  children: TileListTyle | Array<TileListTyle>;
}

const TileSet = ({ children }: TileSetProps) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default TileSet;
