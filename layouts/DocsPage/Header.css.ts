import { style } from "@vanilla-extract/css";
import { media, vars } from "styles/variables.css";
import wavePurplePng from "./assets/wave-purple.png";

const {
  color,
  spacing,
  font: { lineHeight, size, weight },
} = vars;

export const wrapper = style({
  display: "flex",
  position: "relative",
  minHeight: "168px",
  alignItems: "stretch",
  backgroundImage: `url("${wavePurplePng}"), linear-gradient(125deg, #512fc9, #651fff)`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "cover",
});

export const githubLink = style({
  position: "absolute",
  top: 0,
  right: 0,
});

export const icon = style({
  margin: `${spacing.m7} ${spacing.m2} 0 ${spacing.m7}`,
  flexShrink: 0,
  color: color.white,
  "@media": {
    [media.sm]: {
      display: "none",
    },
  },
});

export const description = style({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  paddingTop: spacing.m4,
  "@media": {
    [media.sm]: {
      paddingTop: spacing.m2,
    },
  },
});

export const subtitle = style({
  fontSize: size.sm,
  lineHeight: lineHeight.md,
  color: color.white,
  "@media": {
    [media.sm]: {
      display: "none",
    },
  },
});

export const title = style({
  color: color.white,
  fontWeight: weight.regular,
  marginTop: 0,
  "@media": {
    [media.sm]: {
      marginBottom: spacing.m8,
      paddingLeft: spacing.m2,
      paddingRight: "120px",
      fontSize: size.header2,
    },
    [media.md]: {
      marginBottom: "auto",
      paddingLeft: 0,
      paddingRight: spacing.m5,
      fontSize: size.header1,
    },
  },
});

export const dropdowns = style({
  display: "flex",
  margin: spacing.m2,
  alignItems: "center",
  "@media": {
    [media.md]: {
      margin: `${spacing.m2} ${spacing.m6} ${spacing.m2} 0`,
    },
  },
});

export const scopes = style({
  marginRight: spacing.m1,
  "@media": {
    [media.md]: {
      marginRight: spacing.m2,
    },
  },
});

export const button = style({
  marginLeft: "auto",
  padding: `0 ${spacing.m1} !important`,
});
