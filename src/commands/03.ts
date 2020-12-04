import Command from "@oclif/command";
import { readFileSync } from "fs";

const countTrees = (
  data: string[],
  moveRight: number,
  moveDown: number
): number => {
  let count = 0;
  let horizontalPosition = 0;
  data.forEach((line: string, i: number) => {
    if (i % moveDown === 0) {
      const sections = line.split("");
      if (sections[horizontalPosition] === "#") {
        count = count + 1;
      }
      horizontalPosition = (horizontalPosition + moveRight) % sections.length;
    }
  });

  return count;
};

export class Day03 extends Command {
  static description = "Day Three";

  async run() {
    const file = readFileSync("src/input/03.txt", "utf-8");
    let lines: string[] = file.split("\n");
    lines = lines.filter((line: string) => {
      return line.length > 0;
    });

    console.log("Part One", countTrees(lines, 3, 1));
    const partTwo =
      countTrees(lines, 1, 1) *
      countTrees(lines, 3, 1) *
      countTrees(lines, 5, 1) *
      countTrees(lines, 7, 1) *
      countTrees(lines, 1, 2);
    console.log("Part Two", partTwo);
  }
}
