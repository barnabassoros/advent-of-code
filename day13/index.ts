import fs from "fs";
import readline from "readline";
import { Timer } from "../timer";

const file = readline.createInterface({
  input: fs.createReadStream("./day13/input.txt"),
  output: process.stdout,
  terminal: false,
});

interface Button {
  x: number;
  y: number;
}

class Machine {
  buttonA?: Button;
  buttonB?: Button;
  prize?: {
    x: number;
    y: number;
  };
}

const machines: Machine[] = [];

file.on("line", (line) => {
  if (line.includes("Button")) {
    const split = line.split(":");
    const trimmed = split[1].trim();
    const x = parseInt(trimmed.split(",")[0].trim().split("+")[1]);
    const y = parseInt(trimmed.split(",")[1].trim().split("+")[1]);
    if (line.includes("A:")) {
      const machine = new Machine();
      machine.buttonA = { x, y };
      machines.push(machine);
    } else {
      machines[machines.length - 1].buttonB = { x, y };
    }
  } else {
    if (line.includes("Prize")) {
      const x = parseInt(
        line.split(":")[1].trim().split(",")[0].trim().split("=")[1]
      );
      const y = parseInt(
        line.split(":")[1].trim().split(",")[1].trim().split("=")[1]
      );
      machines[machines.length - 1].prize = {
        x: x + 10000000000000,
        y: y + 10000000000000,
      };
    }
  }
});

file.on("close", () => {
  first();
});

const first = () => {
  let sumToken = 0;
  machines.forEach((machine) => {
    sumToken += calculateTokens(machine);
  });

  console.log("first", sumToken);
};

const second = () => {};

const calculateTokens = (machine: Machine): number => {
  const A =
    (machine.prize!.x * machine.buttonB!.y -
      machine.prize!.y * machine.buttonB!.x) /
    (machine.buttonA!.x * machine.buttonB!.y -
      machine.buttonA!.y * machine.buttonB!.x);

  const B =
    (machine.buttonA!.x * machine.prize!.y -
      machine.buttonA!.y * machine.prize!.x) /
    (machine.buttonA!.x * machine.buttonB!.y -
      machine.buttonA!.y * machine.buttonB!.x);

  console.log(`A:${A}-B:${B}`);

  if (A === Math.floor(A) && B === Math.floor(B)) return A * 3 + B;
  return 0;
};
//A = (p_x*b_y - p_y*b_x) / (a_x*b_y - a_y*b_x)
// B = (a_x*p_y - a_y*p_x) / (a_x*b_y - a_y*b_x)
