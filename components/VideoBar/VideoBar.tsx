import styled from "styled-components";
import css from "@styled-system/css";
import { transition } from "components/system";
import NextImage from "next/image";
import Icon from "components/Icon";
import Flex, { FlexProps } from "components/Flex";
import Button from "components/Button";
import { VideoBarProps } from "./types";

export default function VideoBar({
  thumbnail,
  href,
  title,
  duration,
  ...props
}: VideoBarProps & FlexProps) {
  return (
    <StyledVideoBar
      as="a"
      variant="secondary"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      <StyledImageWrapper>
        <StyledIcon name="play" />
        <NextImage
          src={thumbnail}
          width={80}
          height={40}
          alt={title}
          objectFit="contain"
        />
      </StyledImageWrapper>
      <StyledWrapper>
        <Flex flexDirection="column">
          <StyledVideoName>{title}</StyledVideoName>
          {duration && <StyledDuration>Length: {duration}</StyledDuration>}
        </Flex>
        <StyledWatchButton>Watch video</StyledWatchButton>
      </StyledWrapper>
    </StyledVideoBar>
  );
}

const StyledVideoBar = styled(Button)(
  css({
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    height: "auto",
    fontSize: "text-md",
    fontWeight: "bold",
    color: "darkest",
    border: "none",
    borderRadius: "0",
    cursor: "pointer",
    pr: [3, 7],
    pl: [1, 5],
    py: [2, 3],
    transition: transition([["boxShadow", "interaction"]]),
  })
);

const StyledImageWrapper = styled("div")(
  css({
    width: "80px",
    height: "40px",
    position: "relative",
    flexShrink: 0,
  })
);

const StyledIcon = styled(Icon)(
  css({
    position: "absolute",
    zIndex: 1,
    top: "50%",
    left: "50%",
    lineHeight: "md",
    color: "white",
    transform: "translate3d(-50%, -50%, 0)",
    opacity: 0.57,
  })
);

const StyledWrapper = styled(Flex)(
  css({
    flexDirection: "row",
    width: "100%",
    ml: [1, 3],
    justifyContent: "space-between",
  })
);

const StyledVideoName = styled("h2")(
  css({
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "text-md",
    lineHeight: "md",
    my: 0,
  })
);

const StyledDuration = styled("p")(
  css({
    fontSize: "text-sm",
    lineHeight: "sm",
    fontWeight: "regular",
    overflow: "hidden",
    textOverflow: "ellipsis",
    my: 0,
    color: "gray",
  })
);

const StyledWatchButton = styled(Button)(
  css({
    display: ["none", "flex"],
    alignSelf: "center",
    flexShrink: 0,
    maxWidth: ["100px", "180px"],
    width: "100%",
    height: ["100%", "32px"],
    mt: 0,
    py: [1, 0],
    px: [2, 4],
    textTransform: "uppercase",
    whiteSpace: ["normal", "nowrap"],
  })
);
