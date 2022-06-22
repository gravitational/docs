const pushVars = (command: HTMLElement[], rowTexts: string[]) => {
  for (const commandLine of Array.from(command)) {
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
    const code = Array.from(currentRef.children)[0];
    const snippet = Array.from(code.children)[0];
    for (const command of Array.from(snippet.children)) {
      const commandChildren = Array.from(command.children) as HTMLElement[];
      pushVars(commandChildren, rowTexts);
    }
  } else {
    const children = Array.from(currentRef.children) as HTMLElement[];
    pushVars(children, rowTexts);
  }

  let procesedInnerText = currentRef.innerText;

  for (const initialText of rowTexts) {
    const newText = initialText.split("\n").join("");
    procesedInnerText = procesedInnerText.replace(initialText, newText);
  }

  return procesedInnerText;
};
