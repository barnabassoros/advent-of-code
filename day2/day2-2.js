const fs = require("fs");

const readline = require("readline");
const file = readline.createInterface({
  input: fs.createReadStream("./day2-input.txt"),
  output: process.stdout,
  terminal: false,
});

let safeReportCount = 0;
file.on("line", (line) => {
  const split = line.split(" ");
  const report = split.map((item) => parseInt(item));
  const isSafe = isReportSafe(report);

  if (isSafe) safeReportCount++;
  console.log(line);
  if (!isSafe) {
    const isSafeByRemovingOneItemValue = isReportSafeByRemovingOneItem(report);
    if (isSafeByRemovingOneItemValue) {
      safeReportCount++;
    }
  }
});

const isReportSafe = (report) => {
  const isInc = report[1] > report[0];
  for (let i = 0; i < report.length - 1; i++) {
    const diff = report[i + 1] - report[i];
    if (isInc) {
      if (diff < 1 || diff > 3) {
        return false;
      }
    } else {
      if (diff < -3 || diff > -1) {
        return false;
      }
    }
  }
  return true;
};

const isReportSafeByRemovingOneItem = (report) => {
  for (let i = 0; i < report.length; i++) {
    const newAray = report.slice(0, i).concat(report.slice(i + 1));
    const result = isReportSafe(newAray);
    console.log(newAray.join(","), result);
    if (result) return true;
  }
  return false;
};

file.on("close", () => {
  console.log(safeReportCount);
});
