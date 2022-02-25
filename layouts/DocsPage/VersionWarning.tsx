import { useContext } from "react";
import Box, { BoxProps } from "components/Box";
import Icon from "components/Icon";
import Link from "components/Link";
import { DocsContext } from "./context";

export const VersionWarning = (props: BoxProps) => {
  const {
    versions: { current },
  } = useContext(DocsContext);

  return (
    <Box textAlign="center" p={4} {...props}>
      <Icon name="clouds" size="lg" mx="auto" mb={2} color="light-gray" />
      Cloud is not available for Teleport v{current}.
      <br />
      Please use the{" "}
      <Link href="/" scheme="docs">
        latest version of Teleport Enterprise documentation
      </Link>
      .
    </Box>
  );
};
