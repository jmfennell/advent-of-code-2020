import Command from "@oclif/command";
import { readFileSync } from "fs";

export class Day01 extends Command {
  static description = "Day One";

  getPartOne = (values: number[]): number | void => {
    let value = 0;
    for (let a of values) {
      if (value > 0) {
        break;
      }
      for (let b of values) {
        if (value > 0) {
          break;
        }
        if (a !== b && a + b === 2020) {
          value = a * b;
          break;
        }
      }
    }
    return value;
  };

  getPartTwo = (values: number[]): number | void => {
    let value = 0;
    for (let a of values) {
      if (value > 0) {
        break;
      }
      for (let b of values) {
        if (value > 0) {
          break;
        }
        for (let c of values) {
          if (a + b + c === 2020) {
            value = a * b * c;
            break;
          }
        }
      }
    }
    return value;
  };

  async run() {
    const file = readFileSync("src/input/01.txt", "utf-8");
    const lines: string[] = file.split("\n");
    const values: number[] = lines.map((line: string) => {
      return Number(line);
    });
    console.log("Part One", this.getPartOne(values));
    console.log("Part Two", this.getPartTwo(values));
  }
}
