import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "styles/variables.css";

const {
  color,
  spacing,
  font: { lineHeight, size, weight },
} = vars;

export const submenu = recipe({
  base: {
    padding: 0,
    listStyle: "none",
  },
  variants: {
    opened: {
      true: {
        display: "block",
      },
      false: {
        display: "none",
      },
    },
  },
});

export const link = style({
  position: "relative",
  display: "block",
  width: "100%",
  padding: `0 ${spacing.m2}`,
  fontSize: "13px",
  lineHeight: lineHeight.lg,
  textDecoration: "none",
  color: color.gray,
  ":focus": {
    backgroundColor: color.white,
    outline: "none",
  },
  ":hover": {
    backgroundColor: color.white,
    outline: "none",
  },
  ":active": {
    backgroundColor: color.white,
    outline: "none",
  },
  selectors: {
    [`${submenu()} &`]: {
      paddingLeft: spacing.m4,
      fontSize: size.sm,
    },
  },
});

export const selected = style({
  selectors: {
    [`${link}&`]: {
      backgroundColor: color.white,
    },
  },
});

export const active = style({
  selectors: {
    [`${link}&`]: {
      fontWeight: weight.bold,
      color: color.darkPurple,
    },
  },
});

export const ellipsis = style({
  position: "absolute",
  top: "50%",
  right: spacing.m2,
  color: color.lightGray,
  transform: "translateY(-50%)",
  selectors: {
    [`${link}${active} &`]: {
      display: "none",
    },
  },
});
