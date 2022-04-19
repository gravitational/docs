import { style } from "@vanilla-extract/css";
import { vars } from "styles/variables.css";

const { color, spacing } = vars;

export const wrapper = style({
  padding: spacing.m3,
  textAlign: "center",
});

export const icon = style({
  margin: `0 auto ${spacing.m1} auto`,
  color: color.lightGray,
});
