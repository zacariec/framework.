import { fgIntYellow, fgRed } from "./colors";

import type { ConfigRecord, StdWriter } from "../../types";
import { CLI } from "./cli";


/**
 * Initializes a stderr writer start & end.
 * @param input - Takes a string to write to the stderr & outputs it to console.
 * @param options - Takes an object that matches the stderr.writer object.
 * @returns void
 */
export function stderr(input: string, options?: StdWriter) {
  const writer = Bun.stderr.writer(options);
  const environment = unwrapEnvironment();

  writer.start();
  writer.write(fgRed(`[${new Date().toLocaleTimeString()}] ${(!environment.name) ? "" : `[${environment.name}]`} ${input}\n`));
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
  const environment = unwrapEnvironment();

  writer.start();
  writer.write(`[${fgIntYellow(new Date().toLocaleTimeString())}] ${(!environment.name) ? "" : `[${environment.name}]`} ${input}\n`);
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

    // TODO: Validate against schema - maybe valibot or our own version of validation?

    return configurationMap;
  } catch (err) {
    stderr(`Error reading configuration file from ${configPath}. Does it even exist? ${err}`);
    process.exit(0);
  }
}

export function unwrapEnvironment(): { name: string | boolean | undefined, config: ConfigRecord | undefined } {
  const selectedEnvironment = global.CLI.globalArgs.get("environment");
  const currentEnvironment = global.CLI.context?.get(String(selectedEnvironment));

  return {
    name: selectedEnvironment,
    config: currentEnvironment,
  };
}
