import { style } from "@vanilla-extract/css";
import { vars } from "styles/variables.css";

const {
  color,
  radii,
  spacing,
  font: { size },
} = vars;

export const wrapper = style({
  padding: `0 ${spacing.m0_5}`,
  border: `1px solid ${color.lightGray}`,
  borderRadius: radii.sm,
  fontSize: size.md,
  wordBreak: "break-word",
  backgroundColor: color.lightestGray,
});
