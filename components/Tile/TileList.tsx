import css from "@styled-system/css";
import { transition } from "components/system";
import Box from "components/Box";
import Flex from "components/Flex";
import Link from "components/Link";
import Icon, { IconName } from "components/Icon";
import { TileWrapper } from "./TileSet";

export interface TileListItemProps {
  href: string;
  children: React.ReactNode;
}

export const TileListItem = ({ href, children }: TileListItemProps) => {
  return (
    <Box
      as="li"
      listStyle="none"
      color="gray"
      pl="5"
      position="relative"
      css={css({
        "& + &": { mt: 2 },
        "&::before": {
          content: '"•"',
          position: "absolute",
          left: 0,
          width: "24px",
          display: "inline-block",
          textAlign: "center",
        },
      })}
    >
      <Link
        href={href}
        textDecoration="none"
        color="inherit"
        fontSize="md"
        lineHeight="md"
        css={css({
          transition: transition([["color", "interaction"]]),
          "&:hover, &:active, &:focus": { color: "dark-purple" },
        })}
      >
        {children}
      </Link>
    </Box>
  );
};

export interface TileListProps {
  title: string;
  icon: IconName;
  href?: string;
  children:
    | React.ReactElement<typeof TileListItem>
    | Array<React.ReactElement<typeof TileListItem>>;
}

const TileList = ({ title, icon, href, children }: TileListProps) => {
  return (
    <TileWrapper>
      <Flex
        flexDirection="column"
        borderRadius="default"
        border="1px solid"
        borderColor="light-gray"
        bg="lightest-gray"
        width="100%"
      >
        <Flex
          mx="3"
          py="3"
          color="dark-gray"
          borderBottom="1px solid"
          borderColor="light-gray"
        >
          <Icon name={icon} size="md" mr="2" flexShrink={0} />
          <Box
            flexGrow={1}
            fontSize="text-xl"
            lineHeight="md"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
            title={title}
          >
            {title}
          </Box>
          {href && (
            <Link
              href={href}
              width="88px"
              ml="2"
              borderRadius="default"
              border="1px solid"
              color="gray"
              borderColor="light-gray"
              fontSize="text-xs"
              lineHeight="md"
              textAlign="center"
              textDecoration="none"
              whiteSpace="nowrap"
              flexShrink="0"
              css={css({
                transition: transition([
                  ["borderColor", "interaction"],
                  ["color", "interaction"],
                ]),
                "&:hover, &:active, &:focus": {
                  color: "dark-purple",
                  borderColor: "dark-purple",
                },
              })}
            >
              VIEW ALL
            </Link>
          )}
        </Flex>
        <Box as="ul" p="3">
          {children}
        </Box>
      </Flex>
    </TileWrapper>
  );
};

export default TileList;
