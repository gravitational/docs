import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { media, vars } from "styles/variables.css";

const {
  color,
  spacing,
  timing,
  font: { lineHeight, size },
} = vars;

export const wrapper = style({
  display: "flex",
  alignItems: "stretch",
  flexDirection: "row",
  "@media": {
    [media.sm]: {
      flexDirection: "column",
      paddingTop: spacing.m6,
    },
    [media.md]: {
      paddingTop: spacing.m10,
    },
  },
});

export const navigation = style({
  flexShrink: 0,
});

export const body = style({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
});

export const notice = style({
  marginBottom: spacing.m3,
});

export const video = style({
  marginBottom: spacing.m0_5,
  boxShadow: "0 1px 4px rgba(0 0 0 / 24%)",
  transition: `box-shadow ${timing.interaction}`,
});

export const anchorNavigation = style({
  display: "none",
  "@media": {
    [media.lg]: {
      display: "block",
    },
  },
});

export const footer = style({
  marginBottom: spacing.m2,
  padding: `0 ${spacing.m2}`,
  textAlign: "center",
  fontSize: size.lg,
  lineHeight: lineHeight.md,
  color: color.gray,
  "@media": {
    [media.md]: {
      fontSize: size.xl,
      lineHeight: lineHeight.xl,
    },
  },
});

export const mainWrapper = recipe({
  base: {
    display: "flex",
  },
  variants: {
    section: {
      true: {
        backgroundColor: color.pageBG,
      },
      false: {
        backgroundColor: color.white,
      },
    },
  },
});

export const main = style({
  minWidth: 0,
  flexGrow: 1,
  padding: spacing.m2,
  "@media": {
    [media.md]: {
      padding: `${spacing.m3} ${spacing.m5}`,
    },
  },
});

export const text = recipe({
  base: {
    color: color.text,
    lineHeight: "26px",
  },
  variants: {
    layout: {
      doc: {
        maxWidth: "900px",
      },
      "tocless-doc": {
        maxWidth: "1164px",
      },
      section: {
        maxWidth: "auto",
      },
    },
  },
});
