import cn from "classnames";
import { useContext, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import HeadlessButton from "components/HeadlessButton";
import Icon from "components/Icon";
import { DocsContext } from "layouts/DocsPage/context";
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
  min: string;
  children: React.ReactNode;
}

export const Details = ({
  scope,
  opened = false,
  title,
  min,
  children,
}: DetailsProps) => {
  const {
    versions: { current, latest },
  } = useContext(DocsContext);
  const router = useRouter();
  const [isOpened, setIsOpened] = useState(opened);
  const detailsId = title ? transformTitleToAnchor(title) : "title";
  const anchorInPath = getAnchor(router.asPath);

  useEffect(() => {
    if (anchorInPath === detailsId) {
      setIsOpened(true);
    }
  }, [anchorInPath, detailsId]);

  return (
    <div
      className={cn(styles.wrapper, isOpened && styles.opened)}
      id={detailsId}
    >
      <HeadlessButton
        onClick={() => setIsOpened((value) => !value)}
        className={styles.header}
      >
        <Icon name="arrow" className={styles.icon} />
        <div className={styles.description}>
          <div className={styles.title}>{title}</div>
          {min && (
            <div className={styles.meta}>
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
