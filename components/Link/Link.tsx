import styled from "styled-components";
import { ComponentProps } from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { isHash, isExternalLink, isLocalAssetFile } from "utils/url";
import { all, variant, transition, StyledSystemProps } from "components/system";
import { useNormalizedHref } from "./hooks";

const BaseLink = styled("a")<StyledSystemProps>(
  {
    boxSizing: "border-box",
    minWidth: 0,
    transition: transition([["color", "interaction"]]),
  },
  variant({
    prop: "scheme",
    variants: {
      docs: {
        color: "note",
        "&:visited": {
          color: "dark-purple",
        },
        "&:hover, &:active, &:focus": {
          color: "light-purple",
        },
      },
      site: {
        color: "dark-purple",
        "&:visited": {
          color: "dark-purple",
        },
        "&:hover, &:active, &:focus": {
          color: "light-purple",
        },
      },
      comment: {
        color: "inherit",
        "&:hover, &:active, &:focus": {
          opacity: 0.5,
        },
      },
      white: {
        color: "white",
        "&:hover, &:active, &:focus": {
          opacity: 0.8,
        },
      },
      termsPurple: {
        color: "white",
        textDecoration: "underline",
        cursor: "pointer",
        transition: transition([["color", "interaction"]]),
        "&:hover": {
          color: "white",
        },
        "&:focus, &:active": {
          color: "white",
          outline: "none",
        },
      },
      termsWhite: {
        color: "gray",
        textDecoration: "underline",
        cursor: "pointer",
        transition: transition([["color", "interaction"]]),
        "&:hover": {
          color: "purple",
        },
        "&:focus, &:active": {
          color: "purple",
          outline: "none",
        },
      },
    },
  }),
  all
);

export type LinkProps = {
  passthrough?: boolean;
} & Omit<NextLinkProps, "href"> &
  ComponentProps<typeof BaseLink>;

const Link = ({
  children,
  href,
  as,
  replace,
  scroll,
  shallow,
  passthrough,
  prefetch,
  locale,
  ...linkProps
}: LinkProps) => {
  const normalizedHref = useNormalizedHref(href);

  if (
    passthrough ||
    isHash(normalizedHref) ||
    isLocalAssetFile(normalizedHref)
  ) {
    return (
      <BaseLink href={normalizedHref} {...linkProps}>
        {children}
      </BaseLink>
    );
  } else if (isExternalLink(normalizedHref)) {
    return (
      <BaseLink
        href={normalizedHref}
        target="_blank"
        rel="noopener noreferrer"
        {...linkProps}
      >
        {children}
      </BaseLink>
    );
  }

  const nextProps: NextLinkProps = {
    href: normalizedHref,
    as,
    replace,
    scroll,
    shallow,
    prefetch,
    locale,
  };

  return (
    <NextLink {...nextProps} passHref={true}>
      <BaseLink {...linkProps}>{children}</BaseLink>
    </NextLink>
  );
};

export default Link;
