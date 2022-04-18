import { style, keyframes } from "@vanilla-extract/css";
import { vars, media } from "styles/variables.css";

const {
  color,
  spacing,
  timing,
  font: { lineHeight, size },
} = vars;

const shiftButton = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateX(3px)",
  },
  "100%": {
    opacity: 1,
    transform: "translateX(0)",
  },
});

export const command = style({
  boxSizing: "border-box",
  flexDirection: "column",
  position: "relative",
  margin: `0 calc(0px - ${spacing.m2})`,
  padding: `0 ${spacing.m2}`,
  color: color.white,
  backgroundColor: color.code,
  transition: `background-color ${timing.interaction}`,
  ":hover": {
    backgroundColor: color.darkest,
  },
  ":focus": {
    backgroundColor: color.darkest,
  },
  "@media": {
    [media.sm]: {
      fontSize: size.sm,
    },
    [media.md]: {
      fontSize: size.md,
    },
  },
});

export const line = style({
  display: "block",
  selectors: {
    [`${command} &:first-of-type::before`]: {
      content: `attr(data-content)`,
    },
  },
});

export const button = style({
  display: "none",
  alignItems: "center",
  position: "absolute",
  top: 0,
  left: 0,
  margin: 0,
  padding: `${spacing.m0_5} 6px`,
  color: color.lightGray,
  backgroundColor: color.darkest,
  cursor: "pointer",
  opacity: 0,
  animationDuration: "0.3s",
  animationFillMode: "forwards",
  transition: `color ${timing.interaction}`,
  transform: "translateX(3px)",
  appearance: "none",
  animationName: shiftButton,
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
    [`${command}:hover &, ${command}:focus &`]: {
      display: "flex",
    },
  },
});

export const comment = style({
  margin: 0,
  fontSize: size.md,
  lineHeight: lineHeight.md,
  selectors: {
    [`&[data-type="descr"]`]: {
      whiteSpace: "break-spaces",
      wordBreak: "break-word",
    },
  },
});
