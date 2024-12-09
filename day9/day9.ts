import fs from "fs";
import readline from "readline";
import { Timer } from "../timer";

const file = readline.createInterface({
  input: fs.createReadStream("./day9/input.txt"),
  output: process.stdout,
  terminal: false,
});
let line = "";
file.on("line", (l) => {
  line = l;
});

file.on("close", () => {
  //   first(structuredClone(line));
  second(structuredClone(line));
});

const calculateHardDrive = (line: string): number[] => {
  const hardDrive: number[] = [];
  let hardDriveIndex = 0;
  line.split("").forEach((element, index) => {
    const num = parseInt(element);
    if (index % 2 === 0) {
      for (let i = 0; i < num; i++) {
        hardDrive.push(hardDriveIndex);
      }
      hardDriveIndex++;
    } else {
      for (let i = 0; i < num; i++) {
        hardDrive.push(-1);
      }
    }
  });
  return hardDrive;
};

const first = (line: string) => {
  const hardDrive = calculateHardDrive(line);

  const charNumber = hardDrive.filter((char) => !isFreeSpace(char)).length;
  let firstSpace = hardDrive.findIndex(isFreeSpace);
  while (charNumber > firstSpace) {
    const lastIndex = hardDrive.findLastIndex((char) => !isFreeSpace(char));
    [hardDrive[firstSpace], hardDrive[lastIndex]] = [
      hardDrive[lastIndex],
      hardDrive[firstSpace],
    ];
    firstSpace = hardDrive.findIndex(isFreeSpace);
  }

  const checkSum = calculateChecksum(hardDrive);
  console.log("first", checkSum);
};

const isFreeSpace = (element: number): boolean => {
  return element === -1;
};

const calculateChecksum = (array: number[]) => {
  let checkSum = 0;
  array.forEach((element, index) => {
    if (!isFreeSpace(element)) {
      checkSum += element * index;
    }
  });
  return checkSum;
};

const second = (line: string) => {
  const hardDrive = calculateHardDrive(line);

  let i = hardDrive.length - 1;
  let lastIndex = hardDrive.length - 1;
  while (i > 0) {
    if (isFreeSpace(hardDrive[i])) {
      if (!isFreeSpace(hardDrive[i - 1])) {
        lastIndex = i - 1;
      }
    } else {
      if (hardDrive[i] !== hardDrive[i - 1]) {
        fitIntoFirstSpace(hardDrive, i, lastIndex);
        lastIndex = i - 1;
      }
    }
    i--;
  }
  const checkSum = calculateChecksum(hardDrive);
  console.log("second", checkSum);
};

const fitIntoFirstSpace = (
  array: number[],
  firstIndex: number,
  lastIndex: number
) => {
  let availableSpaceFirstIndex = 0;
  let availableSize = 0;
  let isThisSpace = false;
  let i = 0;
  const size = lastIndex - firstIndex + 1;
  while (availableSize < size && i < array.length) {
    if (isFreeSpace(array[i])) {
      if (isThisSpace) {
        availableSize++;
      } else {
        isThisSpace = true;
        availableSize = 1;
        availableSpaceFirstIndex = i;
      }
    } else {
      isThisSpace = false;
    }
    i++;
  }
  if (availableSize === size && firstIndex > availableSpaceFirstIndex) {
    for (let j = 0; j < size; j++) {
      array[availableSpaceFirstIndex + j] = array[firstIndex + j];
      array[firstIndex + j] = -1;
    }
  }
};

// 00...111...2...333.44.5555.6666.777.888899
// lastIndex = 41
// firstIndex = 40

// lastIndex = 39
// firstIndex = 36
