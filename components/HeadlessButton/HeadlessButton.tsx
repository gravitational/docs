import cn from "classnames";
import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";
import styles from "./HeadlessButton.module.css";

export const HeadlessButton = ({
  className,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return <button {...props} className={cn(styles.wrapper, className)} />;
};

export default HeadlessButton;
