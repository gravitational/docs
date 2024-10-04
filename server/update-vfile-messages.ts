/*
 ** Helper for adding linter errors to vfile for using with remark-lint
 */

import type { VFile } from "vfile";

interface UpdateMessagesOptions {
  vfile: VFile;
  startIndex: number;
  ruleId: string;
  source: string;
}

export default function updateMessages({
  vfile,
  startIndex,
  ruleId,
  source,
}: UpdateMessagesOptions) {
  let index = startIndex;

  while (index < vfile.messages.length) {
    const message = vfile.messages[index];

    message.ruleId = ruleId;
    message.source = source;
    message.fatal = true;

    index++;
  }
}
