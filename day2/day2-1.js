const fs = require("fs");

const readline = require("readline");
const file = readline.createInterface({
  input: fs.createReadStream("./day2-input.txt"),
  output: process.stdout,
  terminal: false,
});

let safeReportCount = 0;
file.on("line", (line) => {
  const report = line.split(" ");
  const isInc = parseInt(report[1]) > parseInt(report[0]);
  let isSafe = true;
  for (let i = 0; i < report.length - 1; i++) {
    const diff = parseInt(report[i + 1]) - parseInt(report[i]);
    if (isInc) {
      if (diff < 1 || diff > 3) isSafe = false;
    } else {
      if (diff < -3 || diff > -1) isSafe = false;
    }
  }
  if (isSafe) safeReportCount++;
});

file.on("close", () => {
  console.log(safeReportCount);
});
