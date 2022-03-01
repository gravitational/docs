import styled from "styled-components";
import css from "@styled-system/css";
import Pre from "components/MDX/Pre";
import Box from "components/Box";

export interface SnippetProps {
  children: React.ReactNode;
}

export default function Snippet({ children }: SnippetProps) {
  return (
    <StyledPre>
      <Box width="max-content" minWidth="100%">
        {children}
      </Box>
    </StyledPre>
  );
}

const StyledPre = styled(Pre)(
  css({
    "& pre": {
      color: "#75715e",
    },
  })
);
