import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "styles/variables.css";

const { color, spacing } = vars;

export const wrapper = recipe({
  base: {
    display: "flex",
    flexDirection: "column",
  },
  variants: {
    align: {
      left: {
        alignItems: "flex-start",
      },
      center: {
        alignItems: "center",
      },
      right: {
        alignItems: "flex-end",
      },
    },
  },
});

export const border = style({
  boxShadow: "0 1px 4px rgba(0 0 0 / 24%)",
});

export const caption = style({
  marginTop: spacing.m1,
  color: color.gray,
  fontStyle: "italic",
});
