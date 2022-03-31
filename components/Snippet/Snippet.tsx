import Pre from "components/MDX/Pre";
import styles from "./Snippet.module.css";

export interface SnippetProps {
  children: React.ReactNode;
}

export default function Snippet({ children }: SnippetProps) {
  return (
    <Pre className={styles.wrapper}>
      <div className={styles.scroll}>{children}</div>
    </Pre>
  );
}
