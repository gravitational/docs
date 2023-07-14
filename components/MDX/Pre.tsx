import cn from "classnames";
import { useRef, useState, useCallback, ReactNode } from "react";
import Code from "components/Code";
import Icon from "components/Icon";
import HeadlessButton from "components/HeadlessButton";
import { toCopyContent } from "utils/general";
import styles from "./Pre.module.css";
import commandStyles from "../Command/Command.module.css";
import codeStyles from "../Code/Code.module.css";

const TIMEOUT = 1000;

interface CodeProps {
  children: ReactNode;
  className?: string;
}

const Pre = ({ children, className }: CodeProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const codeRef = useRef<HTMLDivElement>();
  const buttonRef = useRef<HTMLButtonElement>();

  const handleCopy = useCallback(() => {
    if (!navigator.clipboard) {
      return;
    }

    if (codeRef.current) {
      const copyText = codeRef.current.cloneNode(true) as HTMLElement;
      const descriptions = copyText.querySelectorAll("[data-type]");

      if (descriptions.length) {
        for (let i = 0; i < descriptions.length; i++) {
          descriptions[i].remove();
        }
      }

      document.body.appendChild(copyText);
      const processedInnerText = toCopyContent(copyText, [
        "." + commandStyles.line,
        "." + codeStyles.line,
        // Class name added by rehype-highlight to a `code` element when
        // highlighting syntax in code snippets
        ".hljs",
      ]);

      navigator.clipboard.writeText(processedInnerText);
      document.body.removeChild(copyText);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
        buttonRef.current?.blur();
      }, TIMEOUT);
    }
  }, []);

  return (
    <div className={cn(styles.wrapper, className)}>
      <HeadlessButton
        onClick={handleCopy}
        ref={buttonRef}
        className={styles.button}
        data-testid="copy-button-all"
      >
        <Icon name="copy" />
        {isCopied && <div className={styles.copied}>Copied!</div>}
      </HeadlessButton>
      <div ref={codeRef}>
        <Code className={styles.code}>{children}</Code>
      </div>
    </div>
  );
};

export default Pre;
