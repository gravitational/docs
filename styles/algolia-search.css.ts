import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./variables.css";

globalStyle(".aa-Panel", {
  zIndex: 1000,
  width: "500px !important",
});

globalStyle("body", {
  fontFamily: vars.font.family.body,
});

globalStyle(".aa-Panel .aa-Item + .aa-Item", {
  marginTop: "8px",
});

globalStyle(".aa-Panel .found-part", {
  color: "#651fff",
  backgroundColor: "#d2dbdf",
});
