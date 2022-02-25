import styled from "styled-components";

import { all, StyledSystemProps } from "components/system";

export const HeadlessButton = styled("button")<StyledSystemProps>(
  {
    appearance: "none",
    boxSizing: "border-box",
    display: "inline-block",
    minWidth: 0,
    lineHeight: "inherit",
    fontSize: "inherit",
    border: 0,
    padding: 0,
    backgroundColor: "transparent",
  },
  all
);

export default HeadlessButton;
