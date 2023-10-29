type Args = string[];


export function mango(args: Args) {
  const [_pathToBun, _pathToExecutable, command] = args;

  if (command !== "mango") {
  }
}

mango(Bun.argv);
