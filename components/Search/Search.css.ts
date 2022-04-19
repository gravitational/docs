import { style, globalStyle } from "@vanilla-extract/css";
import { media, vars } from "styles/variables.css";

const {
  color,
  radii,
  spacing,
  font: { size },
} = vars;

export const wrapper = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "stretch",
  boxSizing: "border-box",
  height: "32px",
  background: color.white,
  border: `1px solid ${color.lightGray}`,
  borderRadius: radii.circle,
  ":focus-within": {
    borderColor: color.darkPurple,
  },
});

export const input = style({
  display: "block",
  boxSizing: "border-box",
  width: "100%",
  lineHeight: "30px",
  color: color.black,
  background: "transparent",
  border: "none",
  ":focus": {
    outline: "none",
  },
  selectors: {
    "&:placeholder": {
      color: color.gray,
    },
  },
  "@media": {
    [media.sm]: {
      padding: `0 ${spacing.m2}`,
      fontSize: size.xl,
    },
    [media.md]: {
      padding: `0 ${spacing.m2} 0 36px`,
      fontSize: size.md,
    },
  },
});

export const icon = style({
  position: "absolute",
  marginLeft: "6px",
  color: color.gray,
  "@media": {
    [media.sm]: {
      display: "none",
    },
  },
});

export const wrapperAutocomplete = style({
  width: "100%",
  height: "30px",
  marginRight: spacing.m1,
  marginLeft: spacing.m1,
  "@media": {
    "(max-width: 560px)": {
      width: "100%",
    },
  },
});

globalStyle(
  `${wrapperAutocomplete} .aa-Form, ${wrapperAutocomplete} .aa-DetachedSearchButton`,
  {
    height: "30px",
    borderRadius: "24px",
    borderColor: color.lightGray,
  }
);

globalStyle(`${wrapperAutocomplete} .aa-SubmitIcon`, {
  color: color.lighterGray,
});

globalStyle(`${wrapperAutocomplete} .aa-Input`, {
  fontSize: size.md,
});

export const title = style({
  margin: 0,
  fontSize: size.sm,
  color: color.lighterGray,
});

export const foundHeader = style({
  margin: 0,
  fontSize: size.lg,
  color: color.darkPurple,
});

export const foundContent = style({
  margin: 0,
  fontSize: size.md,
});
