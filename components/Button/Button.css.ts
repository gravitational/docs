import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "styles/variables.css";

const {
  color,
  radii,
  spacing,
  timing,
  font: { size, weight },
} = vars;

export const wrapper = recipe({
  base: {
    appearance: "none",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    borderStyle: "solid",
    borderRadius: radii.default,
    overflow: "hidden",
    fontWeight: "600",
    whiteSpace: "nowrap",
    textDecoration: "none",
    cursor: "pointer",
    transition: `background ${timing.interaction}, color ${timing.interaction}`,
    ":focus": {
      outline: "none",
    },
    ":active": {
      transitionDuration: "0s",
      opacity: "0.56",
    },
    ":disabled": {
      backgroundColor: color.lightestGray,
      borderColor: color.lightestGray,
      color: color.darkGray,
      cursor: "default",
      pointerEvents: "none",
    },
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: color.darkPurple,
        borderColor: color.darkPurple,
        color: color.white,
        ":focus": {
          backgroundColor: color.lightPurple,
          borderColor: color.lightPurple,
          color: color.white,
        },
        ":hover": {
          backgroundColor: color.lightPurple,
          borderColor: color.lightPurple,
          color: color.white,
        },
      },
      secondary: {
        backgroundColor: color.white,
        borderColor: color.darkPurple,
        color: color.darkPurple,
        ":focus": {
          backgroundColor: color.white,
          borderColor: color.lightPurple,
          color: color.lightPurple,
        },
        ":hover": {
          backgroundColor: color.white,
          borderColor: color.lightPurple,
          color: color.lightPurple,
        },
      },
      "secondary-white": {
        backgroundColor: "transparent",
        borderColor: color.white,
        color: color.white,
        ":hover": {
          backgroundColor: "rgba(255 255 255 / 12%)",
        },
        ":active": {
          backgroundColor: "rgba(255 255 255 / 12%)",
        },
        ":focus": {
          backgroundColor: "rgba(255 255 255 / 12%)",
        },
      },
    },
    shape: {
      sm: {
        height: "24px",
        padding: `0 ${spacing.m1}`,
        fontSize: size.xs,
        textTransform: "uppercase",
        borderWidth: "1px",
      },
      md: {
        height: "32px",
        padding: `0 ${spacing.m3}`,
        fontSize: size.md,
        borderWidth: "1px",
      },
      lg: {
        height: "48px",
        padding: `0 ${spacing.m6}`,
        fontSize: size.lg,
        borderWidth: "1px",
      },
      outline: {
        height: "48px",
        padding: `0 ${spacing.m6}`,
        fontSize: size.lg,
        fontWeight: weight.bold,
        borderWidth: "1px",
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    shape: "md",
  },
});

export type ButtonVariants = RecipeVariants<typeof wrapper>;
