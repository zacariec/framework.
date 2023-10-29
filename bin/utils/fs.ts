import type { Subprocess } from "bun";

const platform = process.platform

async function readStd(proc: Subprocess<"ignore", "pipe", "pipe">): Promise<string[]> {
  try {
    const text = await new Response(proc.stdout).text();
    const error = await new Response(proc.stderr).text();

    return [text, error];
  } catch (err) {
    console.error(err);
    process.exit(0);
  }
}

export async function move(source: string, target: string) {
  const platformCommands = new Map([
    ["aix", "mv"],
    ["darwin", "mv"],
    ["freebsd", "mv"],
    ["linux", "mv"],
    ["openbsd", "mv"],
    ["sunos", "mv"],
    ["win32", "move"],
  ]);

  const mvCmd = platformCommands.get(platform);

  Bun.spawn([String(mvCmd), source, target]);
}

export async function exists(target: string): Promise<boolean> {
  const platformCommands = new Map([
    ["aix", "ls"],
    ["darwin", "ls"],
    ["freebsd", "ls"],
    ["linux", "ls"],
    ["openbsd", "ls"],
    ["sunos", "ls"],
    ["win32", "dir"],
  ]);

  const existsCmd = platformCommands.get(platform);

  const proc = Bun.spawn([String(existsCmd), target], {
    stdout: "pipe",
    stderr: "pipe",
    cwd: process.cwd(),
  });

  const [_msg, error] = await readStd(proc);

  if (error !== "") {
    return false;
  }

  throw new Error(`${target} exists, please use another target directory`);
}

export async function mkdir(dir: string) {

  const proc = Bun.spawn(["mkdir", dir], {
    stdout: "pipe",
    stderr: "pipe",
    cwd: process.cwd(),
  });

  const [msg, error] = await readStd(proc);
  console.log(msg, error);
}
