import styled from "styled-components";
import { useClickAway } from "react-use";
import { useCallback, useRef } from "react";
import { css, media, transition } from "components/system";
import Box from "components/Box";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuOverlay,
  MenuItemProps,
} from "../DropdownMenu";

export interface MenuCategoryProps {
  title: string;
  description: string;
  href: string;
  children?: MenuItemProps[];
}

interface MenuCategoryComponentProps extends MenuCategoryProps {
  id: number;
  opened: boolean;
  onToggleOpened: (id: number | null) => void;
}

const MenuCategory = ({
  id,
  opened,
  title,
  description,
  children,
  href,
  onToggleOpened,
}: MenuCategoryComponentProps) => {
  const ref = useRef(null);

  useClickAway(ref, () => {
    if (opened) {
      onToggleOpened(null);
    }
  });

  const toggleOpened = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (children) {
        e.preventDefault();

        onToggleOpened(opened ? null : id);
      }
    },
    [opened, children, id, onToggleOpened]
  );

  return (
    <>
      {opened && <DropdownMenuOverlay />}
      <Box position="relative" ref={ref}>
        <MainLink href={href} onClick={toggleOpened} active={opened}>
          {title}
        </MainLink>
        <Box
          display={opened ? "block" : "none"}
          left={0}
          ml={0}
          position={["relative", "absolute"]}
          width={["100%", "auto"]}
          minWidth={[0, "540px"]}
          zIndex={3000}
        >
          {children && (
            <DropdownMenu title={description}>
              {children.map((props) => (
                <DropdownMenuItem key={props.href} {...props} />
              ))}
            </DropdownMenu>
          )}
        </Box>
      </Box>
    </>
  );
};

const MainLink = styled("a")(({ active }: { active: boolean }) => [
  css({
    boxSizing: "border-box",
    color: active ? "dark-purple" : "darkest",
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "15px",
    bg: active ? "rgba(240, 242, 244, 0.56)" : "transparent",
    fontWeight: 500,
    height: "80px",
    outline: "none",
    padding: "0 16px",
    position: "relative",
    textDecoration: "none",
    transition: transition([["background", "interaction"]]),
    "&:focus, &:hover": {
      color: "dark-purple",
      bg: "rgba(240, 242, 244, 0.56)",
    },
  }),
  media("sm", {
    color: "darkest",
    bg: "lightest-gray",
    borderRadius: "default",
    float: "none",
    fontSize: "text-lg",
    mb: 2,
    lineHeight: "56px",
    textAlign: "left",
    width: "100%",
  }),
]);

export default MenuCategory;
