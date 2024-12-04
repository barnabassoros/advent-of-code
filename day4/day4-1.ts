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
  const verticalSum = getVerticalSum(matrix);
  const horizontalSum = getHorizontalSum(matrix);
  const diagonalSum = getTopLeftBottomRightDiagonalSum(matrix);
  const otherDiagonalSum = getTopRightBottomLeftDiagonalSum(matrix);

  console.log(verticalSum + horizontalSum + diagonalSum + otherDiagonalSum);
});

const xmasCount = (array: string[]): number => {
  const joined = array.join("");
  const pattern = /(XMAS|SAMX)/g; 
  const regex = new RegExp(pattern, "g");

  let count = 0;

  for (let i = 0; i < joined.length; i++) {
    regex.lastIndex = i;
    const match = regex.exec(joined);
    if (match && match.index === i) {
      count++;
    }
  }

  return count;
};

const getVerticalSum = (array: string[][]): number => {
  let sum = 0;
  array.forEach((row) => {
    sum += xmasCount(row);
  });
  return sum;
};

const getHorizontalSum = (array: string[][]): number => {
  let sum = 0;
  const transposed = array[0].map((_, colIndex) =>
    array.map((row) => row[colIndex])
  );
  transposed.forEach((row) => {
    sum += xmasCount(row);
  });
  return sum;
};

const getTopLeftBottomRightDiagonalSum = (array: string[][]): number => {
  var diagonal = new Array(2 * array.length - 1);
  for (var i = 0; i < diagonal.length; ++i) {
    diagonal[i] = [];
    if (i < array.length)
      for (var j = 0; j <= i; ++j) diagonal[i].push(array[i - j][j]);
    else
      for (var j = array.length - 1; j > i - array.length; --j)
        diagonal[i].push(array[j][i - j]);
  }
  let sum = 0;
  diagonal.forEach((row) => {
    sum += xmasCount(row);
  });
  return sum;
};

const getTopRightBottomLeftDiagonalSum = (array: string[][]): number => {
  const rotated = array[0].map((val, index) =>
    matrix.map((row) => row[row.length - 1 - index])
  );

  var diagonal = new Array(2 * rotated.length - 1);
  for (var i = 0; i < diagonal.length; ++i) {
    diagonal[i] = [];
    if (i < rotated.length)
      for (var j = 0; j <= i; ++j) diagonal[i].push(rotated[i - j][j]);
    else
      for (var j = rotated.length - 1; j > i - rotated.length; --j)
        diagonal[i].push(rotated[j][i - j]);
  }
  let sum = 0;
  diagonal.forEach((row) => {
    sum += xmasCount(row);
  });
  return sum;
};
