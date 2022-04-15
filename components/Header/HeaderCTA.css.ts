import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars, media } from "styles/variables.css";

const {
  spacing,
  font: { size },
} = vars;

export const wrapper = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  flexGrow: 0,
  flexShrink: 0,
  "@media": {
    [media.sm]: {
      flexDirection: "column",
      marginTop: spacing.m4,
      width: "100%",
    },
    [media.md]: {
      flexDirection: "row",
      marginLeft: "auto",
    },
  },
});

export const cta = style({
  flexShrink: 0,
  "@media": {
    [media.sm]: {
      fontSize: size.lg,
      height: "56px !important",
      width: "100%",
      marginTop: spacing.m1,
    },
    [media.md]: {
      marginRight: spacing.m2,
    },
  },
});

export const group = style({
  position: "relative",
  "@media": {
    [media.sm]: {
      width: "100%",
    },
  },
});

export const dropdown = recipe({
  base: {
    zIndex: 3000,
    "@media": {
      [media.sm]: {
        position: "relative",
        width: "100%",
      },
      [media.md]: {
        position: "absolute",
        top: spacing.m4,
        right: spacing.m2,
        minWidth: "400px",
      },
    },
  },
  variants: {
    visible: {
      true: {
        display: "block",
      },
      false: {
        display: "none",
      },
    },
  },
});
