import cn from "classnames";
import { useContext } from "react";
import Icon from "components/Icon";
import { Dropdown } from "components/Dropdown";
import { RadioButton } from "components/RadioButton";
import { DocsContext } from "./context";
import type { ScopeType } from "./types";
import type { IconName } from "components/Icon";
import type { RadioButtonVariant } from "components/RadioButton";
import styles from "./Scopes.module.css";

interface Option {
  value: ScopeType;
  icon: IconName;
  title: string;
  color: RadioButtonVariant;
}

const options: Option[] = [
  {
    icon: "code3",
    value: "oss",
    title: "OpenSource",
    color: "gray",
  },
  {
    icon: "building2",
    value: "enterprise",
    title: "Enterprise",
    color: "green",
  },
  {
    icon: "cloud2",
    value: "cloud",
    title: "Cloud",
    color: "blue",
  },
];

interface ScopesItemProps {
  scope: Option;
}

const ScopesItem = ({ scope }: ScopesItemProps) => {
  return (
    <li className={styles.item}>
      <RadioButton
        variant={scope.color}
        className={styles.button}
        name="scope"
        id={scope.value}
        value={scope.value}
        label={scope.title}
        icon={scope.icon}
      />
    </li>
  );
};

// const renderScope = (scope: Option) => (
//   <ScopesItem icon={scope.icon}>{scope.title}</ScopesItem>
// );

const pickId = ({ value }: Option) => value;
const pickOption = (options: Option[], id: string) =>
  options.find(({ value }) => value === id);

export const Scopes = ({ className }: { className?: string }) => {
  const { scope, setScope } = useContext(DocsContext);

  return (
    // <Dropdown
    //   className={cn(styles.wrapper, className)}
    //   value={scope}
    //   options={options}
    //   onChange={setScope}
    //   renderOption={renderScope}
    //   pickId={pickId}
    //   pickOption={pickOption}
    // />
    <ScopesItem scope={options[0]} />
  );
};
