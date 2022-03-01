import css from "@styled-system/css";
import Box, { BoxProps } from "components/Box";
import Link from "components/Link";
import { HeaderMeta } from "./types";

export interface AnchorNavigationProps {
  headers: HeaderMeta[];
}

const AnchorNavigation = ({
  headers,
  ...props
}: AnchorNavigationProps & BoxProps) => {
  return (
    <Box as="nav" flexShrink={0} position="relative">
      <Box
        width="240px"
        p={4}
        position="sticky"
        top="0"
        maxHeight="100vh"
        overflow="auto"
        {...props}
      >
        <Box
          text="text-sm"
          maxHeight="100%"
          overflowY="auto"
          mx={1}
          mb={1}
          py={1}
          fontWeight="bold"
          color="darkest"
          borderBottom="1px solid"
          borderColor="lightest-gray"
        >
          Table of Contents
        </Box>
        {headers.map(({ id, title }) => {
          return (
            <Link
              key={id}
              href={`#${id}`}
              display="block"
              fontSize="text-sm"
              lineHeight="sm"
              color="dark-gray"
              p={1}
              css={css({
                textDecoration: "none",
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                "&:focus, &:hover, &:active": {
                  bg: "lightest-gray",
                  borderRadius: "default",
                },
              })}
            >
              {title}
            </Link>
          );
        })}
      </Box>
    </Box>
  );
};

export default AnchorNavigation;
