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
      backgroundColor: color["lightest-gray"],
      borderColor: color["lightest-gray"],
      color: color["dark-gray"],
      cursor: "default",
      pointerEvents: "none",
    },
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: color["dark-purple"],
        borderColor: color["dark-purple"],
        color: color.white,
        ":focus": {
          backgroundColor: color["light-purple"],
          borderColor: color["light-purple"],
          color: color.white,
        },
        ":hover": {
          backgroundColor: color["light-purple"],
          borderColor: color["light-purple"],
          color: color.white,
        },
      },
      secondary: {
        backgroundColor: color.white,
        borderColor: color["dark-purple"],
        color: color["dark-purple"],
        ":focus": {
          backgroundColor: color.white,
          borderColor: color["light-purple"],
          color: color["light-purple"],
        },
        ":hover": {
          backgroundColor: color.white,
          borderColor: color["light-purple"],
          color: color["light-purple"],
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
        fontSize: size["text-xs"],
        textTransform: "uppercase",
        borderWidth: "1px",
      },
      md: {
        height: "32px",
        padding: `0 ${spacing.m3}`,
        fontSize: size["text-md"],
        borderWidth: "1px",
      },
      lg: {
        height: "48px",
        padding: `0 ${spacing.m6}`,
        fontSize: size["text-lg"],
        borderWidth: "1px",
      },
      outline: {
        height: "48px",
        padding: `0 ${spacing.m6}`,
        fontSize: size["text-lg"],
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
