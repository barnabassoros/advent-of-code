import fs from "fs";
import readline from "readline";
import { Timer } from "../timer";

const file = readline.createInterface({
  input: fs.createReadStream("./day14/input.txt"),
  output: process.stdout,
  terminal: false,
});

const MAPWIDTH = 101; //101
const MAPHEIGHT = 103; //103

interface Robot {
  position: {
    x: number;
    y: number;
  };
  velocityX: number;
  velocityY: number;
}

const robots: Robot[] = [];

file.on("line", (line) => {
  const split = line.split(" ");
  const posX = parseInt(split[0].split("=")[1].split(",")[0]);
  const posY = parseInt(split[0].split("=")[1].split(",")[1]);

  const vX = parseInt(split[1].split("=")[1].split(",")[0]);
  const vY = parseInt(split[1].split("=")[1].split(",")[1]);

  robots.push({ position: { y: posX, x: posY }, velocityX: vY, velocityY: vX });
});

file.on("close", () => {
  first(structuredClone(robots));
  second(structuredClone(robots));
});

const second = (robots: Robot[]) => {
  let i = 0;
  while (1) {
    const map: string[][] = [];
    for (let i = 0; i < MAPHEIGHT; i++) {
      const row: string[] = [];
      for (let j = 0; j < MAPWIDTH; j++) {
        row.push(".");
      }
      map.push(row);
    }
    robots.forEach((robot) => {
      calculatePositionAfterNSeconds(robot, 1);
      map[robot.position.x][robot.position.y] = "#";
    });
    let string = "";
    let containsRow = false;
    for (let i = 0; i < MAPHEIGHT; i++) {
      let line = "";
      for (let j = 0; j < MAPWIDTH; j++) {
        line += map[i][j];
      }
      if (line.includes("######")) containsRow = true;
      string += line;
      string += "\n";
    }
    fs.writeFileSync("output.txt", string);
    i++;
    console.log(i);
  }
};

const first = (robots: Robot[]) => {
  const quadrantCount = [0, 0, 0, 0];
  const map: string[][] = [];
  for (let i = 0; i < MAPHEIGHT; i++) {
    const row: string[] = [];
    for (let j = 0; j < MAPWIDTH; j++) {
      row.push(".");
    }
    map.push(row);
  }
  robots.forEach((robot) => {
    calculatePositionAfterNSeconds(robot, 100);
    const qX = (MAPHEIGHT - 1) / 2;
    const qY = (MAPWIDTH - 1) / 2;

    const char = map[robot.position.x][robot.position.y];
    if (char === ".") {
      map[robot.position.x][robot.position.y] = "1";
    } else {
      map[robot.position.x][robot.position.y] = (parseInt(char) + 1).toString();
    }
    const isInTopHalf = robot.position.x < qX;
    const isInLeft = robot.position.y < qY;
    const isInBottomHalf = robot.position.x > qX;
    const isInRight = robot.position.y > qY;

    if (isInTopHalf && isInLeft) quadrantCount[0]++;
    if (isInTopHalf && isInRight) quadrantCount[1]++;
    if (isInBottomHalf && isInLeft) quadrantCount[2]++;
    if (isInBottomHalf && isInRight) quadrantCount[3]++;
  });
  console.log(
    "first",
    quadrantCount[0] * quadrantCount[1] * quadrantCount[2] * quadrantCount[3]
  );
};

const calculatePositionAfterNSeconds = (robot: Robot, n: number) => {
  for (let i = 0; i < n; i++) {
    calculatePositionAfterOneSecond(robot);
  }
};

const calculatePositionAfterOneSecond = (robot: Robot) => {
  let newX = robot.position.x + robot.velocityX;
  let newY = robot.position.y + robot.velocityY;
  if (newX >= MAPHEIGHT) newX -= MAPHEIGHT;
  if (newY >= MAPWIDTH) newY -= MAPWIDTH;
  if (newX < 0) newX = newX += MAPHEIGHT;
  if (newY < 0) newY = newY += MAPWIDTH;
  robot.position = {
    x: newX,
    y: newY,
  };
};
