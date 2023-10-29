// TODO: Finalise create command.
// TODO: Need to add Progress Bad.
// TODO: Need to find a way of unziping file
import { exists, mkdir } from "fs/promises";
import type { CLI } from "../utils/cli";
import { stderr, stdout, validateStorefrontURL } from "../utils/utils";
import { fgBlue, fgYellow } from "../utils/colors";

export async function create(this: CLI) {
  const directory = prompt(
    fgYellow(`What would you like to name your project?\n`),
    `${process.cwd()}/my-framework-project`,
  );

  if (directory === null) {
    return stderr("No directory passed");
  }

  try {
    const dirExists = await exists(directory);

    if (dirExists) {
      return stderr(`${directory} is not a empty directory`);
    }
  } catch (err) {
    console.error(err);
  }
  const storefront = prompt(
    fgYellow(`What is the .myshopify URL of the Storefront you'd like to work with?\n`),
  );

  if (!storefront) {
    return stderr("Please supply a Shopify Storefront URL");
  }

  const isValidStorefront = validateStorefrontURL(storefront);

  if (!isValidStorefront) {
    return stderr("Please supply a valid .myshopify.com Storefront URL");
  }

  const storefrontPassword = prompt(
    fgYellow(`What is the application password of the Storefront you'd like to work with?\n`),
  );

  if (!storefrontPassword) {
    return stderr(
      "Please supply a Shopify Storefront application password to make changes",
    );
  }

  try {
    await mkdir(directory);
  } catch (err) {
    stderr(`${err}`);
  }

  try {
    stdout("Downloading theme template");
    const sink = new Bun.ArrayBufferSink();
    const response = await fetch(
      "https://github.com/raylway/mango-theme/archive/refs/heads/main.zip",
    );

    if (response.statusText.toLowerCase() !== "ok") {
      stderr("Error fetching the zip file for the starter template.");
      process.exit();
    }

    if (!response.body) {
      stderr("Error fetching the zip file for the starter template.");
      process.exit();
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      sink.write(value);
    }

    const content = sink.end();

    decoder.decode(content);

    await Bun.write("template.zip", content);

    stdout("Unzipping theme");
    // TODO: Add support for non OSX/Linux distros (windows lol)
    Bun.spawn(["unzip", "template.zip", "-d", directory]);
    stdout(fgBlue(`Finished unzipping theme template in: ${directory}`));
  } catch (err) {
    stderr(`${err}`);
  }
}
