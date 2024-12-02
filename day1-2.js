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
  let similarityScore = 0;
  a.forEach((aElement) => {
    let count = 0;
    b.forEach((bElement) => {
      if (aElement === bElement) {
        count++;
      }
    });
    similarityScore += aElement * count;
  });
  console.log(similarityScore);
});
