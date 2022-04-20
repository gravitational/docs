import { recipe } from "@vanilla-extract/recipes";
import { media, vars } from "styles/variables.css";
import landscapeSvg from "./assets/landscape.svg";

const { color, spacing } = vars;

export const wrapper = recipe({
  base: {
    position: "relative",
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: spacing.m5,
    "::before": {
      content: "",
      zIndex: 0,
      position: "absolute",
      right: 0,
      bottom: 0,
      left: 0,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundImage: `url("${landscapeSvg}")`,
    },
    "@media": {
      [media.sm]: {
        paddingBottom: `calc(50px + ${spacing.m2})`,
        "::before": {
          height: "50px",
        },
      },
      [media.md]: {
        height: "400px",
        "::before": {
          height: "280px",
        },
      },
    },
  },
  variants: {
    section: {
      true: {
        backgroundColor: color.pageBG,
      },
      false: {
        backgroundColor: color.white,
      },
    },
  },
});
