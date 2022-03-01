import styled from "styled-components";

import { all, css } from "components/system";
import Link from "components/Link";

export interface ForkRibbonProps {
  backgroundColor?: string;
  repoLink: string;
  text?: string;
}

interface RibbonContainerProps {
  backgroundColor?: string;
}

export const ForkRibbon = ({
  backgroundColor = "black",
  repoLink = "https://github.com/gravitational/teleport",
  text = "Fork Me on GitHub",
}: ForkRibbonProps) => {
  return (
    <StyledOutermostContainer>
      <StyledOuterContainer>
        <RibbonContainer backgroundColor={backgroundColor || "black"}>
          <StyledLink href={repoLink} passHref={true}>
            {text}
          </StyledLink>
        </RibbonContainer>
      </StyledOuterContainer>
    </StyledOutermostContainer>
  );
};

const StyledOuterContainer = styled("div")(
  css({
    height: "130px",
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 0,
    width: "130px",
  })
);

const StyledOutermostContainer = styled("div")(
  css({
    height: 0,
    position: "relative",
    right: 0,
    width: [0, "100%"],
  })
);

const RibbonContainer = styled("div")<RibbonContainerProps>(
  css({
    border: "1px solid white",
    boxShadow: "2px 2px 8px rgba(50, 50, 50, 0.75)",
    color: "white",
    cursor: "pointer",
    height: "32px",
    transform: "translate(30px, -30px) rotate(45deg)",
    transformOrigin: "top left",
    width: [0, "184px"],
  }),
  all
);

const StyledLink = styled(Link)(
  css({
    color: "white",
    textDecoration: "none",
    display: "block",
    fontSize: "text-sm",
    fontWeight: "bold",
    lineHeight: "lg",
    margin: 0,
    padding: 0,
    textAlign: "center",
  })
);

export default ForkRibbon;
