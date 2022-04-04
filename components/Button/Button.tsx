import {
  DetailedHTMLProps,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
} from "react";
import cn from "classnames";
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
  as,
  variant,
  shape,
  className,
  ...restProps
}: ButtonProps | AnchorProps) => {
  const props = {
    ...restProps,
    className: cn(
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

Button.defaultProps = {
  variant: "primary",
  shape: "md",
  as: "button",
};

export default Button;
