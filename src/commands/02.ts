import Command from "@oclif/command";
import { readFileSync } from "fs";

interface IPasswordPolicy {
  min: number;
  max: number;
  letter: string;
}
interface IPasswordEntry {
  policy: IPasswordPolicy;
  password: string;
}

const generatePasswordEntry = (raw: string): IPasswordEntry | void => {
  const regexp = new RegExp("(\\d+)-(\\d+).(\\w):.(\\w+)", "gm");
  const matches = regexp.exec(raw);
  if (matches) {
    return {
      password: matches[4],
      policy: {
        letter: matches[3],
        max: Number(matches[2]),
        min: Number(matches[1]),
      },
    };
  }
};

const passWordEntryValid = (password: IPasswordEntry): boolean => {
  const regexp = new RegExp(password.policy.letter, "gm");
  const totalLength = password.password.length;
  const lengthWithoutChars = password.password.replace(regexp, "").length;
  const numberOfChars = totalLength - lengthWithoutChars;
  return (
    numberOfChars >= password.policy.min && numberOfChars <= password.policy.max
  );
};

const passwordEntryValidPartTwo = (password: IPasswordEntry): boolean => {
  const passwordChars = password.password.split("");
  return (
    (passwordChars[password.policy.min - 1] === password.policy.letter ||
      passwordChars[password.policy.max - 1] === password.policy.letter) &&
    passwordChars[password.policy.max - 1] !==
      passwordChars[password.policy.min - 1]
  );
};

const generatePasswordEntries = (data: string[]): IPasswordEntry[] => {
  const entries: IPasswordEntry[] = [];
  data.forEach((line: string) => {
    const policy = generatePasswordEntry(line);
    if (policy) {
      entries.push(policy);
    }
  });
  return entries;
};

export class Day02 extends Command {
  static description = "Day Two";

  async run() {
    const file = readFileSync("src/input/02.txt", "utf-8");
    const lines: string[] = file.split("\n");
    const passwordEntries = generatePasswordEntries(lines);
    const numberOfMatches = passwordEntries.filter(
      (passwordEntry: IPasswordEntry) => {
        return passWordEntryValid(passwordEntry);
      }
    ).length;
    console.log("Part One", numberOfMatches);
    const partTwoMatch = passwordEntries.filter(
      (passwordEntry: IPasswordEntry) => {
        return passwordEntryValidPartTwo(passwordEntry);
      }
    ).length;
    console.log("Part Two", partTwoMatch);
  }
}
