const fs = require("fs");

const readline = require("readline");
const file = readline.createInterface({
  input: fs.createReadStream("./day3-input.txt"),
  output: process.stdout,
  terminal: false,
});

let sum = 0;
let flag = true;
file.on("line", (line) => {
  const regex = /mul\([0-9]+,[0-9]+\)|do\(\)|don't\(\)/g;
  const found = [...line.matchAll(regex)];
  for (let i = 0; i < found.length; i++) {
    const element = found[i][0];
    const twoNumbers = element.slice(4, -1);
    console.log(element, twoNumbers, flag);
    if (element === "don't()") {
      flag = false;
    } else {
      if (element == "do()") {
        flag = true;
      } else {
        if (flag) {
          const split = twoNumbers.split(",");
          sum += parseInt(split[0]) * parseInt(split[1]);
        }
      }
    }
  }
});

file.on("close", () => {
  console.log(sum);
});
