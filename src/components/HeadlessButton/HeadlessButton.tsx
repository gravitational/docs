import type { DetailedHTMLProps, ButtonHTMLAttributes } from "react";
import { forwardRef, RefObject } from "react";
import { clsx } from "clsx";

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
      <button
        {...props}
        className={clsx(styles.wrapper, className)}
        ref={ref}
      />
    );
  }
);

export default HeadlessButton;
