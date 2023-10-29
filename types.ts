import { CLI } from "./bin/utils/cli";

declare global {
  var CLI: CLI;
}

export type Args = string[];
export type Flags = string[][];
export type StdWriter = { highWaterMark: number | undefined };
export type ConfigRecord = {
  themeid: number;
  storefront: string;
  password: string;
  directory: string;
  api: string;
}
