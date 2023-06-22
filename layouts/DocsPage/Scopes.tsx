import cn from "classnames";
import { useCallback, useContext } from "react";
import { RadioButton } from "components/RadioButton";
import { DocsContext } from "./context";
import type { ScopeType, ScopesInMeta } from "./types";
import type { IconName } from "components/Icon";
import type { RadioButtonVariant } from "components/RadioButton";
import styles from "./Scopes.module.css";

interface ScopeDescription {
  value: ScopeType;
  icon: IconName;
  title: string;
  color: RadioButtonVariant;
}

const SCOPE_DESCRIPTIONS: Record<
  "oss" | "enterprise" | "cloud" | "team",
  ScopeDescription
> = {
  oss: {
    icon: "code3",
    value: "oss",
    title: "OpenSource",
    color: "gray",
  },
  enterprise: {
    icon: "building2",
    value: "enterprise",
    title: "Enterprise",
    color: "gray",
  },
  cloud: {
    icon: "cloud2",
    value: "cloud",
    title: "Cloud",
    color: "gray",
  },
  team: {
    icon: "users",
    value: "team",
    title: "Team",
    color: "gray",
  },
};

interface ScopesItemProps {
  scopeFeatures: ScopeDescription;
  currentScope: ScopeType;
}

const ScopesItem = ({ scopeFeatures, currentScope }: ScopesItemProps) => {
  return (
    <li className={styles.item}>
      <RadioButton
        variant={scopeFeatures.color}
        className={styles.button}
        name="scope"
        id={scopeFeatures.value}
        value={scopeFeatures.value}
        label={scopeFeatures.title}
        icon={scopeFeatures.icon}
        checked={scopeFeatures.value === currentScope}
      />
    </li>
  );
};

interface ScopesProps {
  scopes: ScopesInMeta;
  className?: string;
}

export const Scopes = ({ scopes, className }: ScopesProps) => {
  const { scope, setScope } = useContext(DocsContext);

  const onChange = useCallback(
    (event) => {
      setScope(event.target.value);
    },
    [setScope]
  );

  if (scopes[0] === "noScope" || scopes[0] === "") return <></>;

  const scopeItems = scopes?.map((item) => (
    <ScopesItem
      key={SCOPE_DESCRIPTIONS[item].value}
      scopeFeatures={SCOPE_DESCRIPTIONS[item]}
      currentScope={scope}
    />
  ));

  return (
    <ul className={cn(styles.list, className)} onChange={onChange}>
      {scopeItems}
    </ul>
  );
};
