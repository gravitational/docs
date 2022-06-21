import cn from "classnames";
import { useRef, useState, useCallback, ReactNode } from "react";
import Code from "components/Code";
import Icon from "components/Icon";
import HeadlessButton from "components/HeadlessButton";
import styles from "./Pre.module.css";

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

      const rowTexts: string[] = [];
      const code = Array.from(copyText.children)[0];
      const snippet = Array.from(code.children)[0];

      for (const command of Array.from(snippet.children)) {
        for (const commandLine of Array.from(command.children)) {
          for (const child of Array.from(commandLine.children)) {
            if (child.classList.contains("wrapper-input")) {
              rowTexts.push(commandLine.innerText);
            }
          }
        }
      }

      let procesedInnerText = copyText.innerText;

      for (const initialText of rowTexts) {
        console.log("замена");
        const newText = initialText.split("\n").join("");
        procesedInnerText = procesedInnerText.replace(initialText, newText);
      }

      // navigator.clipboard.writeText(copyText.innerText);
      navigator.clipboard.writeText(procesedInnerText);
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
