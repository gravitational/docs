import cn from "classnames";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Dropdown } from "components/Dropdown";
import type { VersionsInfo, VersionsDropdown } from "./types";
import styles from "./Versions.module.css";

// renders strikethrough for deprecated versions
const RenderVersion = (version: VersionsDropdown) => {
  if (version.deprecated) return <s>Version {version.value}</s>;

  if (version.value === "Older Versions") return version.value;
  else return `Version ${version.value}`;
};

// renders the default box selection
const pickOption = (options: VersionsDropdown[], id: string) =>
  options.find(({ value }) => value === id);

// assigns keys and values based on the value prop
const pickId = ({ value }: VersionsDropdown) => value;

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

  const latestNumber: number = Math.floor(+latest);
  const validVersion = useCallback(
    (num: number) => {
      return num >= latestNumber - 2 ? true : false;
    },
    [latestNumber]
  );

  const versions = useMemo(() => {
    //creates list of versions ultimately from config.json
    const versionNames = [...available].reverse();

    //assigns versions a deprecated status: boolean
    const versionsList = versionNames.map((version) => {
      const versionNumber: number = +version;

      const versionInfo: VersionsDropdown = {
        value: version,
        deprecated: !validVersion(versionNumber),
      };
      return versionInfo;
    });

    //adds an Older Versions element
    versionsList.push({
      value: "Older Versions",
      deprecated: false,
    });
    return versionsList;
  }, [available, validVersion]);

  // only fires when dropdown selection is changed
  const navigateToVersion = useCallback(
    (option: string) => {
      // if version is deprecated or Older Versions is selected, redirect to /older-versions
      if (!validVersion(+option)) {
        setCurrentItem(option);
        router.push("/older-versions");
        return;
      }

      if (option === "Older Versions") {
        setCurrentItem(option);
        router.push("/older-versions");
        return;
      }

      //otherwise, load selected version
      else {
        const href = getNewVersionPath(option);
        setCurrentItem(option);
        router.push(href);
      }
    },
    [getNewVersionPath, router, validVersion]
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
      renderOption={RenderVersion}
      pickOption={pickOption}
      pickId={pickId}
    />
  );
};

export default Versions;
