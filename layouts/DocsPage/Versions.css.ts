import { style } from "@vanilla-extract/css";
import { media } from "styles/variables.css";

export const wrapper = style({
  "@media": {
    [media.sm]: {
      width: "auto",
    },
    [media.md]: {
      width: "110px",
    },
  },
});
