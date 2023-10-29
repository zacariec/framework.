export class ProgressBar {
  total: number;
  current: number;
  barLength: number;
  filledChar: string;
  emptyChar: string;

  constructor(total: number, current: number, filledChar = "=", emptyChar = "-") {
    this.total = total;
    this.current = current;
    this.barLength = process.stdout.columns - 30;
    this.filledChar = filledChar;
    this.emptyChar = emptyChar;

    this.update(this.current);
  }

  update(current: number): void {
    this.current = current;
    const currentProgress = this.current / this.total;
    this.draw(currentProgress);

  }

  draw(currentProgress: number): void {
    const filledLength: number = parseInt((currentProgress * this.barLength).toFixed(0));
    const emptyLength = this.barLength - filledLength;
    const filledBar = this.bar(filledLength, this.filledChar);
    const emptyBar = this.bar(emptyLength, this.emptyChar);
    const percentage = (currentProgress * 100).toFixed(2);

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Current Progress: [${filledBar}${emptyBar}] | ${percentage}%`);

  }

  bar(length: number, char: string) {
    let str = "";

    for (let i = 0; i < length; i++) {
      str += char;
    }

    return str;
  }
}
