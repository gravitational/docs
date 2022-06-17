import { useRef, useState, useCallback, ReactNode } from "react";
import Icon from "components/Icon";
import HeadlessButton from "components/HeadlessButton";
import styles from "./Command.module.css";

const TIMEOUT = 1000;

export interface CommandLineProps {
  children: ReactNode;
}

export function CommandLine(props: CommandLineProps) {
  return <span className={styles.line} {...props} />;
}

export interface CommandCommentProps {
  children: ReactNode;
}

export function CommandComment(props: CommandCommentProps) {
  return <p className={styles.comment} {...props} />;
}

export interface CommandProps {
  children: ReactNode;
}

export default function Command({ children, ...props }: CommandProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const codeRef = useRef<HTMLDivElement>();

  const handleCopy = useCallback(() => {
    if (!navigator.clipboard) {
      return;
    }

    if (codeRef.current) {
      const rowTexts: string[] = [];
      for (const codeLine of Array.from(codeRef.current.children)) {
        for (const child of Array.from(codeLine.children)) {
          if (Array.from(child.classList)?.includes("wrapper-input")) {
            rowTexts.push(codeLine.innerText);
          }
        }
      }

      let procesedInnerText = codeRef.current.innerText;

      for (const initialText of rowTexts) {
        const newText = initialText.split("\n").join("");
        procesedInnerText = procesedInnerText.replace(initialText, newText);
      }

      navigator.clipboard.writeText(procesedInnerText);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, TIMEOUT);
    }
  }, []);

  return (
    <div {...props} ref={codeRef} className={styles.command}>
      <HeadlessButton onClick={handleCopy} className={styles.button}>
        {isCopied ? (
          <Icon size="sm" name="check" />
        ) : (
          <Icon size="sm" name="copy" />
        )}
      </HeadlessButton>
      {children}
    </div>
  );
}
