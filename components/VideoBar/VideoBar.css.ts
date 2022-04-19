import { style } from "@vanilla-extract/css";
import { media, vars } from "styles/variables.css";

const {
  color,
  spacing,
  font: { lineHeight, size, weight },
} = vars;

export const wrapper = style({
  display: "flex",
  boxSizing: "border-box",
  justifyContent: "space-between",
  width: "100%",
  height: "auto",
  fontSize: size.md,
  fontWeight: weight.bold,
  textDecoration: "none",
  color: color.darkest,
  ":hover": {
    color: color.lightPurple,
  },
  "@media": {
    [media.sm]: {
      padding: `${spacing.m1} ${spacing.m2} ${spacing.m1} ${spacing.m0_5}`,
    },
    [media.md]: {
      padding: `${spacing.m2} ${spacing.m6} ${spacing.m2} ${spacing.m4}`,
    },
  },
});

export const image = style({
  position: "relative",
  width: "80px",
  height: "40px",
  flexShrink: 0,
});

export const icon = style({
  position: "absolute",
  top: "50%",
  left: "50%",
  zIndex: 1,
  lineHeight: lineHeight.md,
  color: color.white,
  transform: "translate3d(-50%, -50%, 0)",
  opacity: 0.57,
});

export const info = style({
  display: "flex",
  flexDirection: "row",
  width: "100%",
  justifyContent: "space-between",
  "@media": {
    [media.sm]: {
      marginLeft: spacing.m0_5,
    },
    [media.md]: {
      marginLeft: spacing.m2,
    },
  },
});

export const title = style({
  overflow: "hidden",
  margin: 0,
  textOverflow: "ellipsis",
  fontSize: size.md,
  lineHeight: lineHeight.md,
});

export const duration = style({
  overflow: "hidden",
  margin: 0,
  fontSize: size.sm,
  fontWeight: weight.regular,
  lineHeight: lineHeight.sm,
  color: color.gray,
  textOverflow: "ellipsis",
});

export const button = style({
  display: "flex",
  alignSelf: "center",
  flexShrink: 0,
  width: "100%",
  maxWidth: "180px",
  height: "32px",
  padding: `0 ${spacing.m3}`,
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  "@media": {
    [media.sm]: {
      display: "none",
    },
  },
});
