import cn from "classnames";
import { useContext } from "react";
import Icon, { IconName } from "components/Icon";
import { Dropdown } from "components/Dropdown";
import { DocsContext } from "./context";
import { ScopeType } from "./types";
import * as styles from "./Scopes.css";

interface Option {
  value: ScopeType;
  icon: IconName;
  title: string;
}

const options: Option[] = [
  {
    icon: "code",
    value: "oss",
    title: "OpenSource",
  },
  {
    icon: "building",
    value: "enterprise",
    title: "Enterprise",
  },
  {
    icon: "clouds",
    value: "cloud",
    title: "Cloud",
  },
];

interface ScopesItemProps {
  icon: IconName;
  children: React.ReactNode;
}

const ScopesItem = ({ icon, children }: ScopesItemProps) => {
  return (
    <div className={styles.item}>
      <Icon name={icon} className={styles.icon} />
      {children}
    </div>
  );
};

const renderScope = (scope: Option) => (
  <ScopesItem icon={scope.icon}>{scope.title}</ScopesItem>
);

const pickId = ({ value }: Option) => value;
const pickOption = (options: Option[], id: string) =>
  options.find(({ value }) => value === id);

export const Scopes = ({ className }: { className?: string }) => {
  const { scope, setScope } = useContext(DocsContext);

  return (
    <Dropdown
      className={cn(styles.wrapper, className)}
      value={scope}
      options={options}
      onChange={setScope}
      renderOption={renderScope}
      pickId={pickId}
      pickOption={pickOption}
    />
  );
};
