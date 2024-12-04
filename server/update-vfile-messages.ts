/*
 ** Helper for adding linter errors to vfile for using with remark-lint
 */

import type { VFile } from "vfile";

interface UpdateMessagesOptions {
  vfile: VFile;
  startIndex: number;
  ruleId: string;
}

export default function updateMessages({
  vfile,
  startIndex,
  ruleId,
}: UpdateMessagesOptions) {
  let index = startIndex;

  while (index < vfile.messages.length) {
    const message = vfile.messages[index];

    message.ruleId = ruleId;
    message.fatal = true;

    index++;
  }
}
