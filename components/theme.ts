const breakpoints = ["900px", "1200px"];

const theme = {
  breakpoints,
  colors: {
    "page-bg": "#f6f8f9",
    "dark-purple": "#512FC9",
    "light-purple": "#651FFF",
    white: "#FFFFFF",
    "lightest-gray": "#F0F2F4",
    "lighter-gray": "#D2DBDF",
    "light-blue": "#0091ea",
    "light-gray": "#b5bec7",
    gray: "#607D8B",
    green: "#00bfa5",
    red: "#f50057",
    "dark-gray": "#455A64",
    darkest: "#37474F",
    black: "#000000",
    warning: "#FFB400",
    danger: "#F80061",
    text: "#263238",
    code: "#01172C",
    tip: "#00C7AE",
    note: "#009CF1",
  },
  fonts: {
    body: "'Lato', sans-serif",
    serif: "Georgia, serif",
    monospace: "Ubuntu Mono, monospace",
  },
  fontSizes: {
    "text-xs": 10,
    "text-sm": 12,
    "text-md": 14,
    "text-lg": 16,
    "text-xl": 18,
    "header-4": 20,
    "header-3": 24,
    "header-2": 28,
    "header-1": 32,
    banner: 36,
    "section-header": 40,
    "hero-header": 52,
  },
  fontWeights: {
    regular: 400,
    bold: 700,
    black: 900,
  },
  lineHeights: {
    sm: "16px",
    md: "24px",
    lg: "32px",
    xl: "40px",
    xxl: "48px",
    "hero-header": "60px",
  },
  textStyles: {
    "text-xs": {
      fontSize: "text-xs",
      lineHeight: "md",
    },
    "text-sm": {
      fontSize: "text-sm",
      lineHeight: "md",
    },
    "text-md": {
      fontSize: "text-md",
      lineHeight: "md",
    },
    "text-lg": {
      fontSize: "text-lg",
      lineHeight: "md",
    },
    "text-xl": {
      fontSize: "text-xl",
      lineHeight: "md",
    },
    "header-4": {
      fontSize: "header-4",
      lineHeight: "lg",
    },
    "header-3": {
      fontSize: "header-3",
      lineHeight: "xl",
    },
    "header-2": {
      fontSize: "header-2",
      lineHeight: "xl",
    },
    "header-1": {
      fontSize: "header-1",
      lineHeight: "xxl",
    },
    "section-header": {
      fontSize: "section-header",
      lineHeight: "hero-header",
      fontWeight: "bold",
    },
    "hero-header": {
      fontSize: "hero-header",
      lineHeight: "hero-header",
      fontWeight: "black",
    },
  },
  //      0  1  2  3   4   5   6   7   8   9   10  11
  space: [0, 4, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80],
  media: {
    sm: "@media screen and (max-device-width: 900px), screen and (max-width: 900px)",
    md: "@media screen and (max-device-width: 1200px), screen and (max-width: 1200px)",
    mdVertical: "@media screen and (max-height: 880px)",
  },
  gradients: {
    grayToWhite: {
      background: "linear-gradient(125deg, rgba(240,242,244,.56), white)",
    },
    lightGrayToDark: {
      background:
        "linear-gradient(42deg, #ffffff 0%, #f4f5f7 81%, #f3f4f6 100%, #f0f2f4 100%)",
    },
    purpleToBlack: {
      background: "linear-gradient(54deg, #391c70 0%, #0c143d 100%)",
    },
    purpleToBlackRadial: {
      background: "radial-gradient(#391C70, #0C143D)",
    },
  },
  transitionTimings: {
    fast: 150,
    interaction: 300,
    shift: 600,
    slow: 1200,
  },
  radii: {
    sm: 2,
    md: 8,
    lg: 16,
    default: 4,
    circle: 99999,
  },
};

export default theme;
