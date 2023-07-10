import cn from "classnames";
import styles from "./Footer.module.css";

interface DocsFooterProps {
  section?: boolean;
  children?: React.ReactNode;
}

const DocsFooter = ({ children, section }: DocsFooterProps) => {
  return (
    <div className={cn(styles.wrapper, { [`${styles.section}`]: section })}>
      {children}
    </div>
  );
};

export default DocsFooter;
