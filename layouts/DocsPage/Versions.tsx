import cn from "classnames";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Dropdown } from "components/Dropdown";
import { splitPath, buildPath } from "utils/url";
import type { VersionsInfo } from "./types";
import styles from "./Versions.module.css";

const renderVersion = (version: string) => `Version ${version}`;

const Versions = ({
  current,
  latest,
  available,
  disabled,
  className,
}: VersionsInfo) => {
  const router = useRouter();
  const [currentItem, setCurrentItem] = useState<string>(current);
  const path = splitPath(router.asPath).path.split("/");
  console.log(path);
  let currentPage = "";
  if (path.includes("ver")) {
    currentPage = path.splice(3).join("/");
  } else {
    currentPage = path.join("/");
  }
  console.log(currentPage);

  const versions = useMemo(() => [...available].reverse(), [available]);
  console.log(latest);
  const navigateToVersion = useCallback(
    (version: string) => {
      const isLatest = version === latest;
      const href = `${isLatest ? "/" : `/ver/${version}/${currentPage}`}`;

      setCurrentItem(version);
      router.push(href);
    },
    [latest, router, currentPage]
  );

  useEffect(() => {
    setCurrentItem(current);
  }, [current]);

  return (
    <Dropdown
      className={cn(styles.wrapper, className)}
      value={currentItem}
      options={versions}
      disabled={disabled}
      onChange={navigateToVersion}
      renderOption={renderVersion}
    />
  );
};

export default Versions;
