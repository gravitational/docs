import type {
  DetailedHTMLProps,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
} from "react";

import { clsx } from "clsx";

import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "secondary-white";
export type ButtonShape = "sm" | "md" | "lg" | "outline";

export interface BaseProps {
  variant?: ButtonVariant | ButtonVariant[];
  shape?: ButtonShape | ButtonShape[];
}

type DefaultButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type DefaultAnchorProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

type ButtonProps = BaseProps & DefaultButtonProps & { as: "button" };
type AnchorProps = BaseProps & DefaultAnchorProps & { as: "link" };

const Button = ({
  as = "button",
  variant = "primary",
  shape = "md",
  className,
  ...restProps
}: ButtonProps | AnchorProps) => {
  const props = {
    ...restProps,
    className: clsx(
      styles.wrapper,
      styles[`variant-${variant}`],
      styles[`shape-${shape}`],
      className
    ),
  };

  if (as === "link") {
    return <a {...(props as DefaultAnchorProps)} />;
  }

  return <button {...(props as DefaultButtonProps)} />;
};

export default Button;
