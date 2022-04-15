import { createVar } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const size = createVar();

export const wrapper = recipe({
  base: {
    display: "block",
    width: size,
    height: size,
  },
  variants: {
    size: {
      xs: {
        vars: {
          [size]: "12px",
        },
      },
      sm: {
        vars: {
          [size]: "16px",
        },
      },
      md: {
        vars: {
          [size]: "24px",
        },
      },
      lg: {
        vars: {
          [size]: "32px",
        },
      },
      xl: {
        vars: {
          [size]: "40px",
        },
      },
    },
  },
});
