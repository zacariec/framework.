export const ANSI = {
    FgStandardBlack: "\x1b[30m",
    FgStardardRed: "\x1b[31m",
    FgStandardGreen: "\x1b[32m",
    FgStandardYellow: "\x1b[33m",
    FgStandardBlue: "\x1b[34m",
    FgStandardMagenta: "\x1b[35m",
    FgStandardCyan: "\x1b[36m",
    FgStandardWhite: "\x1b[37m",
    FgIntenseGray: "\x1b[90m",
    FgIntenseRed: "\x1b[91m",
    FgIntenseGreen: "\x1b[92m",
    FgIntenseYellow: "\x1b[93m",
    FgIntenseBlue: "\x1b[94m",
    FgIntenseMagenta: "\x1b[95m",
    FgIntenseCyan: "\x1b[96m",
    FgIntenseWhite: "\x1b[97m",
    BgStandardBlack: "\x1b[40m",
    BgStandardRed: "\x1b[41m",
    BgStandardGreen: "\x1b[42m",
    BgStandardYellow: "\x1b[43m",
    BgStandardBlue: "\x1b[44m",
    BgStandardMagenta: "\x1b[45m",
    BgStandardCyan: "\x1b[46m",
    BgStandardWhite: "\x1b[47m"
}


export function color(str: string) {
  return console.log(`\x1b[41;1m${str}\x1b[0m`);
}

export function fgBlack(str: string) {
  return `\x1b[30m${str}\x1b[0m`;
}

export function fgRed(str: string) {
  return `\x1b[31m${str}\x1b[0m`;
}

export function fgGreen(str: string) {
  return `\x1b[32m${str}\x1b[0m`;
}

export function fgYellow(str: string) {
  return `\x1b[33m${str}\x1b[0m`;
}

export function fgBlue(str: string) {
  return `\x1b[34m${str}\x1b[0m`;
}

export function fgMagenta(str: string) {
  return `\x1b[35m${str}\x1b[0m`;
}

export function fgCyan(str: string) {
  return `\x1b[36m${str}\x1b[0m`;
}

export function fgWhite(str: string) {
  return `\x1b[37m${str}\x1b[0m`;
}

export function fgIntGray(str: string) {
  return `\x1b[90m${str}\x1b[0m`;
}

export function fgIntRed(str: string) {
  return `\x1b[91m${str}\x1b[0m`;
}

export function fgIntGreen(str: string) {
  return `\x1b[92m${str}\x1b[0m`;
}

export function fgIntYellow(str: string) {
  return `\x1b[93m${str}\x1b[0m`;
}

export function fgIntBlue(str: string) {
  return `\x1b[94m${str}\x1b[0m`;
}

export function fgIntMagenta(str: string) {
  return `\x1b[95m${str}\x1b[0m`;
}

export function fgIntCyan(str: string) {
  return `\x1b[96m${str}\x1b[0m`;
}

export function fgIntWhite(str: string) {
  return `\x1b[97m${str}\x1b[0m`;
}

export function bgBlack(str: string) {
  return `\x1b[40m${str}\x1b[0m`;
}

export function bgRed(str: string) {
  return `\x1b[41m${str}\x1b[0m`;
}

export function bgGreen(str: string) {
  return `\x1b[42m${str}\x1b[0m`;
}

export function bgYellow(str: string) {
  return `\x1b[43m${str}\x1b[0m`;
}

export function bgBlue(str: string) {
  return `\x1b[44m${str}\x1b[0m`;
}

export function bgMagenta(str: string) {
  return `\x1b[45m${str}\x1b[0m`;
}

export function bgCyan(str: string) {
  return `\x1b[46m${str}\x1b[0m`;
}

export function bgWhite(str: string) {
  return `\x1b[47m${str}\x1b[0m`;
}
