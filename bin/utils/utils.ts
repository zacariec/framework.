import { fgRed } from "./colors";

import type { ConfigRecord, StdWriter } from "../../types";


/**
 * Initializes a stderr writer start & end.
 * @param input - Takes a string to write to the stderr & outputs it to console.
 * @param options - Takes an object that matches the stderr.writer object.
 * @returns void
 */
export function stderr(input: string, options?: StdWriter): void {
  const writer = Bun.stderr.writer(options);

  writer.start();
  writer.write(fgRed(`${input}\n`));
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

export function validateStorefrontURL(url: string): boolean {
  const rgx = /[^.\s]+\.myshopify\.com/g;

  return rgx.test(url);
}

export async function readConfiguration(configPath = "mango.toml"): Promise<Map<string, ConfigRecord>> {
  try {
    const { default: file } = await import(`${process.cwd()}/${configPath}`);
    const configurationMap: Map<string, ConfigRecord> = new Map(Object.entries(file));

    return configurationMap;
  } catch (err) {
    stderr(`Error reading configuration file from ${configPath}. Does it even exist? ${err}`);
    process.exit(0);
  }
}
