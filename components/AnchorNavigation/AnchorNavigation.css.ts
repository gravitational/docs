import { style } from "@vanilla-extract/css";
import { vars } from "styles/variables.css";

const {
  color,
  radii,
  spacing,
  font: { size, weight, lineHeight },
} = vars;

export const wrapper = style({
  flexShrink: 0,
  position: "relative",
});

export const menu = style({
  boxSizing: "border-box",
  width: "240px",
  padding: spacing.m3,
  position: "sticky",
  top: 0,
  maxHeight: "100vh",
  overflow: "auto",
});

export const header = style({
  fontSize: size.sm,
  lineHeight: lineHeight.md,
  maxHeight: "100%",
  overflowY: "auto",
  margin: `0 ${spacing.m0_5} ${spacing.m0_5}`,
  padding: `${spacing.m0_5} 0`,
  fontWeight: weight.bold,
  color: color.darkest,
  borderBottom: `1px solid ${color.lightestGray}`,
});

export const link = style({
  display: "block",
  fontSize: size.sm,
  lineHeight: lineHeight.sm,
  color: color.darkGray,
  padding: spacing.m0_5,
  textDecoration: "none",
  maxWidth: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  borderRadius: radii.default,
  ":focus": {
    backgroundColor: color.lightestGray,
  },
  ":hover": {
    backgroundColor: color.lightestGray,
  },
  ":active": {
    backgroundColor: color.lightestGray,
  },
});
