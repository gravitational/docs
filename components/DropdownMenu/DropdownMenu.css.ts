import { style } from "@vanilla-extract/css";
import { vars, media } from "styles/variables.css";

const {
  color,
  radii,
  spacing,
  font: { size },
} = vars;

export const wrapper = style({
  overflow: "hidden",
  borderRadius: radii.default,
  color: color.black,
  background: color.white,
  "@media": {
    [media.sm]: {
      width: "100%",
    },
    [media.md]: {
      boxShadow: "0 4px 40px rgba(0 0 0 / 24%)",
    },
  },
});

export const header = style({
  alignItems: "center",
  margin: `0 ${spacing.m4}`,
  borderBottom: `1px solid ${color.lightestGray}`,
  fontSize: size.xl,
  lineHeight: "64px",
  "@media": {
    [media.sm]: {
      display: "none",
    },
  },
});

export const body = style({
  "@media": {
    [media.sm]: {
      padding: `${spacing.m1} ${spacing.m2} ${spacing.m2}`,
    },
    [media.md]: {
      padding: `${spacing.m1} ${spacing.m3}`,
    },
  },
});
