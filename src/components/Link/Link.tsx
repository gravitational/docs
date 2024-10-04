import { clsx } from "clsx";
import type { DetailedHTMLProps, AnchorHTMLAttributes } from "react";

import { isExternalLink } from "../../utils/url";

import styles from "./Link.module.css";

type DefaultAnchorProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export interface LinkProps extends DefaultAnchorProps {
  passthrough?: boolean;
  scheme?: string;
  className?: string;
  href: string;
  onClick?: (e?: any) => void;
  children: React.ReactNode;
}

const externalProps = { target: "_blank", rel: "noopener noreferrer" };

const Link = ({
  children,
  scheme,
  href,
  className,
  ...linkProps
}: LinkProps) => {
  const fullProps = isExternalLink(href)
    ? { ...linkProps, ...externalProps }
    : linkProps;

  return (
    <a
      {...fullProps}
      href={href}
      className={clsx(styles.wrapper, styles[scheme], className)}
    >
      {children}
    </a>
  );
};

export default Link;
