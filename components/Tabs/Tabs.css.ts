import { style, createVar } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { media, vars } from "styles/variables.css";

const {
  color,
  radii,
  spacing,
  font: { lineHeight, size, weight },
} = vars;

export const wrapper = style({
  marginBottom: spacing.m2,
  borderRadius: radii.default,
  backgroundColor: color.white,
  boxShadow: "0 1px 4px rgba(0 0 0 / 24%)",
  ":last-child": {
    marginBottom: 0,
  },
});

export const header = style({
  display: "flex",
  overflowX: "auto",
  height: "auto",
  borderTopLeftRadius: radii.default,
  borderTopRightRadius: radii.default,
  backgroundColor: color.lightestGray,
});

export const item = style({
  overflowX: "auto",
  "@media": {
    [media.sm]: {
      padding: spacing.m1,
    },
    [media.md]: {
      padding: spacing.m2,
    },
  },
});

export const hidden = style({
  display: "none",
});

export const label = recipe({
  base: {
    flexShrink: 0,
    margin: 0,
    fontSize: size.md,
    fontWeight: weight.bold,
    lineHeight: lineHeight.md,
    whiteSpace: "nowrap",
    borderTopLeftRadius: radii.default,
    borderTopRightRadius: radii.default,
    ":hover": {
      color: color.darkest,
      outline: "none",
    },
    ":active": {
      color: color.darkest,
      outline: "none",
    },
    ":focus": {
      color: color.darkest,
      outline: "none",
    },
    "@media": {
      [media.sm]: {
        padding: `${spacing.m1} ${spacing.m2}`,
      },
      [media.md]: {
        padding: `${spacing.m1} ${spacing.m4}`,
      },
    },
  },
  variants: {
    selected: {
      true: {
        pointerEvents: "none",
        backgroundColor: color.white,
        color: color.darkPurple,
      },
      false: {
        color: color.gray,
        cursor: "pointer",
      },
    },
  },
});
