import cn from "classnames";
import { useCallback, useContext } from "react";
import { RadioButton } from "components/RadioButton";
import { DocsContext } from "./context";
import type { ScopeType, ScopesInMeta } from "./types";
import type { IconName } from "components/Icon";
import type { RadioButtonVariant } from "components/RadioButton";
import styles from "./Scopes.module.css";
import Icon from "components/Icon";

interface ScopeDescription {
  value: ScopeType;
  icon: IconName;
  title: string;
  color: RadioButtonVariant;
}

const SCOPE_DESCRIPTIONS: Record<
  "oss" | "enterprise" | "cloud",
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
    color: "green",
  },
  cloud: {
    icon: "cloud2",
    value: "cloud",
    title: "Cloud",
    color: "blue",
  },
};

interface ScopesItemProps {
  scopeFeatures: ScopeDescription;
}

const ScopesItem = ({ scopeFeatures }: ScopesItemProps) => {
  return (
    <li className={styles.item}>
      <div className={styles.wrapper}>
        <span
          className={cn(styles.label, styles[`variant-${scopeFeatures.color}`])}
        >
          <Icon name={scopeFeatures.icon} className={styles.icon} />{" "}
          {scopeFeatures.title}
        </span>
      </div>
    </li>
  );
};

interface ScopesProps {
  scopes: ScopesInMeta;
  className?: string;
}

export const Scopes = ({ scopes, className }: ScopesProps) => {
  if (scopes[0] === "noScope" || scopes[0] === "") return <></>;

  // When initializing a ScopesItem from the scopes prop, filter out any scopes
  // that are invalid. This way, we retain compatibility with docs pages that
  // have a forScopes setting that includes a deprecated scope.
  const scopeItems = scopes?.reduce((accum, item) => {
    if (SCOPE_DESCRIPTIONS[item] !== undefined) {
      accum.push(
        <ScopesItem
          key={SCOPE_DESCRIPTIONS[item].value}
          scopeFeatures={SCOPE_DESCRIPTIONS[item]}
        />
      );
    }

    return accum;
  }, []);

  if (scopeItems.length === 0) {
    return <></>;
  }

  return (
    <ul className={cn(styles.list, className)}>
      <li className={styles.item}>
        <span className={cn(styles.label, styles["variant-availablefor"])}>
          Available for:
        </span>
      </li>
      {scopeItems}
    </ul>
  );
};
