import { createGlobalStyle } from "styled-components";
import ubuntuMono400 from "./assets/ubuntu-mono-400.woff2";

export const UbuntuMono = createGlobalStyle`
@font-face {
  font-family: 'Ubuntu Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(${ubuntuMono400}) format('woff2');
}
`;
