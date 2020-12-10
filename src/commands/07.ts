import Command from "@oclif/command";
import { readFileSync } from "fs";

interface bagRule {
  color: string;
  contains: bagRuleContents[];
}

interface bagRuleContents {
  color: string;
  count: number;
}

const generateBags = (data: string[]): bagRule[] => {
  const bags: bagRule[] = [];
  data.forEach((rule: string) => {
    const _rule = rule.split("bags contain");
    const bag: bagRule = { color: _rule[0].trim(), contains: [] };
    const contents = _rule[1].split(",");
    contents.forEach((content: string) => {
      const contentRule = content.match(/(\d+)\s([\w\s]+)\sbags?\.?$/);
      if (contentRule && contentRule.length === 3) {
        bag.contains.push({
          color: contentRule[2],
          count: Number(contentRule[1]),
        });
      }
    });

    bags.push(bag);
  });

  return bags;
};

const bagsThatCanContainBag = (bag: string, rules: bagRule[]): string[] => {
  const bags: string[] = [];
  rules.forEach((rule: bagRule) => {
    rule.contains.forEach((contents: bagRuleContents) => {
      if (contents.color === bag) {
        bags.push(rule.color);
        const children = bagsThatCanContainBag(rule.color, rules);
        if (children.length > 0) {
          bags.push(...children);
        }
      }
    });
  });

  return bags.filter((_bag: string, index: Number, _bags: string[]) => {
    return _bags.indexOf(_bag) === index;
  });
};

const numberOfBagsInsideBag = (bag: string, rules: bagRule[]): number => {
  let count = 0;
  rules.forEach((rule: bagRule) => {
    if (rule.color === bag) {
      rule.contains.forEach((contents: bagRuleContents) => {
        count = count + contents.count;
        count =
          count + numberOfBagsInsideBag(contents.color, rules) * contents.count;
      });
    }
  });
  return count;
};

export class Day07 extends Command {
  static description = "Day Seven";

  async run() {
    const file = readFileSync("src/input/07.txt", "utf-8");
    const rawRules: string[] = file.split("\n").filter((line: string) => {
      return line.trim().length > 0;
    });
    const bags = generateBags(rawRules);
    console.log(bags);
    console.log("Part One: ", bagsThatCanContainBag("shiny gold", bags).length);
    console.log("Part Two: ", numberOfBagsInsideBag("shiny gold", bags));
  }
}
