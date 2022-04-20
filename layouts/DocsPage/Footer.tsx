import { wrapper } from "./Footer.css";

interface DocsFooterProps {
  section: boolean;
  children: React.ReactNode;
}

const DocsFooter = ({ children, section }: DocsFooterProps) => {
  return <div className={wrapper({ section })}>{children}</div>;
};

export default DocsFooter;
