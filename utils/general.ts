/**
 * Handles command content to avoid newlines between dynamic
 * documentation variables while copying a command.
 * Includes both individual command and whole snippet copying handling.
 * There are newlines due to MDX rendering specifics
 * @param commandNode
 * @param copyWholeSnippit
 * @returns handled text with no extra new lines
 */
export const toCopyContent = (
  commandNode: HTMLElement,
  commandLineClasses: string[]
): string => {
  const lines = Array.from(
    commandNode.querySelectorAll(commandLineClasses.join(","))
  ).reduce((allLines, commandLine) => {
    allLines.push(commandLine.textContent);
    return allLines;
  }, []);
  return lines.join("\n");
};

/**
 * This function gets the name of the first level in the navigation tree.
 * For example, `getting-started/local-kubernetes/` => `getting-started`;
 * if a page comes with the path `/setup/operations/backup-restore/`, we get `setup`.
 * This function only gets the part of the path without the hostname
 * and documentation basePath (`goteleport.com/docs/`).
 * If it is not the current version, the path without hostname and documentation basePath
 * will contain `ver` and version number (`/ver/10.0/setup/operations/backup-restore/`).
 * So this function has an extra check to see if the path contains a version and avoid it.
 */
export const getFirstLvlNav = (locPath: string): string => {
  let firstLvlNav = locPath.split("/")[1];

  if (firstLvlNav === "ver") {
    firstLvlNav = locPath.split("/")[3];
  }

  return firstLvlNav;
};

/**
 * This function is a basic filter for XSS when form text is submitted.
 * Very simply, it just looks for the opening symbol of a script '<' tag.
 * If includes, then returns a blank string, otherwise returns the text.
 */
export const filterTextForXSS = (text: string): string => {
  if (text.includes("<")) {
    return "";
  }
  return text;
};
