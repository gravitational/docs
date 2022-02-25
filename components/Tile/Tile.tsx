import styled from "styled-components";
import css from "@styled-system/css";
import { transition } from "components/system";
import Box from "components/Box";
import Flex from "components/Flex";
import Icon, { IconName } from "components/Icon";
import Link from "components/Link";
import { TileWrapper } from "./TileSet";
import bgHref from "./assets/bg.svg";

export interface TileProps {
  children: React.ReactNode;
  href: string;
  icon: IconName;
  title: string;
}

const Tile = ({ children, href, icon, title }: TileProps) => {
  return (
    <TileWrapper>
      <StyledWrapper href={href}>
        <Flex
          flexDirection="column"
          alignItems="center"
          py="3"
          px="4"
          backgroundImage={`url("${bgHref}")`}
          backgroundPosition="center"
          backgroundSize="cover"
          borderTopLeftRadius="default"
          borderTopRightRadius="default"
        >
          <Icon name={icon} size="lg" color="light-purple" />
          <Box
            fontSize="text-xl"
            fontWeight="black"
            lineHeight="lg"
            textAlign="center"
            color="dark-purple"
          >
            {title}
          </Box>
        </Flex>
        <Box
          py="3"
          px="4"
          color="darkest"
          fontSize="text-md"
          lineHeight="md"
          flexGrow={1}
          css={css({
            [`${StyledWrapper}:hover &`]: {
              color: "dark-purple",
            },
          })}
        >
          {children}
        </Box>
      </StyledWrapper>
    </TileWrapper>
  );
};

const StyledWrapper = styled(Link)(
  css({
    display: "block",
    position: "relative",
    width: "100%",
    boxShadow: "0 1px 4px rgba(0,0,0,0.24)",
    borderRadius: "default",
    bg: "white",
    textDecoration: "none",
    transition: transition([["boxShadow", "interaction"]]),
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: "default",
      border: "1px solid",
      borderColor: "dark-purple",
      opacity: 0,
      transition: transition([["opacity", "interaction"]]),
    },
    "&:hover, &:active, &:focus": {
      outline: "none",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.24)",
      "&::before": {
        opacity: 1,
      },
    },
  })
);

export default Tile;
