import cn from "classnames";
import { wrapper } from "./Code.css";

export type CodeProps = {
  children: React.ReactNode;
  className?: string;
};

export const Code = ({ children, className }: CodeProps) => {
  return <pre className={cn(wrapper, className)}>{children}</pre>;
};
