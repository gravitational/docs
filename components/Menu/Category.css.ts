import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { media, vars } from "styles/variables.css";

const {
  color,
  radii,
  spacing,
  timing,
  font: { size },
} = vars;

export const wrapper = style({
  position: "relative",
});

export const link = recipe({
  base: {
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "80px",
    padding: `0 ${spacing.m2}`,
    fontSize: "15px",
    fontWeight: 500,
    outline: "none",
    textDecoration: "none",
    cursor: "pointer",
    transition: `background ${timing.interaction}`,
    ":focus": {
      color: color.darkPurple,
      backgroundColor: "rgba(240 242 244 / 56%)",
    },
    ":hover": {
      color: color.darkPurple,
      backgroundColor: "rgba(240 242 244 / 56%)",
    },
    "@media": {
      [media.sm]: {
        width: "100%",
        marginBottom: spacing.m1,
        borderRadius: radii.default,
        fontSize: size.lg,
        lineHeight: "56px",
        color: color.darkest,
        backgroundColor: color.lightestGray,
        textAlign: "left",
      },
    },
  },
  variants: {
    active: {
      true: {
        backgroundColor: "rgba(240 242 244 / 56%)",
        color: color.darkPurple,
      },
      false: {
        color: color.darkest,
      },
    },
  },
});

export const dropdown = recipe({
  base: {
    left: 0,
    zIndex: 3000,
    marginLeft: 0,
    "@media": {
      [media.sm]: {
        position: "relative",
        width: "100%",
      },
      [media.md]: {
        position: "absolute",
        minWidth: "540px",
      },
    },
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
