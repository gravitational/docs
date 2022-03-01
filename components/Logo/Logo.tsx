import Flex, { FlexProps } from "components/Flex";
import LogoSvg from "./logo.svg?react";

export type LogoProps = {
  width?: string | string[];
  height?: string | string[];
} & FlexProps;

const Logo = (props: LogoProps) => (
  <Flex
    display="inline-block"
    lineHeight="0"
    width="121px"
    height="24px"
    {...props}
  >
    <LogoSvg width="100%" height="100%" />
  </Flex>
);

export default Logo;
