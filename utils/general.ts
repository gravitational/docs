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

export const findFirstLvlNav = (locPath: string): string => {
  let firstLvlNav = locPath.split("/")[1];

  if (firstLvlNav === "ver") {
    firstLvlNav = locPath.split("/")[3];
  }

  return firstLvlNav;
};
