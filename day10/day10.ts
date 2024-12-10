import fs, { Dir } from "fs";
import readline from "readline";
import { Timer } from "../timer";

enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

const directionMap = new Map<Direction, Direction[]>();
directionMap.set(Direction.UP, [Direction.RIGHT, Direction.UP, Direction.LEFT]);
directionMap.set(Direction.RIGHT, [
  Direction.UP,
  Direction.DOWN,
  Direction.RIGHT,
]);
directionMap.set(Direction.LEFT, [
  Direction.LEFT,
  Direction.DOWN,
  Direction.UP,
]);
directionMap.set(Direction.DOWN, [
  Direction.RIGHT,
  Direction.DOWN,
  Direction.LEFT,
]);

const file = readline.createInterface({
  input: fs.createReadStream("./day10/input.txt"),
  output: process.stdout,
  terminal: false,
});

const map: number[][] = [];

file.on("line", (line) => {
  const split = line.split("");
  map.push(
    split.map((e) => {
      if (e === ".") return -1;
      return parseInt(e);
    })
  );
});

file.on("close", () => {
  first(structuredClone(map));
  second();
});

const first = (map: number[][]) => {
  let sum = 0;
  map.forEach((row, i) => {
    row.forEach((element, j) => {
      if (element === 0) {
        const start = { x: i, y: j };
        const s = calculateScoreOfTrailhead(map, start, i, j);
        sum += s;
      }
    });
  });

  console.log("first", resSet.size);
  console.log("second", paths.size);
};

interface Coordinate {
  x: number;
  y: number;
}

const resSet = new Set<string>();
const paths = new Set<string>();

const calculateScoreOfTrailhead = (
  map: number[][],
  start: Coordinate,
  x: number,
  y: number
): number => {
  //   let path = `x:${x}-y:${y}-`;
  const path: Coordinate[] = [];

  const upResult = moveDirection(map, start, path, x, y, Direction.UP);
  const rightResult = moveDirection(map, start, path, x, y, Direction.RIGHT);
  const downResult = moveDirection(map, start, path, x, y, Direction.DOWN);
  const leftResult = moveDirection(map, start, path, x, y, Direction.LEFT);
  return upResult + rightResult + downResult + leftResult;
};

const moveDirection = (
  map: number[][],
  start: Coordinate,
  path: Coordinate[],
  x: number,
  y: number,
  direction: Direction
): number => {
  const currentHeight = map[x][y];
  if (currentHeight === 9) {
    path.push({ x, y });
    resSet.add(`startX:${start.x}-startY:${start.y}-endX:${x}-endY${y}`);
    const pathString = path.map((p) => `(${p.x}-${p.y})`).join(",");
    paths.add(pathString);
    return 1;
  }
  const { newY, newX } = getNextStepCoord(direction, x, y);
  if (validCoord(map, newX, newY)) {
    const nextHeight = map[newX][newY];
    if (nextHeight - currentHeight === 1) {
      path.push({ x, y });
      const directions = directionMap.get(direction);
      let sum = 0;
      directions?.forEach((dir) => {
        sum += moveDirection(
          map,
          start,
          structuredClone(path),
          newX,
          newY,
          dir
        );
      });
      path.pop();
      return sum;
    } else {
      path.pop();
      return 0;
    }
  } else {
    path.pop();
    return 0;
  }
};

const validCoord = (map: number[][], x: number, y: number) => {
  if (x < 0 || x >= map.length) return false;
  if (y < 0 || y > map.length) return false;
  return true;
};

const getNextStepCoord = (direction: Direction, x: number, y: number) => {
  let newX = x;
  let newY = y;

  switch (direction) {
    case Direction.RIGHT:
      newY += 1;
      break;
    case Direction.DOWN:
      newX += 1;
      break;
    case Direction.LEFT:
      newY += -1;
      break;
    case Direction.UP:
      newX += -1;
      break;
  }
  return { newX, newY };
};

const second = () => {};
