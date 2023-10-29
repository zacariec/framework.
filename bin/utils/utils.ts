type StdWriter = { highWaterMark: number | undefined };

/**
 * Initializes a stderr writer start & end.
 * @param input - Takes a string to write to the stderr & outputs it to console.
 * @param options - Takes an object that matches the stderr.writer object.
 * @returns void
 */
export function stderr(input: string, options?: StdWriter): void {
  const writer = Bun.stderr.writer(options);

  writer.start();
  writer.write(`${input}\n`);
  writer.end();
}

/**
 * Initializes a stdout writer start & end.
 * @param input - Takes a string to write to the stdout & outputs it to console.
 * @param options - Takes an object that matches the stdout.writer object.
 * @returns void
 */
export function stdout(input: string, options?: StdWriter): void {
  const writer = Bun.stdout.writer(options);

  writer.start();
  writer.write(`${input}\n`);
  writer.end();
}
