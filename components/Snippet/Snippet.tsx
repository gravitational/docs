import Pre from "components/MDX/Pre";
import * as styles from "./Snippet.css";

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
