import { fgGreen } from "./colors";
import { stderr, stdout } from "./utils";

import type { CLI } from "./cli";

export async function createUpdateThemeAsset(this: CLI, filename: string) {
  const shopifyInstance = "";
  const themeId = "";
  const apiVersion = "";
  const fileContent = "";
  const accessToken = "";

  const payload = {
    key: filename,
    value: fileContent,
  };

  try {
    const request = await fetch(`${shopifyInstance}/admin/api/${apiVersion}/themes/${themeId}/assets.json`, {
      method: "PUT",
      headers: {
        "X-Shopify-Access-Token": accessToken,
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

export async function deleteThemeAsset(this: CLI, filename: string): Promise<void> {
  const shopifyInstance = "";
  const themeId = "";
  const apiVersion = "";
  const accessToken = "";

  try {
    // TODO: Get the actual asset key..
    const request = await fetch(`${shopifyInstance}/admin/api/${apiVersion}/themes/${themeId}/assets.json?asset[key]=${filename}`, {
      method: "DEL",
      headers: {
        "X-Shopify-Access-Token": accessToken,
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
