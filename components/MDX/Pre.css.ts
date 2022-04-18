import { keyframes, style } from "@vanilla-extract/css";
import { vars } from "styles/variables.css";

const { color, radii, spacing, timing } = vars;

const buttonAppearance = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

export const wrapper = style({
  position: "relative",
  backgroundColor: color.code,
  borderRadius: radii.default,
  marginTop: `calc(9px - ${spacing.m0_5})`,
  marginBottom: spacing.m3,
  boxShadow: "0 1px 4px rgba(0 0 0 / 24%)",
  ":last-child": {
    marginBottom: 0,
  },
});

export const button = style({
  display: "none",
  alignItems: "center",
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: 2,
  padding: spacing.m1,
  color: color.lighterGray,
  cursor: "pointer",
  borderTopRightRadius: radii.default,
  borderBottomRightRadius: radii.default,
  opacity: 0,
  animationDuration: "0.3s",
  animationFillMode: "forwards",
  transition: `color ${timing.interaction}`,
  animationName: buttonAppearance,
  ":hover": {
    color: color.white,
    outline: "none",
  },
  ":focus": {
    color: color.white,
    outline: "none",
  },
  ":active": {
    color: color.white,
    outline: "none",
  },
  selectors: {
    [`${wrapper}:hover > &`]: {
      display: "flex",
    },
  },
});

export const copied = style({
  marginLeft: spacing.m1,
});

export const code = style({
  borderRadius: radii.default,
  whiteSpace: "break-spaces",
});
