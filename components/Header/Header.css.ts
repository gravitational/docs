import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars, media } from "styles/variables.css";

const {
  color,
  spacing,
  timing,
  font: { size },
} = vars;

export const wrapper = style({
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  borderBottom: `1px solid ${color.lightestGray}`,
  height: "80px",
  left: 0,
  position: "absolute",
  right: 0,
  top: 0,
  zIndex: 2000,
  "@media": {
    [media.sm]: {
      position: "fixed",
      height: "48px",
      background: color.white,
      boxShadow: "0 1px 4px rgba(0 0 0 / 24%)",
    },
  },
});

export const logoLink = style({
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  width: "200px",
  minWidth: "200px",
  height: spacing.m10,
  padding: `0 ${spacing.m4}`,
  color: color.darkPurple,
  fontSize: size.xl,
  fontWeight: 700,
  lineHeight: spacing.m10,
  textDecoration: "none",
  transition: `background ${timing.interaction}`,
  "@media": {
    [media.sm]: {
      height: spacing.m6,
      padding: `0 ${spacing.m2}`,
      lineHeight: spacing.m6,
    },
  },
  ":focus": {
    background: "rgba(240 242 244 / 56%)",
  },
  ":hover": {
    background: "rgba(240 242 244 / 56%)",
  },
});

export const hamburger = style({
  position: "absolute",
  right: 0,
  top: 0,
  height: spacing.m6,
  padding: `${spacing.m1_5} ${spacing.m2}`,
  color: color.darkPurple,
  cursor: "pointer",
  outline: "none",

  "@media": {
    [media.md]: {
      display: "none",
    },
  },
});

export const content = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    "@media": {
      [media.sm]: {
        position: "fixed",
        zIndex: 2000,
        top: "48px",
        right: 0,
        bottom: 0,
        left: 0,
        flexDirection: "column",
        overflow: "auto",
        width: "auto",
        padding: spacing.m1,
        backgroundColor: color.white,
      },
    },
  },
  variants: {
    visible: {
      true: {
        "@media": {
          [media.sm]: {
            display: "flex",
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
  },
});
