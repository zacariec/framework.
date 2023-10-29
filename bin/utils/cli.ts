type Args = string[];

interface IMango {
  _pathToBun: string;
  _pathToExecutable: string;
  command: string;
  stderr: (arg0: string, options: { highWaterMark: number | undefined }) => void;
  run: (arg0?: string, arg1?: (...args: any) => any) => void;
}

export class Mango implements IMango {
  _pathToBun: string;
  _pathToExecutable: string;
  command: string;

  constructor(args: Args) {
    this._pathToBun = args[0];
    this._pathToExecutable = args[1];
    this.command = args[2];
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
    writer.write(input);
    writer.end();
  }

  run(subcommand?: string, callback?: (...args: any) => any): void {
    if (this.command !== "mango") {
      this.stderr("Not a mango command");
      return;
    }

    switch (subcommand) {
      case "help":
        callback?.()
        break;
      default: 
        this.stderr("No subcommand passed.");
        break;
    }
  }
}
