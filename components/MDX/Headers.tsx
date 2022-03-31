import cn from "classnames";
import styles from "./Headers.module.css";

export const H1 = ({ children, ...props }) => (
  <h1 className={cn(styles.wrapper, styles.h1)} {...props}>
    {children} <a className={styles.anchor} href={`#${props.id}`} />
  </h1>
);

export const H2 = ({ children, ...props }) => (
  <h2 className={cn(styles.wrapper, styles.h2)} {...props}>
    {children} <a className={styles.anchor} href={`#${props.id}`} />
  </h2>
);

export const H3 = ({ children, ...props }) => (
  <h3 className={cn(styles.wrapper, styles.h3)} {...props}>
    {children} <a className={styles.anchor} href={`#${props.id}`} />
  </h3>
);

export const H4 = ({ children, ...props }) => (
  <h4 className={cn(styles.wrapper, styles.h4)} {...props}>
    {children} <a className={styles.anchor} href={`#${props.id}`} />
  </h4>
);

export const H5 = ({ children, ...props }) => (
  <h5 className={cn(styles.wrapper, styles.h5)} {...props}>
    {children} <a className={styles.anchor} href={`#${props.id}`} />
  </h5>
);
