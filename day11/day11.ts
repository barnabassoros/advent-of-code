import fs, { Dir } from "fs";
import readline from "readline";
import { Timer } from "../timer";

const file = readline.createInterface({
  input: fs.createReadStream("./day11/input.txt"),
  output: process.stdout,
  terminal: false,
});

let array: number[];
file.on("line", (line: string) => {
  array = line.split(" ").map((e) => parseInt(e));
});

file.on("close", () => {
  first2(structuredClone(array));
});

const blinkNumber = 75;

const first2 = (array: number[]) => {
  let zeroIterations: number[] = [0];
  for (let i = 0; i < blinkNumber; i++) {
    const newArray: number[] = [];
    array.forEach((element) => {
      if (element === 0) {
        zeroIterations[0]++;
      } else {
        if (element.toString().length % 2 === 0) {
          const [first, second] = splitString(element.toString());
          newArray.push(parseInt(first));
          newArray.push(parseInt(second));
        } else {
          newArray.push(element * 2024);
        }
      }
    });
    array = newArray;
    zeroIterations.unshift(0);
  }
  let sum = array.length;
  zeroIterations.forEach((element, i) => {
    sum += getLengthForNthZero(i) * element;
  });
  console.log("first", sum);
};

const first3 = (array: number[]) => {
  array.forEach((element) => {
    for (let i = 0; i < blinkNumber; i++) {
      getLengthForNthIteration(element);
    }
  });
};

interface Result {
  length: number;
  array: number[];
}

const iterationMap: Map<number, Result> = new Map();

const numberMap: Map<number, Map<number, Result>> = new Map();

const zeroWithArrayMap: Map<number, Result> = new Map();

const zerothResult = { length: 1, array: [0] };
zeroWithArrayMap.set(0, zerothResult);

const getLengthForNthIteration = (iteration: number, num: number) => {
  const iterationMap = numberMap.get(num);
  if (iterationMap) {
    const result = iterationMap.get(iteration);
    if (result) return result.length;
    else {
      
    }
  }
};

const getLengthForNthZero = (n: number) => {
  const mapResult = zeroWithArrayMap.get(n);
  if (mapResult) return mapResult.length;
  const res = calcForNthZero(n);
  zeroWithArrayMap.set(n, res);
  console.log("nth:", n, "length", res.length);
  return res.length;
};

const calcForNthZero = (n: number): Result => {
  const mapResult = zeroWithArrayMap.get(n - 1);
  const newArray: number[] = [];
  mapResult?.array.forEach((element) => {
    if (element === 0) {
      newArray.push(1);
    } else {
      if (element.toString().length % 2 === 0) {
        const [first, second] = splitString(element.toString());
        newArray.push(parseInt(first));
        newArray.push(parseInt(second));
      } else {
        newArray.push(element * 2024);
      }
    }
  });
  return { length: newArray.length, array: newArray };
};

const splitString = (string: string) => {
  const middle = Math.ceil(string.length / 2);
  const firstHalf = string.slice(0, middle);
  const secondHalf = string.slice(middle);
  return [firstHalf, secondHalf];
};
