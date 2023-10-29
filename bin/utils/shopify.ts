import { fgGreen } from "./colors";
import { stderr, stdout, unwrapEnvironment } from "./utils";

export async function createUpdateThemeAsset(filename: string) {
  const environment = unwrapEnvironment();
  const fileContent = "";

  const payload = {
    key: filename,
    value: fileContent,
  };

  try {
    const request = await fetch(`https://${environment.storefront}/admin/api/${environment.api}/themes/${environment.themeid}/assets.json`, {
      method: "PUT",
      headers: {
        "X-Shopify-Access-Token": environment.password,
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
  const apiVersion = "";

  try {
    // TODO: Get the actual asset key..
    const request = await fetch(`https://${environment.storefront}/admin/api/${environment.api}/themes/${environment.themeid}/assets.json?asset[key]=${filename}`, {
      method: "DEL",
      headers: {
        "X-Shopify-Access-Token": environment.password,
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
