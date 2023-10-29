import { stderr } from "./utils";

type Args = string[];
type Flags = string[][];

interface ICli {
  _pathToBun: string;
  _pathToExecutable: string;
  command: string;
  commands: Command[];
  stderr: (arg0: string, options: { highWaterMark: number | undefined }) => void;
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
    this.flags = this.params.filter((flag) => flag.substring(0, 1) === "-").filter(Boolean).map((flag) => flag.split("="));
  }

  /**
   * Initializes a stderr writer start & end.
   * @param input - Takes a string to write to the stderr & outputs it to console.
   * @param options - Takes an object that matches the stderr.writer object.
   * @returns void
   */
  stderr(input: string, options?: { highWaterMark: number | undefined }): void {
    const writer = Bun.stderr.writer(options);

    writer.start();
    writer.write(`${input}\n`);
    writer.end();
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
      this.stderr(`Use "mango" to invoke mango actions.`);
      return this;
    }

    if (this.commands.length === 0) {
      this.stderr("No commands configured, register commands against the constructed class.");
      return this;
    }

    const command = this.commands.find((command) => command.command === this.subcommand);

    if (!command) {
      this.stderr(`Command "${this.subcommand}": not found, or doesn't exist.`);
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

  constructor(command: string, callback: (arg0?: any) => any, description?: string) {
    this.command = command;
    this.description = description;
    this.callback = callback;
    this.flags = [];
    this.requiredFlags = [];
  }

  public flag(flag: Flag): this {
    this.flags.push(flag);

    if (flag.required === true) {
      this.requiredFlags.push(flag);
    }

    return this;
  }

  public execute(caller: CLI, flags?: Flags): Command {
    const mappedFlags = flags?.map(([flag, _value]) => flag);
    const missingFlags: string[] = [];
    const invalidFlags: string[] = [];


    if (this.requiredFlags.length > 0 && mappedFlags !== undefined && mappedFlags.length === 0) {
      stderr(`Required flag(s): "${this.requiredFlags.map((flag) => flag.flag).join(" ")}" ${this.requiredFlags.length > 1 ? "were" : "was"} not supplied and is marked as required`);
      return this;
    }

    this.requiredFlags.forEach((requiredFlag) => {
      if (mappedFlags?.find((flag) => requiredFlag.flag === flag) === undefined) {
        missingFlags.push(requiredFlag.flag);
      }
    });

    mappedFlags?.forEach((searchFlag) => {
      const foundFlag = this.flags.find((flag) => flag.flag === searchFlag);
      if (foundFlag === undefined) {
        invalidFlags.push(searchFlag);
      }
    });

    if (invalidFlags.length !== 0) {
      stderr(`Invalid flag(s): "${invalidFlags.join(" ")}" not required by mango "${this.command}"`);
      return this;
    }

    if (missingFlags.length !== 0) {
      stderr(`mango "${this.command}" requires: ${missingFlags.join(" ")}`);
      return this;
    }

    return this.callback.call(caller);
  }
}

export class Flag {
  flag: string;
  descriptor: string;
  required: boolean;
  short?: string | undefined;

  constructor(flag: string, descriptor: string, short?: string | undefined, required = false) {
    this.flag = `--${flag}`;
    this.descriptor = descriptor;

    this.short = short;
    this.required = required;
  }
}
