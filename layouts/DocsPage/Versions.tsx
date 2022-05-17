import cn from "classnames";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Dropdown } from "components/Dropdown";
import type { VersionsInfo, VersionsDropdown } from "./types";
import styles from "./Versions.module.css";

// const renderVersion = (version: string) => `Version ${version}`;
const RenderVersion = (version: VersionsDropdown) => {
  if (version.deprecated) return <strike>Version {version.value}</strike>;

  if (version.value === "Older Versions") return version.value;
  else return `Version ${version.value}`;
};

const pickOption = (options: VersionsDropdown[], id: string) =>
  options.find(({ value }) => value === id);

const Versions = ({
  current,
  available,
  disabled,
  className,
  getNewVersionPath,
  latest,
}: VersionsInfo) => {
  const router = useRouter();
  const [currentItem, setCurrentItem] = useState<string>(current);
  // const versions = useMemo(() => [...available].reverse(), [available]);

  const latestNumber: number = Math.floor(+latest);
  const validVersion = useCallback(
    (num: number) => {
      return num >= latestNumber - 2 ? false : true;
    },
    [latestNumber]
  );

  const versions = useMemo(() => {
    const versionNames = [...available].reverse();

    const versionsList = versionNames.map((version) => {
      const versionNumber: number = +version;

      const versionInfo: VersionsDropdown = {
        value: version,
        deprecated: validVersion(versionNumber),
      };
      return versionInfo;
    });
    versionsList.push({
      value: "Older Versions",
      deprecated: false,
    });
    return versionsList;
  }, [available, validVersion]);

  const navigateToVersion = useCallback(
    // (version: string) => {
    //   const href = getNewVersionPath(version);

    //   setCurrentItem(version);
    //   router.push(href);
    // },
    (version: VersionsDropdown) => {
      if (version.deprecated) router.push("/older-versions");
      else if (version.value === "Older Versions")
        router.push("/older-versions");
      else {
        const href = getNewVersionPath(version.value);

        setCurrentItem(version.value);
        router.push(href);
      }
    },

    [getNewVersionPath, router]
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
      // renderOption={renderVersion}
      renderOption={RenderVersion}
      pickOption={pickOption}
    />
  );
};

export default Versions;
