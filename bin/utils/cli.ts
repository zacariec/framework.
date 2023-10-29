import { help } from "../commands/help";
import { stderr } from "./utils";

type Args = string[];
type Flags = string[][];

interface ICli {
  _pathToBun: string;
  _pathToExecutable: string;
  command: string;
  commands: Command[];
  run: (arg0?: string, arg1?: (...args: any) => any) => void;
}

export class CLI implements ICli {
  args: Args;
  _pathToBun: string;
  _pathToExecutable: string;
  command: string;
  flags: Flags;
  commands: Command[];
  subcommand: string;
  params: string[];

  constructor(args: Args) {
    this.args = args;
    this._pathToBun = this.args[0];
    this._pathToExecutable = this.args[1];
    this.command = this.args[2];
    this.commands = [];
    this.params = args.splice(3);
    this.subcommand = this.params[0];
    this.flags = this.params
      .filter((flag) => flag.substring(0, 1) === "-")
      .filter(Boolean)
      .map((flag) => flag.split("="));

    this.commands.push(new Command("help", help, "Displays a list of commands supported by mango"));
  }


  /**
   * Registers a command to an array of commands on the constructor.
   * @param command - The Command class to register
   * @returns this
   */
  add(command: Command): this {
    this.commands.push(command);
    return this;
  }

  /**
   * Runs the invoked CLI, checking against commands that have been
   * registered into the constructor.
   * @returns Command | Cli - returns the Command if found or the CLI instance - this is useless
   */
  run(): Command | this {
    if (this.command !== "mango") {
      stderr(`Use "mango" to invoke mango actions.`);
      return this;
    }

    if (this.commands.length === 0) {
      stderr(
        "No commands configured, register commands against the constructed class."
      );
      return this;
    }

    const command = this.commands.find(
      (command) => command.command === this.subcommand
    );

    if (!command) {
      stderr(`Command "${this.subcommand}": not found, or doesn't exist.`);
      return this;
    }

    return command.execute(this, this.flags);
  }
}

export class Command {
  command: string;
  callback: (arg0?: any) => any;
  description: string | undefined;
  flags: Flag[];
  requiredFlags: Flag[];

  constructor(
    command: string,
    callback: (arg0?: any) => any,
    description?: string
  ) {
    this.command = command;
    this.description = description;
    this.callback = callback;
    this.flags = [];
    this.requiredFlags = [];

    if (this.command !== "help") {
      this.flags.push(new Flag("help", "Shows useful information about this command", "h"));
    }
  }

  public flag(flag: Flag): this {
    this.flags.push(flag);

    if (flag.required === true) {
      this.requiredFlags.push(flag);
    }

    return this;
  }

  public help() {
    return `
    ${this.description}

    Options
      ${this.flags.map((flag) => `${flag.flag} ${flag.short}    ${flag.descriptor}`)}

    Usage
      $ mango ${this.command} [options]
    `
  }

  public execute(caller: CLI, flags?: Flags): Command {
    const mappedFlags = flags?.map(([flag, _value]) => flag);
    const missingFlags: string[] = [];
    const invalidFlags: string[] = [];

    if (
      this.requiredFlags.length > 0 &&
      mappedFlags !== undefined &&
      mappedFlags.length === 0
    ) {
      stderr(
        `Required flag(s): "${this.requiredFlags
          .map((flag) => flag.flag)
          .join(" ")}" ${
          this.requiredFlags.length > 1 ? "were" : "was"
        } not supplied and is marked as required`
      );
      return this;
    }

    this.requiredFlags.forEach((requiredFlag) => {
      if (
        mappedFlags?.find((flag) => requiredFlag.flag === flag) === undefined
      ) {
        missingFlags.push(requiredFlag.flag);
      }
    });

    mappedFlags?.forEach((searchFlag) => {
      const foundFlag = this.flags.find((flag) => flag.flag === searchFlag || flag.short === searchFlag);
      if (foundFlag === undefined) {
        invalidFlags.push(searchFlag);
      }
    });

    if (invalidFlags.length !== 0) {
      stderr(
        `Invalid flag(s): "${invalidFlags.join(" ")}" not required by mango "${
          this.command
        }"`
      );
      return this;
    }

    if (missingFlags.length !== 0) {
      stderr(`mango "${this.command}" requires: ${missingFlags.join(" ")}`);
      return this;
    }

    const args = new Map();

    flags?.map(([key, value]) => args.set(key.replace(/^-./g, ""), (value === undefined ? true : value)));

    if (args?.get("help") || args?.get("h")) {
      stderr(this.help());
      return this;
    }

    return this.callback.call(caller, args);
  }
}

export class Flag {
  flag: string;
  descriptor: string;
  required: boolean;
  short?: string | undefined;

  constructor(
    flag: string,
    descriptor: string,
    short?: string | undefined,
    required = false
  ) {
    this.flag = `--${flag}`;
    this.descriptor = descriptor;

    this.short = `-${short}`;
    this.required = required;
  }
}
