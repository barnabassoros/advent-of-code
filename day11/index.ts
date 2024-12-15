import fs from "fs";
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
  first(structuredClone(array));
});

const blinkNumber = 75;

const first = (array: number[]) => {
  let countMap = new Map<number, number>();
  array.forEach((element) => {
    const count = countMap.get(element);
    if (count) countMap.set(element, count + 1);
    else countMap.set(element, 1);
  });
  for (let i = 0; i < blinkNumber; i++) {
    const newMap = new Map<number, number>();
    countMap.forEach((count, value) => {
      const newValues = blink(value);
      newValues.forEach((v) => {
        const a = newMap.get(v);
        if (a) newMap.set(v, a + count);
        else newMap.set(v, count);
      });
    });
    countMap = newMap;
  }
  let length = 0;
  countMap.forEach((count) => {
    length += count;
  });
  console.log("first", length);
};

const blink = (num: number): number[] => {
  const array: number[] = [];
  if (num === 0) {
    array.push(1);
  } else {
    if (num.toString().length % 2 === 0) {
      const [first, second] = splitString(num.toString());
      array.push(parseInt(first));
      array.push(parseInt(second));
    } else {
      array.push(num * 2024);
    }
  }
  return array;
};

const splitString = (string: string) => {
  const middle = Math.ceil(string.length / 2);
  const firstHalf = string.slice(0, middle);
  const secondHalf = string.slice(middle);
  return [firstHalf, secondHalf];
};
