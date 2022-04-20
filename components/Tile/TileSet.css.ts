import { style } from "@vanilla-extract/css";
import { media, vars } from "styles/variables.css";

const { spacing } = vars;

export const wrapper = style({
  "@media": {
    [media.sm]: {
      display: "block",
    },
    [media.md]: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: spacing.m4,
      paddingBottom: spacing.m4,
    },
  },
});

export const tile = style({
  flex: "0 0 100%",
  display: "flex",
  justifyContent: "stretch",
  alignItems: "stretch",
  "@media": {
    [media.sm]: {
      paddingBottom: spacing.m2,
    },
  },
});
