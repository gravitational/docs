const pushVars = (rowTexts: string[], command: HTMLElement[]) => {
  for (const commandLine of command) {
    for (const child of Array.from(commandLine.children)) {
      if (child.classList.contains("wrapper-input")) {
        rowTexts.push(commandLine.innerText);
      }
    }
  }
};

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
  copyWholeSnippit?: boolean
): string => {
  const rowTexts: string[] = [];

  if (copyWholeSnippit) {
    const code = commandNode.children[0];
    const snippet = code.children[0];
    for (const command of Array.from(snippet.children)) {
      const commandChildren = Array.from(command.children) as HTMLElement[];
      pushVars(rowTexts, commandChildren);
    }
  } else {
    const children = Array.from(commandNode.children) as HTMLElement[];
    pushVars(rowTexts, children);
  }

  let procesedInnerText = commandNode.innerText;

  for (const initialText of rowTexts) {
    const newText = initialText.split("\n").join("");
    procesedInnerText = procesedInnerText.replace(initialText, newText);
  }

  return procesedInnerText;
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
