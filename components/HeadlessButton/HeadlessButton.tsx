import { forwardRef, RefObject } from "react";
import cn from "classnames";
import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";
import styles from "./HeadlessButton.module.css";

// eslint-disable-next-line react/display-name
export const HeadlessButton = forwardRef(
  (
    {
      className,
      ...props
    }: DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    ref: RefObject<HTMLButtonElement>
  ) => {
    return (
      <button {...props} className={cn(styles.wrapper, className)} ref={ref} />
    );
  }
);

export default HeadlessButton;
