import type { CLI } from "../utils/cli";
import { stderr } from "../utils/utils";

export type Config = {
  themeid: number;
  storefront: string;
  password: string;
  ignores?: string;
  directory?: string;
  environment?: string;
};

interface TomlConfig {
  [key: string]: Config;
}

export async function configure(
  this: CLI,
  args: Map<keyof Config, Config[keyof Config]>,
) {
  const configPath = `${process.cwd()}/framework.toml`;
  const configFile = Bun.file(configPath);
  const exists = await configFile.exists();
  let content = "";

  try {
    const isNewConfiguration: boolean = await new Promise(
      async (resolve, reject): Promise<any> => {
        if (exists === true) {
          const mod = await import(configPath);
          const config: TomlConfig = mod.default;

          let key = args.get("environment");

          // it's a new configuration.
          if (config === undefined) {
            return resolve(true);
          }

          // if a key is undefined, it means an environment wasn't passed as a flag and therefore is "development"
          if (key === undefined) {
            key = "development";
          }

          const environmentExists = config[key];

          if (environmentExists === undefined) {
            return resolve(false);
          }

          // reject the promise if the environment exists, the user will need to supply the environment flag.
          if (Object.keys(environmentExists).length !== 0) {
            return reject();
          }

          // if we make it here we can continue the execution flow by succesfully resolving the promise.
          return resolve(false);
        }
      },
    );

    content += `
${isNewConfiguration === false ? await configFile.text() : ""}
[${args.get("environment") !== undefined
        ? args.get("environment")
        : "development"
      }]
themeid = ${args.get("themeid")}
storefront = "${args.get("storefront")}"
password = "${args.get("password")}"
api = "2023-10"
${args.get("ignores") !== undefined ? `ignores = "${args.get("ignores")}"` : ``}
${args.get("directory") !== undefined
        ? `directory = "${args.get("directory")}"`
        : ``
      }

`;

    try {
      await Bun.write(configPath, content);
    } catch (err) {
      stderr(String(err));
    }
  } catch (err) {
    stderr(
      `${args.get("environment") === undefined
        ? "development"
        : args.get("environment")
      } environment already exists, please supply the --environment or -e flag to framework config`,
    );
  }
}

