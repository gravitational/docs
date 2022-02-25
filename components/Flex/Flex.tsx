import { ComponentProps } from "react";
import styled from "styled-components";

import { all, StyledSystemProps } from "components/system";

export const Flex = styled("div")<StyledSystemProps>(
  {
    display: "flex",
    boxSizing: "border-box",
    minWidth: 0,
  },
  all
);

export type FlexProps = ComponentProps<typeof Flex>;

export default Flex;
