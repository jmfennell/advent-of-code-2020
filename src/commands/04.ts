import Command from "@oclif/command";
import { readFileSync } from "fs";

const northPoleCredentialsFields = [
  "byr",
  "iyr",
  "eyr",
  "hgt",
  "hcl",
  "ecl",
  "pid",
];

interface IYearValidation {
  key: string;
  max: number;
  min: number;
}
interface IRegexValidation {
  key: string;
  regex: RegExp;
}

const isValidPassport = (str: string): boolean => {
  return (
    isValidBirthYear(str) &&
    isValidIssueYear(str) &&
    isValidExpirationYear(str) &&
    isValidHeight(str) &&
    isValidHairColor(str) &&
    isValidEyeColor(str) &&
    isValidPassportID(str)
  );
};

const isValidEyeColor = (str: string): boolean => {
  const eyeColors = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
  const eyeColor = str.match(/ecl:(\w{3})/);
  if (eyeColor && eyeColor.length == 2) {
    if (eyeColors.includes(eyeColor[1])) {
      return true;
    }
  }
  return false;
};

const isValidPassportID = (passport: string): boolean => {
  return !!passport.match(/pid:\d{9}( |$)/);
};

const isValidBirthYear = (passport: string): boolean => {
  const matches = passport.match(/byr:(\d{4})/);
  if (matches && matches.length === 2) {
    return Number(matches[1]) <= 2002 && Number(matches[1]) >= 1920;
  }
  return false;
};

const isValidIssueYear = (passport: string): boolean => {
  const matches = passport.match(/iyr:(\d{4})/);
  if (matches && matches.length === 2) {
    return Number(matches[1]) <= 2020 && Number(matches[1]) >= 2010;
  }
  return false;
};

const isValidExpirationYear = (passport: string): boolean => {
  const matches = passport.match(/eyr:(\d{4})/);
  if (matches && matches.length === 2) {
    return Number(matches[1]) <= 2030 && Number(matches[1]) >= 2020;
  }
  return false;
};

const isValidHeight = (passport: string): boolean => {
  const matches = passport.match(/hgt:(\d+)(cm|in)/);
  if (matches?.length === 3) {
    if (matches[2] === "cm") {
      return Number(matches[1]) <= 193 && Number(matches[1]) >= 150;
    }
    if (matches[2] === "in") {
      return Number(matches[1]) <= 76 && Number(matches[1]) >= 59;
    }
  }
  return false;
};

const isValidHairColor = (passport: string): boolean => {
  return !!passport.match(/hcl:#[0-9a-f]{6}( |$)/);
};

const buildRegexString = (strings: string[]): RegExp => {
  const regexStrings: string[] = [];
  strings.forEach((str: string) => {
    regexStrings.push("(?=.*" + str + ":)");
  });

  // Combine the array of regex strings into a single regex expression
  return new RegExp(regexStrings.join("") + ".*", "gi");
};

const isValidNorthPoleCredential = (passport: string): boolean => {
  return !!passport.match(buildRegexString(northPoleCredentialsFields));
};

export class Day04 extends Command {
  static description = "Day Four";
  passports: string[] = [];

  async run() {
    const file = readFileSync("src/input/04.txt", "utf-8");
    let lines: string[] = file.split("\n");
    let passport = "";
    lines.forEach((line: string) => {
      if (line.trim().length > 0) {
        passport = passport + " " + line.trim();
      } else {
        this.passports.push(passport.trim());
        passport = "";
      }
    });
    const validNorthPole = this.passports.filter((str: string) => {
      return isValidNorthPoleCredential(str);
    });
    console.log("Part One: ", validNorthPole.length);

    const validPassports = this.passports.filter((str: string) => {
      return isValidPassport(str);
    });
    console.log("Part Two: ", validPassports.length);
  }
}
