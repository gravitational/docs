import Box from "components/Box";
import Flex from "components/Flex";
import landscapeSvgUrl from "./assets/landscape.svg";

interface DocsFooterProps {
  section?: boolean;
  children: React.ReactNode;
}

const DocsFooter = ({ children, section }: DocsFooterProps) => {
  return (
    <Flex
      width="100%"
      flexDirection="column"
      alignItems="center"
      pt={6}
      bg={section ? "page-bg" : "white"}
    >
      {children}
      <Box
        width="100%"
        height={["50px", "280px"]}
        mt={3}
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        backgroundImage={`url(${landscapeSvgUrl})`}
      ></Box>
    </Flex>
  );
};

export default DocsFooter;
