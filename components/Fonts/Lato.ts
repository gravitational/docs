import { createGlobalStyle } from "styled-components";
import lato400 from "./assets/lato-400.woff2";
import lato400italic from "./assets/lato-400-italic.woff2";
import lato700 from "./assets/lato-700.woff2";
import lato700italic from "./assets/lato-700-italic.woff2";
import lato900 from "./assets/lato-900.woff2";
import lato900italic from "./assets/lato-900-italic.woff2";

export const Lato = createGlobalStyle`
@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url(${lato400italic}) format('woff2');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 700;
  font-display: swap;
  src: url(${lato700italic}) format('woff2');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 900;
  font-display: swap;
  src: url(${lato900italic}) format('woff2');
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(${lato400}) format('woff2');
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(${lato700}) format('woff2');
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url(${lato900}) format('woff2');
}
`;
