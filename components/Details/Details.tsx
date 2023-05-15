import cn from "classnames";
import { useContext, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import HeadlessButton from "components/HeadlessButton";
import Icon from "components/Icon";
import { DocsContext, getScopes } from "layouts/DocsPage/context";
import { getAnchor } from "utils/url";
import styles from "./Details.module.css";

const transformTitleToAnchor = (title: string): string => {
  return title
    .replace(/[&\/\\#,+()$~%.'":*?<>{}^;\d]/g, "")
    .replace(/\s/g, "-")
    .replace(/-$/, "")
    .toLowerCase();
};

export interface DetailsProps {
  scope?: string | string[];
  title: string;
  opened?: boolean;
  scopeOnly: boolean;
  min: string;
  children: React.ReactNode;
}

export const Details = ({
  scope,
  scopeOnly = false,
  opened = false,
  title,
  min,
  children,
}: DetailsProps) => {
  const {
    scope: currentScope,
    versions: { current, latest },
  } = useContext(DocsContext);
  const router = useRouter();
  const scopes = useMemo(() => getScopes(scope), [scope]);
  const [isOpened, setIsOpened] = useState(opened);
  const isInCurrentScope = scopes.includes(currentScope);
  const detailsId = title ? transformTitleToAnchor(title) : "title";
  const anchorInPath = getAnchor(router.asPath);

  useEffect(() => {
    if (scopes.length) {
      setIsOpened(isInCurrentScope);
    }
  }, [scopes, isInCurrentScope]);

  useEffect(() => {
    if (anchorInPath === detailsId) {
      setIsOpened(true);
    }
  }, [anchorInPath, detailsId]);

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
      id={isHidden ? undefined : detailsId}
    >
      <HeadlessButton
        onClick={() => setIsOpened((value) => !value)}
        className={styles.header}
      >
        <Icon name="arrow" className={styles.icon} />
        <div className={styles.description}>
          <div className={styles.title}>{title}</div>
          {(scope || min) && (
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
        <a className={styles.anchor} href={`#${detailsId}`} />
      </HeadlessButton>
      <div className={styles.body}>{children}</div>
    </div>
  );
};
