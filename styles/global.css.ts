import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./variables.css";

globalStyle("html, body", {
  margin: 0,
  padding: 0,
});

globalStyle("body", {
  fontFamily: vars.font.family.body,
});
