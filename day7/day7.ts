import fs from "fs";
import readline from "readline";
import { Timer } from "../timer";

const file = readline.createInterface({
  input: fs.createReadStream("./day7/input.txt"),
  output: process.stdout,
  terminal: false,
});

interface Equation {
  result: number;
  numbers: number[];
}
const equations: Equation[] = [];

file.on("line", (line) => {
  const splitByColon = line.split(":");
  const result = parseInt(splitByColon[0]);
  const remainder = splitByColon[1].trim();
  const splitBySpace = remainder.split(" ");
  const numbers = splitBySpace.map((num) => parseInt(num));
  equations.push({ result, numbers });
});

file.on("close", () => {
  first();
  second();
});

const generateCombinations = (
  length: number,
  characters: string[]
): string[][] => {
  if (length <= 0) {
    return [];
  }
  const combine = (current: string[], depth: number): string[][] => {
    if (depth === length) {
      return [current];
    }
    const results: string[][] = [];
    for (const char of characters) {
      results.push(...combine([...current, char], depth + 1));
    }
    return results;
  };

  return combine([], 0);
};

const calculateWithCombination = (combination: string[], numbers: number[]) => {
  let result = numbers[0];
  for (let i = 0; i < numbers.length - 1; i++) {
    if (combination[i] === "*") {
      result = result * numbers[i + 1];
    }
    if (combination[i] === "+") {
      result = result + numbers[i + 1];
    }
    if (combination[i] === "|") {
      result = parseInt(result.toString().concat(numbers[i + 1].toString()));
    }
  }
  return result;
};

const first = () => {
  const timer = new Timer();
  timer.startTimer();
  let sum = 0;
  equations.forEach((equation) => {
    const combinations = generateCombinations(equation.numbers.length - 1, [
      "*",
      "+",
    ]);
    const result = combinations.some(
      (combination) =>
        calculateWithCombination(combination, equation.numbers) ===
        equation.result
    );
    if (result) sum += equation.result;
  });
  console.log(timer.endTimer());
  console.log("first", sum);
};

const second = () => {
  const timer = new Timer();
  timer.startTimer();
  let sum = 0;
  equations.forEach((equation) => {
    const combinations = generateCombinations(equation.numbers.length - 1, [
      "*",
      "+",
      "|",
    ]);
    const result = combinations.some(
      (combination) =>
        calculateWithCombination(combination, equation.numbers) ===
        equation.result
    );
    if (result) sum += equation.result;
  });
  console.log(timer.endTimer());
  console.log("first", sum);
};
