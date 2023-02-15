export interface DropdownMenuCTAProps {
  title: string;
  children: React.ReactNode;
}

const DropdownMenuCTA = ({ title, children }: DropdownMenuCTAProps) => {
  return (
    <div>
      {title && <h3>{title}</h3>}
      <div>{children}</div>
    </div>
  );
};

export default DropdownMenuCTA;
