import { globalFontFace } from "@vanilla-extract/css";
import ubuntuMono400 from "./assets/ubuntu-mono-400.woff2";

globalFontFace("Ubuntu Mono", {
  fontStyle: "normal",
  fontWeight: "400",
  fontDisplay: "swap",
  src: `url("${ubuntuMono400}") format("woff2")`,
});
