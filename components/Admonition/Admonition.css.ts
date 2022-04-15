import { style, createVar } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars, media } from "styles/variables.css";

const {
  color,
  radii,
  spacing,
  font: { lineHeight, size },
} = vars;

const headerTextColor = createVar();
const mainColor = createVar();

export const wrapper = recipe({
  base: {
    vars: {
      [headerTextColor]: color.white,
    },
    border: `1px solid ${mainColor}`,
    borderRadius: radii.default,
    marginBottom: spacing.m2,
    boxShadow: "0 1px 4px rgb(0 0 0 / 24%)",
    ":last-child": {
      marginBottom: 0,
    },
  },
  variants: {
    type: {
      warning: {
        vars: {
          [mainColor]: color.warning,
          [headerTextColor]: color.black,
        },
      },
      tip: {
        vars: {
          [mainColor]: color.tip,
        },
      },
      note: {
        vars: {
          [mainColor]: color.note,
        },
      },
      danger: {
        vars: {
          [mainColor]: color.danger,
        },
      },
      hidden: {
        display: "none",
      },
    },
  },
});

export const header = style({
  color: headerTextColor,
  backgroundColor: mainColor,
  borderTopLeftRadius: radii.default,
  borderTopRightRadius: radii.default,
  height: spacing.m3,
  fontSize: size.sm,
  lineHeight: lineHeight.md,
  padding: `0 ${spacing.m1}`,
  textTransform: "uppercase",
  "@media": {
    [media.md]: {
      padding: `0 ${spacing.m2}`,
    },
  },
});

export const body = style({
  padding: vars.spacing.m1,
  fontSize: size.md,
  "@media": {
    [media.md]: {
      padding: `${spacing.m1} ${spacing.m2}`,
      fontSize: size.lg,
    },
  },
});
