import { configure } from "./commands/config";
import { create } from "./commands/create";
import { watch } from "./commands/watch";
import { Command, CLI, Flag } from "./utils/cli";

const mango = await CLI.init(Bun.argv);

const configCommand = new Command("config", configure, "")
    .flag(new Flag("themeid", "Required: The Storefront themeid for this environment", "t", true))
    .flag(new Flag("storefront", "Required: The Storefront url for this environment eg: \"mystorefront.myshopify.com\"", "s", true))
    .flag(new Flag("password", "Required: The Storefront application password to utilise for changes to this environment", "p", true))
    .flag(new Flag("ignores", "Optional: The ignores file containing patterns for files/directories to ignore", "i"))
    .flag(new Flag("environment", "Optional: The environment name to use instead of the default \"development\"", "e"))
    .flag(new Flag("directory", "Optional: The working directory to use instead of the default", "d"));

const createCommand = new Command("create", create, "");
const watchCommand = new Command("watch", watch, "");

if (!mango) {
  process.exit(0);
}

mango
  .add(watchCommand)
  .add(createCommand)
  .add(configCommand);

mango.run();
