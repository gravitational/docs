import cn from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import styles from "./Code.module.css";

const isHLJSNode = (className?: string) =>
  Boolean(className) && className.indexOf("hljs") !== -1;

const Code = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
) => {
  if (isHLJSNode(props.className)) {
    return <code {...props} />;
  }

  return <code {...props} className={cn(styles.wrapper, props.className)} />;
};

export default Code;
