import { style, globalStyle } from "@vanilla-extract/css";
import { vars, media } from "styles/variables.css";

const {
  color,
  radii,
  spacing,
  timing,
  font: { size, weight },
} = vars;

export const input = style({
  display: "inline-flex",
  width: "100%",
  whiteSpace: "nowrap",
  color: color.white,
});

export const button = style({
  display: "flex",
  alignItems: "center",
  fontWeight: weight.bold,
  lineHeight: "30px",
  cursor: "pointer",
  border: `1px solid ${color.white}`,
  borderRadius: radii.default,
  padding: `0 ${spacing.m1}`,
  width: "100%",
  transition: `background-color ${timing.interaction}`,
  "@media": {
    [media.sm]: {
      fontSize: size.md,
    },
    [media.md]: {
      fontSize: size.sm,
    },
  },
  ":active": {
    outline: "none",
    backgroundColor: "rgba(255 255 255 / 12%)",
  },
  ":focus": {
    outline: "none",
    backgroundColor: "rgba(255 255 255 / 12%)",
  },
  ":hover": {
    outline: "none",
    backgroundColor: "rgba(255 255 255 / 12%)",
  },
  selectors: {
    '&[aria-disabled="true"]': {
      pointerEvents: "none",
    },
  },
});

globalStyle(`${button} [data-reach-listbox-arrow]`, {
  width: "16px",
  height: "16px",
  marginLeft: spacing.m2,
  transition: `transform ${timing.interaction}`,
  transform: `rotate(0deg)`,
});

globalStyle(`${button} [data-reach-listbox-arrow][data-expanded]`, {
  transform: "rotate(180deg)",
});

export const popover = style({
  border: "none",
  borderRadius: radii.sm,
  boxShadow: "0 4px 16px rgba(0 0 0 / 24%) !important",
  ":focus-within": {
    outline: "none",
  },
});

export const option = style({
  fontWeight: weight.bold,
  lineHeight: "30px",
  padding: `0 ${spacing.m1}`,
  cursor: "pointer",
  transition: `background ${timing.interaction}`,

  "@media": {
    [media.sm]: {
      fontSize: size.md,
    },
    [media.md]: {
      fontSize: size.sm,
    },
  },
  ":hover": {
    color: color.black,
    backgroundColor: color.lightestGray,
  },
  ":focus": {
    color: color.black,
    backgroundColor: color.lightestGray,
  },
  ":active": {
    color: color.black,
    backgroundColor: color.lightestGray,
  },
  ":first-child": {
    borderTopLeftRadius: radii.sm,
    borderTopRightRadius: radii.sm,
  },
  ":last-child": {
    borderBottomLeftRadius: radii.sm,
    borderBottomRightRadius: radii.sm,
  },
  selectors: {
    "&[data-current]": {
      color: color.darkPurple,
      backgroundColor: color.lightestGray,
    },
    '&[aria-selected="true"]': {
      color: color.black,
      backgroundColor: color.lightestGray,
    },
  },
});
