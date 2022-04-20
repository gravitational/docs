import { style } from "@vanilla-extract/css";
import { vars } from "styles/variables.css";

const {
  color,
  spacing,
  timing,
  font: { lineHeight, size },
} = vars;

export const header = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: "56px",
  color: color.gray,
  borderBottom: `1px solid ${color.lightestGray}`,
  borderLeft: `4px solid ${color.white}`,
  transition: `color ${timing.interaction}`,
  ":focus": {
    color: color.lightPurple,
    cursor: "pointer",
    outline: "none",
  },
  ":hover": {
    color: color.lightPurple,
    cursor: "pointer",
    outline: "none",
  },
  ":active": {
    color: color.lightPurple,
    cursor: "pointer",
    outline: "none",
  },
});

export const opened = style({
  borderLeftColor: color.lightPurple,
  selectors: {
    [`${header}&`]: {
      color: color.darkPurple,
    },
  },
});

export const arrow = style({
  position: "absolute",
  top: "50%",
  right: spacing.m2,
  color: color.lightGray,
  transform: "translateY(-50%)",
  transition: `color ${timing.interaction}, transform ${timing.interaction}`,
  selectors: {
    [`${header}:active &, ${header}:focus &, ${header}:hover &`]: {
      color: "inherit",
    },
    [`${header}${opened} &`]: {
      transform: "translateY(-50%) rotate(180deg)",
    },
  },
});

export const category = style({
  marginRight: spacing.m1,
  marginLeft: "12px",
});

export const title = style({
  fontSize: size.md,
  lineHeight: lineHeight.md,
});

export const links = style({
  padding: `${spacing.m0_5} 0`,
  backgroundColor: color.lightestGray,
  listStyle: "none",
  boxShadow: "inset 0 1px 2px rgba(0 0 0 / 24%)",
});
