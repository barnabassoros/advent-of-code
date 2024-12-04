import fs from "fs";
import readline from "readline";

const file = readline.createInterface({
  input: fs.createReadStream("./day4/day4-input.txt"),
  output: process.stdout,
  terminal: false,
});
const matrix: string[][] = [];
file.on("line", (line) => {
  const split = line.split("");
  matrix.push(split);
});

file.on("close", () => {
  let sum = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (i + 2 < matrix.length && j + 2 < matrix[i].length) {
        const newM = [
          [matrix[i][j], matrix[i][j + 1], matrix[i][j + 2]],
          [matrix[i + 1][j], matrix[i + 1][j + 1], matrix[i + 1][j + 2]],
          [matrix[i + 2][j], matrix[i + 2][j + 1], matrix[i + 2][j + 2]],
        ];
        if (match(newM)) sum++;
      }
    }
  }
  console.log(sum);
});

const match = (temp: string[][]): boolean => {
  const results = matchers.map((matcher) => {
    let result = true;
    for (let i = 0; i < temp.length; i++) {
      for (let j = 0; j < temp[i].length; j++) {
        if (matcher[i][j] !== ".") {
          if (temp[i][j] !== matcher[i][j]) {
            result = false;
          }
        }
      }
    }
    return result;
  });
  return results.some((r) => r);
};

const matcher1 = [
  ["M", ".", "M"],
  [".", "A", "."],
  ["S", ".", "S"],
];

const matcher2 = [
  ["M", ".", "S"],
  [".", "A", "."],
  ["M", ".", "S"],
];

const matcher3 = [
  ["S", ".", "S"],
  [".", "A", "."],
  ["M", ".", "M"],
];
const matcher4 = [
  ["S", ".", "M"],
  [".", "A", "."],
  ["S", ".", "M"],
];

const matchers = [matcher1, matcher2, matcher3, matcher4];
