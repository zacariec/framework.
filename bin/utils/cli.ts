import { help } from "../commands/help";
import { readConfiguration, stderr } from "./utils";


import type { Args, ConfigRecord, Flags } from "../../types";

interface ICli {
  _pathToBun: string;
  _pathToExecutable: string;
  command: string;
  commands: Command[];
  context: any;
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
  context: Map<string, ConfigRecord> | undefined;
  params: string[];

  private constructor(args: Args, context?: Map<string, ConfigRecord> | undefined) {
    this.args = args;
    this._pathToBun = this.args[0];
    this._pathToExecutable = this.args[1];
    this.context = context;
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

  public static async init(args: Args) {
    try {
      const context = await readConfiguration();

      return new CLI(args, context);
    } catch (err) {
      stderr(`Error constructing CLI ${err}`);
    }
  }


  /**
   * Registers a command to an array of commands on the constructor.
   * @param command - The Command class to register
   * @returns this
   */
  public add(command: Command): this {
    this.commands.push(command);
    return this;
  }

  /**
   * Runs the invoked CLI, checking against commands that have been
   * registered into the constructor.
   * @returns Command | Cli - returns the Command if found or the CLI instance - this is useless
   */
  public run(): Command | this {
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

  /**
    * Method to register a flag against the command.
    * @param flag - The Flag constructor to add.
    * @returns this - Returns the current Command.
    * @example
    * ```typescript
    * // Adds a flag to a prexisting command.
    * const myCommand = new Command(...);
    * myCommand.flag(new Flag(...)); 
    * ```
    */
  public flag(flag: Flag): this {
    this.flags.push(flag);

    if (flag.required === true) {
      this.requiredFlags.push(flag);
    }

    return this;
  }

  /**
    * Gives information as a string about the current command.
    * @returns string - Returns the help message to be printed about the current Command
    */
  private help(): string {
    return `
    ${this.description}

    Options
      ${this.flags.map((flag) => `${flag.flag} ${flag.short}    ${flag.descriptor}\n      `)}

    Usage
      $ mango ${this.command} [options]
    `
  }

  /**
    * Executes the callback that was constructed with the new Command.
    * @param caller CLI - The CLI instance that calls the command, provides access to the CLI context within the callback.
    * @param flags optional string[][] - 2D Array of Iterator[key]:value these are the flags passed from the CLI to the command.
    */
  public execute(caller: CLI, flags?: Flags): Command {
    const mappedFlags = flags?.map(([flag, _value]) => flag);
    const missingFlags: string[] = [];
    const invalidFlags: string[] = [];

    // Early return if there are any required flags but no flags were passed down to the command.
    // Checks if there are required flags in general but no flags were passed to the current Command context.
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

    // Checks for flags that are required but haven't been passed to the current Command context.
    this.requiredFlags.forEach((requiredFlag) => {
      if (
        mappedFlags?.find((flag) => requiredFlag.flag === flag) === undefined
      ) {
        missingFlags.push(requiredFlag.flag);
      }
    });

    // Checks for flags that don't exist agains the current Command context.
    mappedFlags?.forEach((searchFlag) => {
      const foundFlag = this.flags.find((flag) => flag.flag === searchFlag || flag.short === searchFlag);
      if (foundFlag === undefined) {
        invalidFlags.push(searchFlag);
      }
    });

    // Early return if flags that don't exist were passed to the current Command context.
    if (invalidFlags.length !== 0) {
      stderr(
        `Invalid flag(s): "${invalidFlags.join(" ")}" not required by mango "${
          this.command
        }"`
      );
      return this;
    }

    // Early return if flags were passed but still missing other required flags.
    if (missingFlags.length !== 0 && (mappedFlags?.includes("--help") || mappedFlags?.includes("--h")) === false) {
      stderr(`mango "${this.command}" requires: ${missingFlags.join(" ")}`);
      return this;
    }

    const args = new Map();

    // Map the flags to the above args map for key & value replacing hyphens in the key.
    flags?.map(([key, value]) => args.set(key.replace(/^-./g, ""), (value === undefined ? true : value)));

    // Early return if the help flag was passed to the current command context.
    if (args?.get("help") || args?.get("h")) {
      stderr(this.help());
      return this;
    }

    // executes the callback with context of the CLI, passing the optional arguments.
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
