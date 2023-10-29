import type { CLI } from "../utils/cli";
import { stdout } from "../utils/utils";

export function help(this: CLI): void {
  return stdout(
`Usage: mango [subcommand] [flags]\n
Commands:
  ${this.commands.map((command) => `${command.command}      ${command.description}\n`)}
`);
}
