import { style } from "@vanilla-extract/css";
import { media } from "styles/variables.css";

export const wrapper = style({
  display: "flex",
  marginRight: "10px",
  "@media": {
    [media.sm]: {
      flexDirection: "column",
      width: "100%",
    },
    [media.lg]: {
      flexDirection: "row",
    },
  },
});
