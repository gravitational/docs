import cn from "classnames";
import { useContext, useEffect, useState, useMemo } from "react";
import HeadlessButton from "components/HeadlessButton";
import Icon from "components/Icon";
import { DocsContext, getScopes } from "layouts/DocsPage/context";
import { ScopesType } from "layouts/DocsPage/types";
import * as styles from "./Details.css";

export interface DetailsProps {
  scope?: ScopesType;
  title: string;
  opened?: boolean;
  scopeOnly: boolean;
  min: string;
  children: React.ReactNode;
}

export const Details = ({
  scope,
  scopeOnly = false,
  opened,
  title,
  min,
  children,
}: DetailsProps) => {
  const {
    scope: currentScope,
    versions: { current, latest },
  } = useContext(DocsContext);
  const scopes = useMemo(() => getScopes(scope), [scope]);
  const [isOpened, setIsOpened] = useState<boolean>(Boolean(opened));
  const isInCurrentScope = scopes.includes(currentScope);

  useEffect(() => {
    if (scopes.length) {
      setIsOpened(isInCurrentScope);
    }
  }, [scopes, isInCurrentScope]);

  const isCloudAndNotCurrent = scopes.includes("cloud") && current !== latest;
  const isHiddenInCurrentScope = scopeOnly && !isInCurrentScope;
  const isHidden = isCloudAndNotCurrent || isHiddenInCurrentScope;

  return (
    <div
      className={cn(
        styles.wrapper,
        isHidden && styles.hidden,
        isOpened && styles.opened
      )}
    >
      <HeadlessButton
        onClick={() => setIsOpened((value) => !value)}
        className={styles.header}
      >
        <Icon name="arrow" className={styles.icon} />
        <div className={styles.description}>
          <div className={styles.title}>{title}</div>
          {(scopes || min) && (
            <div className={styles.meta}>
              {scopes && (
                <div className={styles.scopes}>
                  {scopes.map((scope) => (
                    <div className={styles.scope} key={scope}>
                      {scope}
                    </div>
                  ))}
                </div>
              )}
              {min && <div className={styles.min}>VERSION {min}+</div>}
            </div>
          )}
        </div>
      </HeadlessButton>
      <div className={styles.body}>{children}</div>
    </div>
  );
};
