import Command from "@oclif/command";
import { readFileSync } from "fs";

interface differences {
  [difference: number]: number;
}
interface routesToAdapter {
  [adapter: number]: number[];
}

export class Problem extends Command {
  static description = "Day Ten";
  input: number[] = [];
  differences: differences = [];
  numberOfVariations: number = 1;
  optionalAdapters: number[] = [];

  setDifferences = (): void => {
    for (let i = 0; i < this.input.length; i++) {
      if (this.input[i + 1]) {
        const diff = this.input[i + 1] - this.input[i];
        if (this.differences[diff]) {
          this.differences[diff]++;
        } else {
          this.differences[diff] = 1;
        }
      }
    }
  };

  setOptionalAdapters = (): void => {
    const descendingInput = this.input.reverse();
    for (let i = 1; i < descendingInput.length - 1; i++) {
      if (descendingInput[i - 1] - descendingInput[i + 1] <= 3) {
        this.optionalAdapters.push(descendingInput[i]);
      }
    }
  };

  setNumberOfVariations = (): void => {
    this.optionalAdapters.forEach((adapter: number) => {
      if (
        this.optionalAdapters.includes(adapter + 1) &&
        this.optionalAdapters.includes(adapter + 2)
      ) {
        this.numberOfVariations += (3 * this.numberOfVariations) / 4;
      } else {
        this.numberOfVariations = this.numberOfVariations * 2;
      }
    });
  };

  async run() {
    const file = readFileSync("src/input/10.txt", "utf-8");
    this.input = file
      .split("\n")
      .filter((line: string) => {
        return line.trim().length > 0;
      })
      .map((line: string) => {
        return Number(line);
      })
      .sort((a, b) => {
        return a - b;
      });
    this.input.unshift(0);
    this.input.push(Math.max(...this.input) + 3);
    this.setDifferences();
    console.log("Part One:", this.differences[1] * this.differences[3]);
    this.setOptionalAdapters();
    this.setNumberOfVariations();
    console.log("Part Two:", this.numberOfVariations);
  }
}
