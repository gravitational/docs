import { style, globalStyle } from "@vanilla-extract/css";

export const wrapper = style({});

globalStyle(`${wrapper} pre`, {
  color: "#75715e",
});

export const scroll = style({
  width: "max-content",
  minWidth: "100%",
});
