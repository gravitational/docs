import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { media, vars } from "styles/variables.css";

const { color, spacing } = vars;

export const wrapper = recipe({
  base: {
    position: "relative",
    zIndex: 1000,
    "@media": {
      [media.sm]: {
        height: "48px",
      },
      [media.md]: {
        width: "240px",
      },
    },
  },
  variants: {
    section: {
      true: {
        "@media": {
          [media.md]: {
            boxShadow: "1px 0 4px rgba(0 0 0 / 12%)",
          },
        },
      },
      false: {
        "@media": {
          [media.md]: {
            borderRight: `1px solid ${color.lightestGray}`,
          },
        },
      },
    },
  },
});

export const searchbar = style({
  display: "flex",
  alignItems: "center",
  height: "48px",
  backgroundColor: color.lighterGray,
});

export const menu = style({
  marginRight: spacing.m2,
  color: color.gray,
  ":focus": {
    outline: "none",
  },
  "@media": {
    [media.md]: {
      display: "none",
    },
  },
});

export const nav = recipe({
  base: {
    width: "100%",
    backgroundColor: color.white,
    "@media": {
      [media.sm]: {
        position: "absolute",
        top: "48px",
      },
      [media.md]: {
        overflow: "auto",
      },
    },
  },
  variants: {
    visible: {
      true: {
        "@media": {
          [media.sm]: {
            display: "block",
          },
        },
      },
    },
    false: {
      "@media": {
        [media.sm]: {
          display: "none",
        },
      },
    },
  },
});

export const categories = style({
  margin: 0,
  padding: 0,
  listStyle: "none",
});
