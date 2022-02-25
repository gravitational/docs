import Box from "components/Box";

export interface DropdownMenuProps {
  title: string;
  children: React.ReactNode;
}

const DropdownMenu = ({ title, children }: DropdownMenuProps) => {
  return (
    <Box
      background="white"
      borderRadius="default"
      boxShadow={["none", "0 4px 40px rgba(0, 0, 0, 0.24)"]}
      color="black"
      overflow="hidden"
      width={["100%", "auto"]}
    >
      <Box
        as="h3"
        display={["none", "block"]}
        alignItems="center"
        mx={5}
        my={0}
        borderBottom="1px solid"
        borderColor="lightest-gray"
        fontSize="text-xl"
        lineHeight="64px"
      >
        {title}
      </Box>
      <Box px={[3, 4]} pt={2} pb={[3, 2]}>
        {children}
      </Box>
    </Box>
  );
};

export default DropdownMenu;
