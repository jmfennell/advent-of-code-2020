import Command from "@oclif/command";
import { readFileSync } from "fs";

export class Problem extends Command {
  static description = "Day Nine";
  static preamble = 25;
  input: number[] = [];
  firstInvalidNumber: number = 0;
  contiguousList: number[] = [];

  getPreambleFromIndex = (index: number) => {
    return this.input.slice(index - Problem.preamble, index);
  };

  isValueValid = (value: number, preamble: number[]): boolean => {
    let isValid = false;
    preamble.forEach((i: number) => {
      preamble.forEach((j: number) => {
        if (i !== j && i + j === value) {
          isValid = true;
        }
      });
    });
    return isValid;
  };

  setFirstInvalidNumber = () => {
    for (let i = Problem.preamble; i < this.input.length; i++) {
      if (!this.isValueValid(this.input[i], this.getPreambleFromIndex(i))) {
        this.firstInvalidNumber = this.input[i];
        break;
      }
    }
  };

  setContiguousList = () => {
    for (let i = 0; i < this.input.length; i++) {
      if (this.input[i] < this.firstInvalidNumber) {
        let sum = this.input[i];
        for (let j = i + 1; j < this.input.length; j++) {
          sum = sum + this.input[j];
          if (sum === this.firstInvalidNumber) {
            this.contiguousList = this.input.slice(i, j + 1);
            break;
          }
        }
      }
    }
  };

  async run() {
    const file = readFileSync("src/input/09.txt", "utf-8");
    this.input = file
      .split("\n")
      .filter((line: string) => {
        return line.trim().length > 0;
      })
      .map((line: string) => {
        return Number(line);
      });
    this.setFirstInvalidNumber();
    console.log("Part One:", this.firstInvalidNumber);
    this.setContiguousList();
    console.log(
      "Part Two:",
      Math.min(...this.contiguousList) + Math.max(...this.contiguousList)
    );
  }
}
