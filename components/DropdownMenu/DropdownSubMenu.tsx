import DropdownMenuItem from "./DropdownMenuItem";
export interface DropdownMenuProps {
  title: string;
  children: React.ReactNode;
  titleLink?: boolean;
  href?: string;
}

const DropdownSubMenu = ({
  title,
  children,
  titleLink = false,
  href = "/",
}: DropdownMenuProps) => {
  return (
    <div>
      {title && titleLink ? (
        <DropdownMenuItem href={href} title={title} description="" />
      ) : (
        title && <h3>{title}</h3>
      )}
      <div>{children}</div>
    </div>
  );
};

export default DropdownSubMenu;
