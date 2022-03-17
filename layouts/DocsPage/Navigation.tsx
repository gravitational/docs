import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import css from "@styled-system/css";
import { useRouter } from "next/router";
import { transition } from "components/system";
import { all } from "components/system";
import Box from "components/Box";
import Flex from "components/Flex";
import HeadlessButton from "components/HeadlessButton";
import Search from "components/Search";
import Icon from "components/Icon";
import Link, { useCurrentHref } from "components/Link";
import { getScopeFromUrl } from "./context";
import { NavigationItem, NavigationCategory } from "./types";

interface DocsNavigationItemsProps {
  entries: NavigationItem[];
  onClick: () => void;
}

const DocsNavigationItems = ({
  entries,
  onClick,
}: DocsNavigationItemsProps) => {
  const router = useRouter();
  const docPath = useCurrentHref();
  const urlScope = getScopeFromUrl(router.asPath);

  return (
    <>
      {!!entries.length &&
        entries.map((entry) => {
          const entryActive = entry.slug === docPath;
          const childrenActive = entry.entries?.some(
            (entry) => entry.slug === docPath
          );

          return entry.hideInScopes === urlScope ? null : (
            <Box as="li" key={entry.slug}>
              <NavigationLink
                href={entry.slug}
                active={entryActive || childrenActive}
                isSelected={entryActive}
                onClick={onClick}
              >
                {entry.title}
                {!!entry.entries?.length && (
                  <EllipsisIcon size="sm" name="ellipsis" />
                )}
              </NavigationLink>
              {!!entry.entries?.length && (
                <WrapperLevelMenu as="ul" listStyle="none">
                  <DocsNavigationItems
                    entries={entry.entries}
                    onClick={onClick}
                  />
                </WrapperLevelMenu>
              )}
            </Box>
          );
        })}
    </>
  );
};

interface DocNavigationCategoryProps extends NavigationCategory {
  id: number;
  opened: boolean;
  onToggleOpened: (value: number) => void;
  onClick: () => void;
}

const DocNavigationCategory = ({
  id,
  opened,
  onToggleOpened,
  onClick,
  icon,
  title,
  entries,
}: DocNavigationCategoryProps) => {
  const toggleOpened = useCallback(
    () => onToggleOpened(opened ? null : id),
    [id, opened, onToggleOpened]
  );

  return (
    <>
      <CategoryButton active={opened} onClick={toggleOpened}>
        <Icon name={icon} ml="12px" mr={2} />
        <Box text="text-md">{title}</Box>
        <StyledIcon
          size="sm"
          name="arrow"
          transform={
            opened ? "translateY(-50%) rotate(180deg)" : "translateY(-50%)"
          }
        />
      </CategoryButton>
      {opened && (
        <Box
          as="ul"
          listStyle="none"
          bg="lightest-gray"
          py={1}
          boxShadow="inset 0 1px 2px rgba(0, 0, 0, 0.24)"
        >
          <DocsNavigationItems entries={entries} onClick={onClick} />
        </Box>
      )}
    </>
  );
};

const hasSlug = (items: NavigationItem[], href: string) => {
  return items.some(({ slug, entries }) => {
    return slug === href || (!!entries && hasSlug(entries, href));
  });
};

export const getCurrentCategoryIndex = (
  categories: NavigationCategory[],
  href: string
) => {
  const scopelessHref = href.split(/\?|\#/)[0];
  const index = categories.findIndex(({ entries }) =>
    hasSlug(entries, scopelessHref)
  );

  return index !== -1 ? index : null;
};

interface DocNavigationProps {
  section?: boolean;
  currentVersion?: string;
  data: NavigationCategory[];
}

const DocNavigation = ({
  data,
  section,
  currentVersion,
}: DocNavigationProps) => {
  const route = useCurrentHref();

  const [openedId, setOpenedId] = useState<number>(
    getCurrentCategoryIndex(data, route)
  );
  const [visible, setVisible] = useState<boolean>(false);
  const toggleMenu = useCallback(() => setVisible((visible) => !visible), []);

  useEffect(() => {
    setOpenedId(getCurrentCategoryIndex(data, route));
  }, [data, route]);

  return (
    <Box
      width={["auto", "240px"]}
      height={["48px", "100%"]}
      position="relative"
      zIndex={1000}
      boxShadow={section ? ["none", "1px 0 4px rgba(0,0,0,.12)"] : "none"}
      borderRight={section ? "none" : ["none", "1px solid"]}
      borderColor={["none", "lightest-gray"]}
    >
      <Flex height="48px" py={2} bg="lighter-gray" alignItems="center">
        <Search id="mobile" mx={2} width="100%" version={currentVersion} />
        <HeadlessButton
          onClick={toggleMenu}
          mr={3}
          color="gray"
          display={["block", "none"]}
          css={css({
            "&:focus": {
              outline: "none",
            },
          })}
        >
          <Icon name={visible ? "close" : "hamburger"} size="md" />
        </HeadlessButton>
      </Flex>
      <Box
        as="nav"
        position={["absolute", "static"]}
        display={[visible ? "block" : "none", "block"]}
        top="48px"
        bg="white"
        width="100%"
        overflow={["none", "auto"]}
      >
        <Box as="ul" listStyle="none">
          {data.map((props, index) => (
            <Box as="li" key={index}>
              <DocNavigationCategory
                key={index}
                id={index}
                opened={index === openedId}
                onToggleOpened={setOpenedId}
                onClick={toggleMenu}
                {...props}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default DocNavigation;

const CategoryButton = styled(HeadlessButton)(
  ({ active }: { active?: boolean }) =>
    css({
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: "100%",
      height: "56px",
      borderBottom: "1px solid",
      borderBottomColor: "lightest-gray",
      borderLeft: "4px solid",
      borderLeftColor: active ? "light-purple" : "white",
      color: active ? "dark-purple" : "gray",
      transition: transition([["color", "interaction"]]),
      "&:focus, &:hover, &:active": {
        cursor: "pointer",
        outline: "none",
        color: "light-purple",
      },
      [`&:focus ${StyledIcon}, &:hover ${StyledIcon}, &:active ${StyledIcon}`]:
        {
          color: "light-purple",
        },
      [`& ${StyledIcon}`]: {
        color: active ? "dark-purple" : "light-gray",
      },
    })
);

const NavigationLink = styled(Link)(
  ({ active, isSelected }: { active?: boolean; isSelected?: boolean }) =>
    css({
      position: "relative",
      display: "block",
      width: "100%",
      px: 3,
      fontSize: "13px",
      lineHeight: "lg",
      color: active ? "dark-purple" : "gray",
      fontWeight: active ? "bold" : "regular",
      textDecoration: "none",
      backgroundColor: isSelected ? "white" : "transpatent",
      "&:focus, &:hover, &:active": {
        outline: "none",
        bg: "white",
      },

      "& + ul": {
        display: active ? "block" : "none",
      },

      [`& ${EllipsisIcon}`]: {
        display: active ? "none" : "block",
      },
    })
);

const WrapperLevelMenu = styled(Box)(
  css({
    display: "none",

    "& a": {
      fontSize: "text-sm",
      lineHeight: "lg",
      pl: 5,
    },
  })
);

const StyledIcon = styled(Icon)(
  css({
    position: "absolute",
    right: 3,
    top: "50%",
    transition: transition([["color", "interaction"]]),
  }),
  all
);

const EllipsisIcon = styled(Icon)(
  css({
    position: "absolute",
    right: 3,
    top: "50%",
    transform: "translateY(-50%)",
    color: "light-gray",
  })
);
