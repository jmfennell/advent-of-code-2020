import Command from "@oclif/command";
import { readFileSync } from "fs";

interface ISeat {
  row: number;
  column: number;
}

const getSeatID = (seat: ISeat): number => {
  return seat.row * 8 + seat.column;
};

const getRow = (boardingPassCharacters: string[]): number => {
  let minRow = 0;
  let maxRow = 127;
  for (let i = 0; i <= 6; i++) {
    const char = boardingPassCharacters[i];
    if (char === "F") {
      // Set the max to halfway between the current min and the current Max
      maxRow = Math.floor((maxRow - minRow) / 2) + minRow;
    } else if (char === "B") {
      minRow = Math.ceil((maxRow - minRow) / 2) + minRow;
      // Set the min to halfway between the max and the current min
    }
  }

  //By the time we have to to here, they should be the same
  return minRow;
};

const getColumn = (boardingPassCharacters: string[]): number => {
  let minColumn = 0;
  let maxColumn = 7;
  for (let i = 7; i <= 9; i++) {
    const char = boardingPassCharacters[i];
    if (char === "L") {
      // Set the max to halfway between the current min and the current Max
      maxColumn = Math.floor((maxColumn - minColumn) / 2) + minColumn;
    } else if (char === "R") {
      minColumn = Math.ceil((maxColumn - minColumn) / 2) + minColumn;
      // Set the min to halfway between the max and the current min
    }
  }
  return minColumn;
};
const getSeat = (boardingPass: string): ISeat => {
  const characters = boardingPass.split("");
  return {
    column: getColumn(characters),
    row: getRow(characters),
  };
};

const getSeatIDs = (boardingPasses: string[]): number[] => {
  let seatIDs: number[] = [];
  boardingPasses.forEach((boardingPass: string) => {
    seatIDs.push(getSeatID(getSeat(boardingPass)));
  });
  return seatIDs;
};

const getMissingNumber = (seats: number[], min: number): number => {
  const filteredSeats: number[] = seats
    .sort((a: number, b: number) => {
      return a - b;
    })
    .filter((seat: number, i: number) => {
      return seat !== i + min;
    });
  // There should be only one!
  return filteredSeats[0] - 1;
};
export class Day05 extends Command {
  static description = "Day Five";

  async run() {
    const file = readFileSync("src/input/05.txt", "utf-8");
    const lines: string[] = file.split("\n");
    const boardingPasses: string[] = lines.filter((line: string) => {
      return line.length > 0;
    });

    const seatIDs = getSeatIDs(boardingPasses);

    const maxSeatID = Math.max(...seatIDs);

    console.log("Part One: ", maxSeatID);

    const minSeatID = Math.min(...seatIDs);

    console.log("Part Two: ", getMissingNumber(seatIDs, minSeatID));
  }
}
