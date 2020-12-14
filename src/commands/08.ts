import Command from "@oclif/command";
import { readFileSync } from "fs";

interface rule {
  argument: string;
  operation: number;
}

const generateRules = (data: string[]): rule[] => {
  const rules: rule[] = [];
  data.forEach((item: string) => {
    const info = item.split(" ");
    if (info.length === 2) {
      rules.push({
        argument: info[0],
        operation: Number(info[1]),
      });
    }
  });
  return rules;
};

const executeRule = (
  rule: rule,
  accumulator: number,
  currentRuleIndex: number
): [number, number] => {
  if (rule.argument === "nop") {
    return [accumulator, currentRuleIndex + 1];
  } else if (rule.argument === "acc") {
    return [accumulator + rule.operation, currentRuleIndex + 1];
  } else {
    return [accumulator, currentRuleIndex + rule.operation];
  }
};

const valueBeforeLoop = (rules: rule[]): number => {
  let accumulator = 0;
  let rulesExecuted: number[] = [];

  return accumulator;
};

export class Problem extends Command {
  static description = "Day Eight";
  accumulator = 0;
  currentRuleIndex = 0;
  rulesExecuted: number[] = [];
  rules: rule[] = [];

  executeRule = (rule: rule): void => {
    this.rulesExecuted.push(this.currentRuleIndex);
    if (rule.argument === "nop") {
      this.currentRuleIndex = this.currentRuleIndex + 1;
    } else if (rule.argument === "acc") {
      this.accumulator = this.accumulator + rule.operation;
      this.currentRuleIndex = this.currentRuleIndex + 1;
    } else if (rule.argument === "jmp") {
      this.currentRuleIndex = this.currentRuleIndex + rule.operation;
    }
  };

  executeRuleAtCurrentIndex = () => {
    this.executeRule(this.rules[this.currentRuleIndex]);
  };

  executeProgram = () => {
    this.currentRuleIndex = 0;
    this.accumulator = 0;
    this.rulesExecuted = [];
    while (
      this.rules[this.currentRuleIndex] &&
      !this.rulesExecuted.includes(this.currentRuleIndex)
    ) {
      this.executeRuleAtCurrentIndex();
    }
  };

  async run() {
    const file = readFileSync("src/input/08.txt", "utf-8");
    const lines = file.split("\n").filter((line: string) => {
      return line.trim().length > 0;
    });
    this.rules = generateRules(lines);
    this.executeProgram();

    console.log("Part One: ", this.accumulator);

    for (let i = 0; i < this.rules.length; i++) {
      if (this.rules[i] && this.rules[i].argument === "nop") {
        this.rules[i].argument = "jmp";
        this.executeProgram();
        if (this.currentRuleIndex === this.rules.length) {
          console.log("Part Two: ", this.accumulator);
          break;
        }
        this.rules = generateRules(lines);
      }
      if (this.rules[i] && this.rules[i].argument === "jmp") {
        this.rules[i].argument = "nop";
        this.executeProgram();
        if (this.currentRuleIndex === this.rules.length) {
          console.log("Part Two: ", this.accumulator);
          break;
        }
        this.rules = generateRules(lines);
      }
    }
  }
}
