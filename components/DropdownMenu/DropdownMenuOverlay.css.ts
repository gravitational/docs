import { style } from "@vanilla-extract/css";
import { media } from "styles/variables.css";

export const wrapper = style({
  position: "fixed",
  top: "80px",
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 1000,
  background: "blur(60px)",
  "@media": {
    [media.sm]: {
      display: "none",
    },
  },
});
