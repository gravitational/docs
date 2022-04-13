import {
  DetailedHTMLProps,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
} from "react";
import cn from "classnames";
import { wrapper, ButtonVariants } from "./Button.css";

type DefaultButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type DefaultAnchorProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

type ButtonProps = ButtonVariants & DefaultButtonProps & { as: "button" };
type AnchorProps = ButtonVariants & DefaultAnchorProps & { as: "link" };

const Button = ({
  as,
  variant,
  shape,
  className,
  ...restProps
}: ButtonProps | AnchorProps) => {
  const props = {
    ...restProps,
    className: cn(wrapper({ variant, shape }), className),
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
