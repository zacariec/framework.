import { fgGreen } from "./colors";
import { stderr, stdout, unwrapEnvironment } from "./utils";

export async function createUpdateThemeAsset(filename: string) {
  const environment = unwrapEnvironment();

  if (!environment.config) {
    stderr(`Environment doesn't exist`);
    process.exit(0);
  }

  const fileContent = "";

  const payload = {
    key: filename,
    value: fileContent,
  };

  try {
    const request = await fetch(`https://${environment.config.storefront}/admin/api/${environment.config.api}/themes/${environment.config.themeid}/assets.json`, {
      method: "PUT",
      keepalive: false, // Bun.SH issue: https://github.com/oven-sh/bun/issues/3327
      headers: {
        "X-Shopify-Access-Token": environment.config.password,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (request.ok === false) {
      throw new Error(`Error uploading asset: ${filename}`);
    }

    const response = await request.json();


  } catch (err) {
    stderr(`${err}`);
    process.exit(0);
  }
}

export async function deleteThemeAsset(filename: string): Promise<void> {
  const environment = unwrapEnvironment();

  if (!environment.config) {
    stderr(`${environment.name} isn't a valid environment.`);
    process.exit(0);
  }

  try {
    // TODO: Get the actual asset key..
    const request = await fetch(`https://${environment.config.storefront}/admin/api/${environment.config.api}/themes/${environment.config.themeid}/assets.json?asset[key]=${filename}`, {
      method: "DEL",
      keepalive: false, // Bun.SH issue: https://github.com/oven-sh/bun/issues/3327
      headers: {
        "X-Shopify-Access-Token": environment.config.password,
        "Content-Type": "application/json",
      },
    });

    if (request.ok === false) {
      throw new Error(`Error deleting asset: ${filename}`);
    }

    const response: Record<"message", string> = await request.json();

    stdout(fgGreen(response.message));
  } catch (err) {
    stderr(`${err}`);
    process.exit(0);
  }
}
