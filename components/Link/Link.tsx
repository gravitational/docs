import cn from "classnames";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { isHash, isExternalLink, isLocalAssetFile } from "utils/url";
import { useNormalizedHref } from "./hooks";
import styles from "./Link.module.css";
import { TrackingEvent } from "utils/tracking";

export interface LinkProps extends Omit<NextLinkProps, "href"> {
  passthrough?: boolean;
  scheme?: string;
  className?: string;
  href: string;
  onClick?: (e?: any) => void;
  children: React.ReactNode;
}

const Link = ({
  children,
  href,
  className,
  as,
  replace,
  scroll,
  shallow,
  passthrough,
  prefetch,
  locale,
  scheme,
  onClick,
  ...linkProps
}: LinkProps) => {
  const normalizedHref = useNormalizedHref(href);
  if (
    passthrough ||
    isHash(normalizedHref) ||
    isLocalAssetFile(normalizedHref)
  ) {
    return (
      <a
        href={href}
        {...linkProps}
        className={cn(styles.wrapper, styles[scheme], className)}
      >
        {children}
      </a>
    );
  }

  if (isExternalLink(normalizedHref)) {
    return (
      <a
        href={normalizedHref}
        target="_blank"
        rel="noopener noreferrer"
        {...linkProps}
        className={cn(styles.wrapper, styles[scheme], className)}
      >
        {children}
      </a>
    );
  }

  // At this point, we return Link from the next/link package
  const nextProps: NextLinkProps = {
    ...linkProps,
    href: normalizedHref,
    as,
    replace,
    scroll,
    shallow,
    prefetch,
    locale,
  };

  return (
    <NextLink
      {...nextProps}
      prefetch={false}
      onClick={(e) => {
        TrackingEvent("internal_link_click", {
          title: e.currentTarget.innerHTML || "",
          href: href,
        });
        onClick && onClick(e);
      }}
      className={cn(styles.wrapper, styles[scheme], className)}
    >
      {children}
    </NextLink>
  );
};

export default Link;
