import styled from "styled-components";

import { all, StyledSystemProps } from "components/system";

export interface ImageProps extends StyledSystemProps {
  css?: string;
}

export const Image = styled("img")<ImageProps>(
  {
    maxWidth: "100%",
    minWidth: 0,
    height: "auto",
  },
  all
);

export default Image;
