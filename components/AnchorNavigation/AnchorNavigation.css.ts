import { style } from "@vanilla-extract/css";
import { vars, media } from "styles/variables.css";

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
  fontSize: size["text-sm"],
  lineHeight: lineHeight.md,
  maxHeight: "100%",
  overflowY: "auto",
  margin: `0 ${spacing["m0.5"]} ${spacing["m0.5"]}`,
  padding: `${spacing["m0.5"]} 0`,
  fontWeight: weight.bold,
  color: color.darkest,
  borderBottom: `1px solid ${color["lightest-gray"]}`,
});

export const link = style({
  display: "block",
  fontSize: size["text-sm"],
  lineHeight: lineHeight.sm,
  color: color["dark-gray"],
  padding: spacing["m0.5"],
  textDecoration: "none",
  maxWidth: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  borderRadius: radii.default,
  ":focus": {
    backgroundColor: color["lightest-gray"],
  },
  ":hover": {
    backgroundColor: color["lightest-gray"],
  },
  ":active": {
    backgroundColor: color["lightest-gray"],
  },
});
