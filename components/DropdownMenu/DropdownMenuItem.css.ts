import { style } from "@vanilla-extract/css";
import { vars, media } from "styles/variables.css";

const {
  color,
  radii,
  spacing,
  timing,
  font: { lineHeight, size, weight },
} = vars;

export const wrapper = style({
  display: "block",
  overflow: "hidden",
  padding: `${spacing.m1} ${spacing.m2}`,
  borderRadius: radii.sm,
  transition: `background ${timing.interaction}`,
  lineHeight: lineHeight.md,
  textAlign: "left",
  textDecoration: "none",
  "@media": {
    [media.sm]: {
      border: `1px solid ${color.lightestGray}`,
    },
  },
  ":focus": {
    backgroundColor: color.lightestGray,
  },
  ":hover": {
    backgroundColor: color.lightestGray,
  },
  selectors: {
    "& + &": {
      marginTop: spacing.m1,
    },
  },
});

export const imageWrapper = style({
  float: "left",
  border: "10px solid transparent",
});

export const image = style({
  "@media": {
    [media.sm]: {
      marginTop: spacing.m1,
    },
    [media.md]: {
      marginRight: spacing.m1,
    },
  },
});

export const icon = style({
  float: "left",
  margin: `${spacing.m0_5} ${spacing.m1} 0 0`,
  color: color.darkPurple,
});

export const title = style({
  display: "block",
  fontSize: size.lg,
  fontWeight: weight.bold,
  lineHeight: lineHeight.lg,
  color: color.darkPurple,
});

export const description = style({
  display: "block",
  fontSize: size.md,
  lineHeight: lineHeight.md,
  color: color.darkest,
});
