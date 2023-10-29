
import type { CLI } from "../utils/cli";

export function watch(this: CLI) {
  console.log(this.context);
}
