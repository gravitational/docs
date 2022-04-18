import { style } from "@vanilla-extract/css";
import { media, vars } from "styles/variables.css";

const { spacing } = vars;

export const wrapper = style({
  ":last-child": {
    marginBottom: 0,
  },
  "@media": {
    [media.sm]: {
      marginBottom: spacing.m1,
    },
    [media.md]: {
      marginBottom: spacing.m1_5,
    },
  },
});

export const shaper = style({
  position: "relative",
  width: "100%",
});

export const video = style({
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: "100%",
  height: "100%",
});
