import { style } from "@vanilla-extract/css";
import { vars } from "styles/variables.css";

const {
  color,
  radii,
  spacing,
  timing,
  font: { lineHeight, size, weight },
} = vars;

export const wrapper = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  borderRadius: radii.default,
  backgroundColor: color.white,
  boxShadow: "0 1px 4px rgba(0 0 0 / 24%)",
});

export const imageWrapper = style({
  transition: `opacity ${timing.interaction}`,
  ":hover": {
    opacity: 0.9,
  },
  ":active": {
    opacity: 0.9,
  },
  ":focus": {
    opacity: 0.9,
  },
});

export const image = style({
  width: "100%",
  borderTopLeftRadius: radii.default,
  borderTopRightRadius: radii.default,
});

export const body = style({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  alignItems: "flex-start",
  padding: `${spacing.m2} ${spacing.m3} ${spacing.m3}`,
});

export const title = style({
  marginBottom: spacing.m1,
  fontSize: size.xl,
  fontWeight: weight.regular,
  lineHeight: lineHeight.md,
});

export const titleLink = style({
  color: color.darkPurple,
  textDecoration: "none",
  transition: `color ${timing.interaction}`,
  ":hover": {
    color: color.lightPurple,
  },
  ":active": {
    color: color.lightPurple,
  },
  ":focus": {
    color: color.lightPurple,
  },
});

export const description = style({
  flexGrow: 1,
  fontSize: size.md,
  color: color.darkest,
  lineHeight: lineHeight.md,
});

export const button = style({
  marginTop: spacing.m2,
  padding: `0 ${spacing.m3}`,
  borderRadius: radii.default,
  border: `1px solid ${color.lightGray}`,
  color: color.gray,
  fontSize: size.sm,
  lineHeight: lineHeight.md,
  textTransform: "uppercase",
  textDecoration: "none",
  transition: `border-color ${timing.interaction}, color ${timing.interaction}`,
  ":hover": {
    color: color.darkPurple,
    borderColor: color.darkPurple,
  },
  ":active": {
    color: color.darkPurple,
    borderColor: color.darkPurple,
  },
  ":focus": {
    color: color.darkPurple,
    borderColor: color.darkPurple,
  },
});
