import { style } from "@vanilla-extract/css";
import { media, vars } from "styles/variables.css";

const { spacing } = vars;

export const wrapper = style({
  "@media": {
    [media.sm]: {
      width: "auto",
    },
    [media.md]: {
      width: "150px",
    },
  },
});

export const item = style({
  display: "flex",
  alignItems: "center",
});

export const icon = style({
  width: "20px",
  height: "20px",
  margin: `-2px ${spacing.m1} 0 0`,
  opacity: 0.56,
  "@media": {
    [media.sm]: {
      display: "none",
    },
  },
});
