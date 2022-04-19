import { style } from "@vanilla-extract/css";
import { vars } from "styles/variables.css";
import headerSvg from "./assets/bg.svg";

const {
  color,
  radii,
  spacing,
  timing,
  font: { lineHeight, size, weight },
} = vars;

export const wrapper = style({
  display: "block",
  position: "relative",
  width: "100%",
  borderRadius: radii.default,
  boxShadow: "0 1px 4px rgba(0 0 0 / 24%)",
  backgroundColor: color.white,
  textDecoration: "none",
  transition: `box-shadow ${timing.interaction}`,
  "::before": {
    content: "",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radii.default,
    border: `1px solid ${color.darkPurple}`,
    opacity: 0,
    transition: `opacity ${timing.interaction}`,
  },
  selectors: {
    "&:hover, &:active, &:focus": {
      outline: "none",
      boxShadow: "0 4px 16px rgba(0 0 0 / 24%)",
    },
    "&:hover::before, &:active::before, &:focus::before": {
      opacity: 1,
    },
  },
});

export const header = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: 0,
  padding: `${spacing.m2} ${spacing.m3}`,
  backgroundImage: `url("${headerSvg}")`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  borderTopLeftRadius: radii.default,
  borderTopRightRadius: radii.default,
});

export const icon = style({
  color: color.lightPurple,
});

export const title = style({
  fontSize: size.xl,
  fontWeight: weight.black,
  lineHeight: lineHeight.lg,
  textAlign: "center",
  color: color.darkPurple,
});

export const body = style({
  flexGrow: 1,
  padding: `${spacing.m2} ${spacing.m3}`,
  color: color.darkest,
  fontSize: size.md,
  lineHeight: lineHeight.md,
  selectors: {
    [`${wrapper}:hover &`]: {
      color: color.darkPurple,
    },
  },
});
