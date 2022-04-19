import { style } from "@vanilla-extract/css";
import { vars } from "styles/variables.css";

const {
  color,
  radii,
  spacing,
  timing,
  font: { lineHeight, size },
} = vars;

export const item = style({
  position: "relative",
  paddingLeft: spacing.m4,
  color: color.gray,
  listStyle: "none",
  "::before": {
    content: "•",
    position: "absolute",
    left: 0,
    display: "inline-block",
    width: "24px",
    textAlign: "center",
  },
  selectors: {
    "& + &": {
      marginTop: spacing.m1,
    },
  },
});

export const itemLink = style({
  fontSize: size.md,
  lineHeight: lineHeight.md,
  color: "inherit",
  textDecoration: "none",
  transition: `color ${timing.interaction}`,
  ":hover": {
    color: color.darkPurple,
  },
  ":active": {
    color: color.darkPurple,
  },
  ":focus": {
    color: color.darkPurple,
  },
});

export const wrapper = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  borderRadius: radii.default,
  border: `1px solid ${color.lightGray}`,
  backgroundColor: color.lightestGray,
});

export const header = style({
  display: "flex",
  margin: `0 ${spacing.m2}`,
  padding: `${spacing.m2} 0`,
  borderBottom: `1px solid ${color.lightGray}`,
  color: color.darkGray,
});

export const icon = style({
  flexShrink: 0,
  marginRight: spacing.m1,
});

export const title = style({
  overflow: "hidden",
  flexGrow: 1,
  fontSize: size.xl,
  lineHeight: lineHeight.md,
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

export const button = style({
  width: "88px",
  marginLeft: spacing.m1,
  borderRadius: radii.default,
  border: `1px solid ${color.lightGray}`,
  fontSize: size.xs,
  lineHeight: lineHeight.md,
  color: color.gray,
  textAlign: "center",
  textDecoration: "none",
  whiteSpace: "nowrap",
  flexShrink: 0,
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

export const body = style({
  padding: spacing.m2,
});
