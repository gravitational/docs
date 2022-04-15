import { style } from "@vanilla-extract/css";
import { vars, media } from "styles/variables.css";

const {
  color,
  radii,
  spacing,
  timing,
  font: { lineHeight, size, weight },
} = vars;

export const opened = style({});

export const hidden = style({
  display: "none",
});

export const wrapper = style({
  marginBottom: spacing.m2,
  borderRadius: radii.default,
  backgroundColor: color.white,
  ":last-child": {
    marginBottom: 0,
  },
  selectors: {
    [`&${opened}`]: {
      boxShadow: "0 1px 4px rgba(0 0 0 / 24%)",
    },
  },
});

export const header = style({
  display: "flex",
  width: "100%",
  alignItems: "center",
  padding: `${spacing.m1} 0`,
  borderTopLeftRadius: radii.default,
  borderTopRightRadius: radii.default,
  textAlign: "left",
  fontSize: size.md,
  fontWeight: weight.bold,
  lineHeight: lineHeight.sm,
  color: color.darkest,
  cursor: "pointer",
  transition: `background-color ${timing.interaction}`,
  ":hover": {
    color: color.lightPurple,
    outline: "none",
  },
  ":active": {
    color: color.lightPurple,
    outline: "none",
  },
  ":focus": {
    color: color.lightPurple,
    outline: "none",
  },
  selectors: {
    [`${wrapper}${opened} &`]: {
      backgroundColor: color.lightestGray,
    },
  },
});

export const icon = style({
  flexShrink: 0,
  margin: `0 ${spacing.m1}`,
  transition: `transform ${timing.fast}`,
  transform: `rotate(0deg)`,
  "@media": {
    [media.sm]: {
      width: `24px`,
      height: `24px`,
    },
    [media.md]: {
      width: "16px",
      height: "16px",
    },
  },
  selectors: {
    [`${wrapper}${opened} &`]: {
      transform: `rotate(180deg)`,
    },
  },
});

export const description = style({
  display: "flex",
  "@media": {
    [media.sm]: {
      flexDirection: "column",
    },
    [media.md]: {
      flexDirection: "row",
    },
  },
});

export const title = style({
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

export const meta = style({
  display: "flex",
  flexShrink: 0,
  alignItems: "center",
  marginRight: spacing.m1,
  "@media": {
    [media.sm]: {
      marginTop: spacing.m0_5,
    },
    [media.md]: {
      marginLeft: spacing.m1,
    },
  },
});

export const scopes = style({
  display: "flex",
});

export const min = style({
  fontWeight: weight.regular,
  fontSize: size.xs,
  lineHeight: "20px",
  color: color.gray,
});

export const body = style({
  display: "none",
  overflowX: "auto",
  "@media": {
    [media.sm]: {
      padding: spacing.m1,
    },
    [media.md]: {
      padding: spacing.m2,
    },
  },
  selectors: {
    [`${wrapper}${opened} &`]: {
      display: "block",
    },
  },
});

export const scope = style({
  marginRight: spacing.m1,
  padding: `0 ${spacing.m1}`,
  borderRadius: radii.sm,
  fontSize: size.sm,
  lineHeight: `20px`,
  textTransform: "uppercase",
  color: color.gray,
  backgroundColor: color.lightestGray,
  selectors: {
    [`${wrapper}${opened} &`]: {
      color: color.white,
      backgroundColor: color.darkPurple,
    },
  },
});
