import { recipe } from "@vanilla-extract/recipes";
import { vars } from "styles/variables.css";

const { color, timing } = vars;

export const wrapper = recipe({
  base: {
    boxSizing: "border-box",
    minWidth: 0,
    transition: `color ${timing.interaction}`,
  },
  variants: {
    scheme: {
      docs: {
        color: color.note,
        ":visited": {
          color: color.darkPurple,
        },
        ":hover": {
          color: color.lightPurple,
        },
        ":active": {
          color: color.lightPurple,
        },
        ":focus": {
          color: color.lightPurple,
        },
      },
    },
  },
});
