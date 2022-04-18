import { style, globalStyle } from "@vanilla-extract/css";
import { media, vars } from "styles/variables.css";

const {
  color,
  spacing,
  font: { lineHeight, size, weight },
} = vars;

export const wrapper = style({
  ":first-child": {
    marginTop: 0,
  },
  ":last-child": {
    marginBottom: 0,
  },
});

globalStyle(`${wrapper} code`, {
  fontSize: "0.875em",
});

export const anchor = style({
  display: "none",
  color: color.lightGray,
  textDecoration: "none",
  ":hover": {
    color: color.gray,
  },
  "::before": {
    content: " ¶",
  },
  selectors: {
    [`${wrapper}:hover &`]: {
      display: "inline",
    },
  },
});

export const h1 = style({
  margin: `${spacing.m3} 0 ${spacing.m2}`,
  fontSize: size.header1,
  fontWeight: weight.black,
  lineHeight: lineHeight.xxl,
});

export const h2 = style({
  margin: `${spacing.m2} 0 ${spacing.m1}`,
  fontWeight: weight.bold,
  "@media": {
    [media.sm]: {
      fontSize: size.header2,
      lineHeight: lineHeight.lg,
    },
    [media.md]: {
      fontSize: size.header1,
      lineHeight: lineHeight.xxl,
    },
  },
});

export const h3 = style({
  margin: `${spacing.m2} 0 ${spacing.m1}`,
  fontWeight: weight.bold,
  "@media": {
    [media.sm]: {
      fontSize: size.header4,
      lineHeight: lineHeight.md,
    },
    [media.md]: {
      fontSize: size.header3,
      lineHeight: lineHeight.lg,
    },
  },
});

export const h4 = style({
  margin: `${spacing.m2} 0 ${spacing.m1}`,
  fontSize: size.xl,
  fontWeight: weight.bold,
  lineHeight: lineHeight.lg,
});

export const h5 = style({
  margin: `${spacing.m2} 0 ${spacing.m1}`,
  fontSize: size.md,
  lineHeight: lineHeight.lg,
  textTransform: "uppercase",
});
