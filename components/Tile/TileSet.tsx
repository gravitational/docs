import styled from "styled-components";
import css from "@styled-system/css";
import Flex from "components/Flex";
import Tile from "./Tile";
import TileList from "./TileList";

type TileType = React.ReactElement<typeof Tile>;
type TileListTyle = React.ReactElement<typeof TileList>;

export interface TileWrapperProps {
  children: React.ReactNode;
}

export const TileWrapper = ({ children }: TileWrapperProps) => {
  return <StyledWrapper>{children}</StyledWrapper>;
};

export const StyledWrapper = styled(Flex)(
  css({
    flex: "0 0 100%",
    justifyContent: "stretch",
    alignItems: "stretch",
    maxWidth: ["100%", "calc((100% - 64px) / 3)"],
    pb: [3, 5],
  })
);
export interface TileSetProps {
  children: TileType | TileListTyle | Array<TileType | TileListTyle>;
}

const TileSet = ({ children }: TileSetProps) => {
  return (
    <Flex
      flexWrap="wrap"
      alignItems="stretch"
      css={css({
        [`& ${StyledWrapper}`]: {
          ml: [0, 5],
          "&:nth-child(3n+1)": {
            ml: [0, 0],
          },
        },
      })}
    >
      {children}
    </Flex>
  );
};

export default TileSet;
