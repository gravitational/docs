import Box from "components/Box";

const DropdownMenuOverlay = () => {
  return (
    <Box
      display={["none", "block"]}
      position="fixed"
      top="80px"
      right={0}
      bottom={0}
      left={0}
      zIndex={1000}
      background="blur(60px)"
    />
  );
};

export default DropdownMenuOverlay;
