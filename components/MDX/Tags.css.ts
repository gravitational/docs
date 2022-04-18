import { style } from "@vanilla-extract/css";
import { media, vars } from "styles/variables.css";

const {
  color,
  radii,
  spacing,
  font: { lineHeight, size, weight },
} = vars;

export const p = style({
  margin: `0 0 ${spacing.m2}`,
  fontSize: size.lg,
  ":last-child": {
    marginBottom: 0,
  },
});

export const ul = style({
  margin: `0 0 ${spacing.m2}`,
  paddingLeft: spacing.m3,
  ":last-child": {
    marginBottom: 0,
  },
});

export const ol = style({
  margin: `0 0 ${spacing.m2}`,
  paddingLeft: spacing.m3,
  ":last-child": {
    marginBottom: 0,
  },
});

export const li = style({
  margin: `0 0 ${spacing.m1}`,
  fontSize: size.lg,
  ":last-child": {
    marginBottom: 0,
  },
});

export const table = style({
  marginBottom: spacing.m3,
  backgroundColor: color.white,
  boxShadow: "0 1px 4px rgba(0 0 0 / 24%)",
  borderRadius: radii.default,
  borderCollapse: "collapse",
  boxSizing: "border-box",
  width: "100%",
  overflow: "auto",
  ":last-child": {
    marginBottom: 0,
  },
  "@media": {
    [media.sm]: {
      display: "block",
      whiteSpace: "nowrap",
    },
  },
});

export const thead = style({
  borderBottom: "1px solid #d2dbdf",
});

export const tr = style({
  ":last-child": {
    borderBottomLeftRadius: radii.default,
    borderBottomRightRadius: radii.default,
  },
  selectors: {
    "&:nth-child(even)": {
      backgroundColor: color.lightestGray,
    },
  },
});

export const th = style({
  padding: `${spacing.m1} ${spacing.m2}`,
  fontWeight: weight.bold,
  textAlign: "left",
  "@media": {
    [media.sm]: {
      fontSize: size.md,
    },
    [media.md]: {
      fontSize: size.lg,
    },
  },
});

export const td = style({
  lineHeight: lineHeight.md,
  padding: spacing.m2,
  "@media": {
    [media.sm]: {
      fontSize: size.md,
    },
    [media.md]: {
      fontSize: size.lg,
    },
  },
});

export const video = style({
  maxWidth: "100%",
  margin: `0 0 ${spacing.m2}`,
  ":last-child": {
    marginBottom: 0,
  },
});
