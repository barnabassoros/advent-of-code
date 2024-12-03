const fs = require("fs");

const readline = require("readline");
const file = readline.createInterface({
  input: fs.createReadStream("./day3-input.txt"),
  output: process.stdout,
  terminal: false,
});

let sum = 0;
file.on("line", (line) => {
  const regex = /mul\([0-9]+,[0-9]+\)/g;
  const found = [...line.matchAll(regex)];
  found.forEach((element) => {
    const twoNumbers = element[0].slice(4, -1);
    const split = twoNumbers.split(",");
    sum += parseInt(split[0]) * parseInt(split[1]);
  });
});

file.on("close", () => {
  console.log(sum);
});
