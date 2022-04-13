import { globalFontFace } from "@vanilla-extract/css";
import lato400 from "./assets/lato-400.woff2";
import lato700 from "./assets/lato-700.woff2";
import lato900 from "./assets/lato-900.woff2";
import latoItalic400 from "./assets/lato-400-italic.woff2";
import latoItalic700 from "./assets/lato-700-italic.woff2";
import latoItalic900 from "./assets/lato-900-italic.woff2";

globalFontFace("Lato", {
  fontStyle: "normal",
  fontWeight: "400",
  fontDisplay: "swap",
  src: `url("${lato400}") format("woff2")`,
});

globalFontFace("Lato", {
  fontStyle: "normal",
  fontWeight: "700",
  fontDisplay: "swap",
  src: `url("${lato700}") format("woff2")`,
});

globalFontFace("Lato", {
  fontStyle: "normal",
  fontWeight: "900",
  fontDisplay: "swap",
  src: `url("${lato900}") format("woff2")`,
});

globalFontFace("Lato", {
  fontStyle: "italic",
  fontWeight: "400",
  fontDisplay: "swap",
  src: `url("${latoItalic400}") format("woff2")`,
});

globalFontFace("Lato", {
  fontStyle: "italic",
  fontWeight: "700",
  fontDisplay: "swap",
  src: `url("${latoItalic700}") format("woff2")`,
});

globalFontFace("Lato", {
  fontStyle: "italic",
  fontWeight: "900",
  fontDisplay: "swap",
  src: `url("${latoItalic900}") format("woff2")`,
});
