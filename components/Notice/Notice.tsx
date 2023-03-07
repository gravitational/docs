import { useMemo, useContext } from "react";
import Icon from "components/Icon";
import { DocsContext, getScopes } from "layouts/DocsPage/context";
import { ScopesType } from "layouts/DocsPage/types";
import cn from "classnames";
import styles from "./Notice.module.css";

const types = ["warning", "tip", "note", "danger"] as const;

const typeIcons = {
  note: "note",
  tip: "success",
  warning: "warning",
  danger: "error",
} as const;

type NoticeType = typeof types[number];

export interface NoticeProps {
  type: NoticeType;
  children: React.ReactNode;
  className?: string;
  icon?: boolean;
  scope?: ScopesType;
}

const Notice = ({
  type: baseType,
  children,
  className,
  icon = true,
  scope,
  ...props
}: NoticeProps) => {
  const type = baseType && types.includes(baseType) ? baseType : "tip";
  const iconName = typeIcons[type];
  const { scope: currentScope } = useContext(DocsContext);
  const scopes = useMemo(() => getScopes(scope), [scope]);

  const isHidden = scope && !scopes.includes(currentScope);

  return (
    <div
      className={cn(styles.wrapper, styles[type], className, {
        [`${styles.hidden}`]: isHidden,
      })}
    >
      {icon && <Icon name={iconName} className={styles.icon} />}
      <div className={styles.body}>{children}</div>
    </div>
  );
};

export default Notice;
