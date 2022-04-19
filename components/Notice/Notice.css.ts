import { style, createVar } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "styles/variables.css";

const {
  color,
  radii,
  spacing,
  font: { lineHeight, size },
} = vars;

const iconColor = createVar();

export const icon = style({
  flexShrink: 0,
  marginRight: spacing.m1,
  color: iconColor,
});

export const wrapper = recipe({
  base: {
    padding: spacing.m1,
    borderRadius: radii.default,
    border: "1px solid",
    alignItems: "center",
    marginBottom: spacing.m2,
    borderColor: iconColor,
    ":last-child": {
      marginBottom: 0,
    },
  },
  variants: {
    type: {
      warning: {
        backgroundColor: "rgba(255 180 0 / 12%)",
        vars: {
          [iconColor]: color.warning,
        },
      },
      tip: {
        backgroundColor: "rgba(0 199 174 / 6%)",
        vars: {
          [iconColor]: color.tip,
        },
      },
      note: {
        backgroundColor: "rgba(0 156 241 / 12%)",
        vars: {
          [iconColor]: color.note,
        },
      },
      danger: {
        backgroundColor: "rgba(248 0 97 / 6%)",
        vars: {
          [iconColor]: color.danger,
        },
      },
    },
    hidden: {
      true: {
        display: "none",
      },
      false: {
        display: "flex",
      },
    },
  },
});

export const body = style({
  fontSize: size.lg,
  lineHeight: lineHeight.md,
});
