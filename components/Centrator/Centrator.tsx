import Flex, { FlexProps } from "components/Flex";

export const Centrator = ({
  children,
  wrapperAs = "div",
  as = "div",
  ...props
}: FlexProps) => {
  return (
    <Flex as={wrapperAs} justifyContent="center" width="100%" px={[3, 3, 11]}>
      <Flex as={as} maxWidth={1240} width="100%" {...props}>
        {children}
      </Flex>
    </Flex>
  );
};
