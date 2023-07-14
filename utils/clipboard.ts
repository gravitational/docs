// replaceClipboardWithCopyBuffer replaces the global clipboard with an object
// that contains a string property that components can copy to. Tests can
// retrieve the string property to check the contents of the clipboard.
export const replaceClipboardWithCopyBuffer = () => {
  Object.assign(navigator.clipboard, {
    buffer: "",
    writeText: (txt) => {
      (navigator.clipboard as any).buffer = txt;
    },
    readText: (txt) => {
      return (navigator.clipboard as any).buffer;
    },
  });
};
