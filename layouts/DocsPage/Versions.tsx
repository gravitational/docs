import cn from "classnames";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Dropdown } from "components/Dropdown";
import type { VersionsInfo, VersionsDropdown } from "./types";
import styles from "./Versions.module.css";

// renders strikethrough for deprecated versions
const renderVersion = (version: VersionsDropdown) => {
  if (version.value === "edge") {
    return "Edge version";
  }
  if (version.deprecated) return <s>Version {version.value}</s>;

  if (version.value === "Older Versions") return version.value;
  return `Version ${version.value}`;
};

// renders the default box selection
const pickOption = (options: VersionsDropdown[], id: string) =>
  options.find(({ value }) => value === id);

// assigns component key and id props based on the value string
const pickId = ({ value }: VersionsDropdown) => value;

const validVersion = (thisVersion: string, latestVersion: string) => {
  const majorVersionRe = new RegExp("^[0-9]+");
  const currentMajorVersion = majorVersionRe.exec(thisVersion);
  const latestMajorVersion = majorVersionRe.exec(latestVersion);

  if (thisVersion === "edge") {
    return true;
  }

  // Can't calculate validity, so the version is invalid. This happens, e.g.,
  // if we're dealing with a dropdown option like "Older Versions".
  if (currentMajorVersion == null || latestMajorVersion == null) {
    return false;
  }

  return Number(currentMajorVersion[0]) >= Number(latestMajorVersion[0]) - 2
    ? true
    : false;
};

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

  const versions = useMemo(() => {
    //creates list of versions ultimately from config.json
    const versionNames = [...available].reverse();

    //assigns versions a deprecated status: boolean
    const versionsList = versionNames.map((version) => {
      const versionInfo: VersionsDropdown = {
        value: version,
        deprecated: !validVersion(version, latest),
      };
      return versionInfo;
    });

    //adds an Older Versions element
    versionsList.push({
      value: "Older Versions",
      deprecated: false,
    });

    return versionsList;
  }, [available, latest]);

  // only fires when dropdown selection is changed
  const navigateToVersion = useCallback(
    (option: string) => {
      // if version is deprecated or Older Versions is selected, redirect to /older-versions
      if (!validVersion(option, latest)) {
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
        let href = getNewVersionPath(option);
        setCurrentItem(option);

        // prevents redirection to different versions of /older-versions/
        if (href.includes("older-versions"))
          href = href.replace("older-versions", "");

        router.push(href);
      }
    },
    [getNewVersionPath, router, latest]
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
      pickOption={pickOption}
      pickId={pickId}
      bgColor="purple"
    />
  );
};

export default Versions;
