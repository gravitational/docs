import cn from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { wrapper } from "./Code.css";

const isHLJSNode = (className?: string) =>
  Boolean(className) && className.indexOf("hljs") !== -1;

const Code = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
) => {
  if (isHLJSNode(props.className)) {
    return <code {...props} />;
  }

  return <code {...props} className={cn(wrapper, props.className)} />;
};

export default Code;
