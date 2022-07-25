import styles from "./InlineCode.module.css";

interface CodeWithVarProps {
  children: React.ReactNode;
}

export const InlineCode = ({ children }: CodeWithVarProps) => {
  return <code className={styles.code}>{children}</code>;
};
