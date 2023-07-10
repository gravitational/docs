import { useRef, useState, useCallback, ReactNode } from "react";
import Icon from "components/Icon";
import HeadlessButton from "components/HeadlessButton";
import { toCopyContent } from "utils/general";
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
      const procesedInnerText = toCopyContent(codeRef.current, [
        "." + styles.line,
      ]);

      navigator.clipboard.writeText(procesedInnerText);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, TIMEOUT);
    }
  }, []);

  return (
    <div {...props} ref={codeRef} className={styles.command}>
      <HeadlessButton
        onClick={handleCopy}
        className={styles.button}
        data-testid="copy-button"
      >
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
