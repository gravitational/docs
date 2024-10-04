import { clsx } from "clsx";

import styles from "./DropdownSection.module.css";

export interface DropdownMenuProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  titleLink?: boolean;
  href?: string;
  isImageLink?: boolean;
  childLength?: number;
  isFirst: boolean;
}

const DropdownSection = ({
  title,
  subtitle,
  children,
  titleLink = false,
  href = "/",
  isImageLink,
  childLength = 3,
  isFirst,
  className,
  ...props
}: DropdownMenuProps & React.HTMLAttributes<HTMLDivElement>) => {
  const textExists = title || subtitle ? true : false;
  return (
    <div
      className={clsx(
        styles.dropdownSection,
        isFirst && styles.first,
        className && className
      )}
      {...props}
    >
      {(title || subtitle) && (
        <div className={styles.titleWrapper}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={clsx(styles.sectionBox, textExists && styles.hasText)}>
        {children}
      </div>
    </div>
  );
};

export default DropdownSection;
