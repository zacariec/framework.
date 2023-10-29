import { FileChangeInfo, watch as fsWatch } from "fs/promises";

import type { CLI } from "../utils/cli";
import { createUpdateThemeAsset, deleteThemeAsset } from "../utils/shopify";
import { stdout } from "../utils/utils";

type WatchArgs = {};

export async function watch(this: CLI, args: Map<keyof WatchArgs, WatchArgs[keyof WatchArgs]>) {
  // TODO: Map directory to context of CLI env.
  const parentDirectory = `${process.cwd()}/test`;
  const watcher = fsWatch(parentDirectory, {
    recursive: true,
  });

  for await (const event of watcher) {
    switch (event.eventType) {
      case "rename":
        handleFileEventRename(event);
        break;
      case "change":
        handleFileEventChange(event);
        break;
      case "error":
        handleFileEventError(event);
        break;
      case "close":
        handleFileEventClose(event);
        break;
    }
  }
}

function handleFileEventError(event: FileChangeInfo<string>): void {}

async function handleFileEventChange(
  event: FileChangeInfo<string>,
): Promise<void> {
  const filePath = `${process.cwd()}/test/${event.filename}`;
  const file = Bun.file(filePath);
  const url = new URL(`https://${filePath}`);
  const pathParts = url.pathname.split("/");
  const fileName = pathParts.at(pathParts.length - 1);

  if (!fileName) {
    // TODO: Handle undefined filename.
    return;
  }

  const fileExtension = fileName.split(".")[1];

  if (!fileExtension) {
    // TODO: Handle no file extension?
    return;
  }

  const bundleExtensions = [
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".cjs",
    ".mjs",
    ".cts",
    ".mts",
  ];

  if (bundleExtensions.includes(`.${fileExtension}`) === false) {
    // TODO: Upload the file to Shopify.
    await createUpdateThemeAsset(fileName);
    return;
  }

  const bundle = await Bun.build({
    entrypoints: [filePath],
    target: "browser",
    sourcemap: "inline",
    minify: true,
  });

  stdout(`Parsing ${filePath}`);


  for (const log of bundle.logs) {
    switch (log.level) {
      case "error":
      case "warning":
      case "info":
      case "debug":
      case "verbose":
    }
  }


  // TODO: Upload the bundle to Shopify.
  for (const result of bundle.outputs) {
    const txt = await result.text();
  }
}

async function handleFileEventRename(
  event: FileChangeInfo<string>,
): Promise<void> {
  try {
    const filePath = `${process.cwd()}/test/${event.filename}`;
    const file = Bun.file(filePath);
    const fileExists = await file.exists();

    if (fileExists === true) {
      console.log("Create file");
      // TODO: Create file on Shopify
      await createUpdateThemeAsset(filePath);
      return;
    }

    if (fileExists === false) {
      console.log("Delete file");
      // TODO: Delete file on Shopify
      await deleteThemeAsset(filePath);
      return;
    }
  } catch (err) {}
}

function handleFileEventClose(event: FileChangeInfo<string>): void {}
