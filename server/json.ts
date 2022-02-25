import { existsSync, readFileSync } from "fs";

export const loadJson = <T = Record<string, unknown>>(path: string) => {
  if (existsSync(path)) {
    const content = readFileSync(path, "utf-8");

    return JSON.parse(content) as T;
  } else {
    throw Error(`File ${path} does not exists.`);
  }
};
