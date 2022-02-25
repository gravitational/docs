import { useRef, useState, useCallback, ReactNode } from "react";
import styled, { keyframes, css as styledCss } from "styled-components";
import css from "@styled-system/css";
import { transition, media } from "components/system";
import Icon from "components/Icon";
import { FlexProps } from "components/Flex";
import HeadlessButton from "components/HeadlessButton";

const TIMEOUT = 1000;

export interface CommandLineProps {
  children: ReactNode;
}

export function CommandLine(props: CommandLineProps) {
  return <StyledCommandLine {...props} />;
}

export interface CommandCommentProps {
  children: ReactNode;
}

export function CommandComment(props: CommandCommentProps) {
  return <StyledCommandComment {...props} />;
}

export interface CommandProps {
  children: ReactNode;
}

export default function Command({
  children,
  ...props
}: CommandProps & FlexProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const codeRef = useRef<HTMLDivElement>();

  const handleCopy = useCallback(() => {
    if (!navigator.clipboard) {
      return;
    }

    if (codeRef.current) {
      navigator.clipboard.writeText(codeRef.current.innerText);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, TIMEOUT);
    }
  }, []);

  return (
    <StyledCommand {...props} ref={codeRef}>
      <StyledHeadlessButton onClick={handleCopy}>
        {isCopied ? (
          <Icon size="sm" name="check" />
        ) : (
          <Icon size="sm" name="copy" />
        )}
      </StyledHeadlessButton>
      {children}
    </StyledCommand>
  );
}

const shiftButton = keyframes`
  0% {
    opacity: 0;
    transform: translateX(3px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const StyledHeadlessButton = styled(HeadlessButton)(
  css({
    display: "none",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    margin: 0,
    px: "6px",
    py: 1,
    color: "light-gray",
    bg: "darkest",
    cursor: "pointer",
    opacity: 0,
    animationDuration: "0.3s",
    animationFillMode: "forwards",
    transition: transition([["color", "interaction"]]),
    transform: "translateX(3px)",
    appearance: "none",

    "&:hover, &:focus, &:active": {
      color: "white",
      outline: "none",
    },
  }),
  styledCss`animation-name: ${shiftButton};`,
  media("sm", {
    display: "none",
    animationName: "none",
    position: "initial",
    transform: "translateX(0)",
    ml: -1,
  })
);

const StyledCommandLine = styled("span")(
  css({
    display: "block",
  })
);

const StyledCommand = styled("div")(
  css({
    boxSizing: "border-box",
    flexDirection: "column",
    position: "relative",
    color: "white",
    bg: "code",
    mx: -3,
    px: 3,
    fontSize: ["text-sm", "text-md"],
    lineHeight: "md",
    transition: transition([["backgroundColor", "interaction"]]),
    [`& ${StyledCommandLine}:first-of-type::before`]: {
      content: "attr(data-content)",
    },
    "&:hover, &:focus": {
      backgroundColor: "darkest",
    },
    [`&:hover ${StyledHeadlessButton}, &:focus ${StyledHeadlessButton}`]: {
      display: "flex",
    },
  })
);

const StyledCommandComment = styled("p")(
  css({
    margin: 0,
    fontSize: "text-md",
    lineHeight: "md",
    "&[data-type='descr']": {
      whiteSpace: "break-spaces",
      wordBreak: "break-word",
    },
  })
);
