const fs = require("fs");

const readline = require("readline");
const file = readline.createInterface({
  input: fs.createReadStream("./day1-1-input.txt"),
  output: process.stdout,
  terminal: false,
});
const a = [];
const b = [];
file.on("line", (line) => {
  const split = line.split("   ");
  a.push(parseInt(split[0]));
  b.push(parseInt(split[1]));
});
file.on("close", () => {
  let sumOfDiff = 0;
  a.sort();
  b.sort();

  for (let i = 0; i < a.length; i++) {
    sumOfDiff += Math.abs(a[i] - b[i]);
  }

  console.log(sumOfDiff);
});