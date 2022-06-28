const pushVars = (rowTexts: string[], command: HTMLElement[]) => {
  for (const commandLine of command) {
    for (const child of Array.from(commandLine.children)) {
      if (child.classList.contains("wrapper-input")) {
        rowTexts.push(commandLine.innerText);
      }
    }
  }
};

export const returnCopiedCommand = (
  currentRef: HTMLElement,
  isGeneralCopying?: boolean
) => {
  const rowTexts: string[] = [];

  if (isGeneralCopying) {
    const code = currentRef.children[0];
    const snippet = code.children[0];
    for (const command of Array.from(snippet.children)) {
      const commandChildren = Array.from(command.children) as HTMLElement[];
      pushVars(rowTexts, commandChildren);
    }
  } else {
    const children = Array.from(currentRef.children) as HTMLElement[];
    pushVars(rowTexts, children);
  }

  let procesedInnerText = currentRef.innerText;

  for (const initialText of rowTexts) {
    const newText = initialText.split("\n").join("");
    procesedInnerText = procesedInnerText.replace(initialText, newText);
  }

  return procesedInnerText;
};
