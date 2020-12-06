import Command from "@oclif/command";
import { group } from "console";
import { readFileSync } from "fs";

const IndividualAnswersByGroup = (data: string[]): string[][] => {
  const groupedAnswers: string[][] = [];
  let groupAnswers: string[] = [];
  data.forEach((individualAnswer: string) => {
    if (individualAnswer.trimEnd().length === 0) {
      if (groupAnswers.length > 0) {
        groupedAnswers.push(groupAnswers);
      }
      groupAnswers = [];
    } else {
      groupAnswers.push(individualAnswer);
    }
  });
  return groupedAnswers;
};

const letterFromNumber = (i: number): string => {
  return (i + 10).toString(36);
};

const NumberOfQuestionsAllAnsweredByGroup = (data: string[]): number[] => {
  const answersByGroup = IndividualAnswersByGroup(data);
  let counts: number[] = [];
  answersByGroup.forEach((answers: string[]) => {
    let groupCount = 0;
    for (let i = 0; i < 26; i++) {
      let numberOfMatches = 0;
      answers.forEach((answer: string) => {
        if (answer.includes(letterFromNumber(i))) {
          numberOfMatches = numberOfMatches + 1;
        }
      });
      if (numberOfMatches === answers.length) {
        groupCount = groupCount + 1;
      }
    }
    counts.push(groupCount);
  });
  return counts;
};

const GenerateGroupAnswers = (data: string[]): string[][] => {
  const groupsAnswers: string[] = [];
  let groupAnswers: string;
  data.forEach((individualAnswer: string) => {
    if (individualAnswer.trimEnd().length === 0) {
      if (groupAnswers.length > 0) {
        groupsAnswers.push(groupAnswers);
      }
      groupAnswers = "";
    } else {
      groupAnswers = groupAnswers + individualAnswer;
    }
  });

  const splitAnswers: string[][] = [];
  groupsAnswers.forEach((groupAnswer: string) => {
    splitAnswers.push(groupAnswer.split(""));
  });

  return splitAnswers;
};

const GenerateUniqueGroupAnswers = (data: string[]): string[][] => {
  const groupAnswers: string[][] = [];
  GenerateGroupAnswers(data).forEach((answers: string[]) => {
    groupAnswers.push(
      answers.filter((answer: string, index: number, answers: string[]) => {
        return index === answers.indexOf(answer);
      })
    );
  });
  return groupAnswers;
};

const CountsOfYesPerGroup = (data: string[]): number[] => {
  const counts: number[] = [];
  const groupAnswers = GenerateUniqueGroupAnswers(data);
  groupAnswers.forEach((answer: string[]) => {
    counts.push(answer.length);
  });
  return counts;
};

export class Day06 extends Command {
  static description = "Day Six";

  async run() {
    const file = readFileSync("src/input/06.txt", "utf-8");
    const lines: string[] = file.split("\n");
    console.log(
      "Part One: ",
      CountsOfYesPerGroup(lines).reduce((a: number, b: number) => {
        return a + b;
      })
    );
    console.log(
      "Part Two: ",
      NumberOfQuestionsAllAnsweredByGroup(lines).reduce(
        (a: number, b: number) => {
          return a + b;
        }
      )
    );
  }
}
