import { style, createVar } from "@vanilla-extract/css";
import { media, vars } from "styles/variables.css";

const { spacing } = vars;

const gap = createVar();

export const wrapper = style({
  vars: {
    [gap]: spacing.m4,
  },
  display: "flex",
  flexWrap: "wrap",
  alignItems: "stretch",
});

export const tile = style({
  flex: "0 0 100%",
  display: "flex",
  justifyContent: "stretch",
  alignItems: "stretch",
  "@media": {
    [media.sm]: {
      paddingBottom: spacing.m2,
    },
    [media.md]: {
      maxWidth: `calc((100% - ${gap} * 2)) / 3)`,
      paddingBottom: gap,
    },
  },
  selectors: {
    [`${wrapper} &`]: {
      "@media": {
        [media.md]: {
          marginLeft: gap,
        },
      },
    },
    [`${wrapper} &:nth-child(3n + 1)`]: {
      "@media": {
        [media.md]: {
          marginLeft: 0,
        },
      },
    },
  },
});
