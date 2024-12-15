import fs from "fs";
import readline from "readline";

const file = readline.createInterface({
  input: fs.createReadStream("./day15/input.txt"),
  output: process.stdout,
  terminal: false,
});
const map: string[][] = [];

enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

file.on("line", (line: string) => {
  if (line.includes("#")) {
    const split = line.split("");
    map.push(split);
  }
  if (
    line.includes("v") ||
    line.includes(">") ||
    line.includes("<") ||
    line.includes("^")
  ) {
    const split = line.split("");
    split.forEach((char) => {
      switch (char) {
        case "v":
          steps.push(Direction.DOWN);
          break;
        case ">":
          steps.push(Direction.RIGHT);
          break;
        case "<":
          steps.push(Direction.LEFT);
          break;
        case "^":
          steps.push(Direction.UP);
          break;
      }
    });
  }
});
const steps: Direction[] = [];

file.on("close", () => {
  first(structuredClone(map), structuredClone(steps));
  second(structuredClone(map), structuredClone(steps));
});

interface Coordinate {
  x: number;
  y: number;
}

const first = (map: string[][], steps: Direction[]) => {
  let robotPos: Coordinate;

  map.forEach((row, i) => {
    row.forEach((char, j) => {
      if (char === "@") {
        robotPos = { x: i, y: j };
      }
    });
  });

  steps.forEach((step) => {
    robotPos = stepOnce(map, step, robotPos);
  });

  let score = 0;
  map.forEach((row, i) => {
    row.forEach((char, j) => {
      if (char === "O") {
        score += i * 100 + j;
      }
    });
  });
  console.log("first", score);
};

const stepOnce = (map: string[][], step: Direction, robotPos: Coordinate) => {
  const nextCoord = getNextCoords(step, robotPos);
  const nextCoordChar = map[nextCoord.x][nextCoord.y];
  if (nextCoordChar === "#") return robotPos;
  if (nextCoordChar === ".") {
    map[robotPos.x][robotPos.y] = ".";
    map[nextCoord.x][nextCoord.y] = "@";
    robotPos = nextCoord;
    return robotPos;
  }
  const didPush = pushDir(map, step, nextCoord);
  if (didPush) {
    map[robotPos.x][robotPos.y] = ".";
    map[nextCoord.x][nextCoord.y] = "@";
    robotPos = nextCoord;
  }
  return robotPos;
};

const stepOnceWide = (
  map: string[][],
  step: Direction,
  robotPos: Coordinate
) => {
  const nextCoord = getNextCoords(step, robotPos);
  const nextCoordChar = map[nextCoord.x][nextCoord.y];
  if (nextCoordChar === "#") return robotPos;
  if (nextCoordChar === ".") {
    map[robotPos.x][robotPos.y] = ".";
    map[nextCoord.x][nextCoord.y] = "@";
    robotPos = nextCoord;
    return robotPos;
  }
  const didPush = pushDirWide(map, step, nextCoord);
  if (didPush) {
    map[robotPos.x][robotPos.y] = ".";
    map[nextCoord.x][nextCoord.y] = "@";
    robotPos = nextCoord;
  }
  return robotPos;
};

const pushDir = (
  map: string[][],
  step: Direction,
  coord: Coordinate
): boolean => {
  const nextFreeSpace = getNextFreeSpace(map, step, structuredClone(coord));
  if (map[nextFreeSpace.x][nextFreeSpace.y] === "#") return false;
  map[nextFreeSpace.x][nextFreeSpace.y] = "O";
  map[coord.x][coord.y] = ".";
  return true;
};

const pushDirWide = (
  map: string[][],
  step: Direction,
  coord: Coordinate
): boolean => {
  if (step === Direction.RIGHT) {
    const freeY = map[coord.x]
      .slice(coord.y, map[coord.x].length)
      .findIndex((char) => char === ".");

    const firstWall = map[coord.x]
      .slice(coord.y, map[coord.x].length)
      .findIndex((char) => char === "#");
    if (firstWall < freeY) return false;

    if (freeY === -1) return false;
    const x = coord.x;
    map[x].splice(freeY + coord.y, 1);
    map[x] = [...map[x].slice(0, coord.y), ".", ...map[x].slice(coord.y)];
    return true;
  }
  if (step === Direction.LEFT) {
    const freeY = map[coord.x]
      .slice(0, coord.y)
      .findLastIndex((char) => char === ".");

    const firstWall = map[coord.x]
      .slice(0, coord.y)
      .findLastIndex((char) => char === "#");
    if (firstWall > freeY) return false;
    if (freeY === -1) return false;
    const x = coord.x;
    map[x].splice(freeY, 1);
    map[x] = [...map[x].slice(0, coord.y), ".", ...map[x].slice(coord.y)];
    return true;
  }

  const moveArray: boolean[] = new Array(map[0].length).fill(false);
  const startY = map[coord.x][coord.y] === "[" ? coord.y : coord.y - 1;
  const dX = step === Direction.UP ? -1 : 1;

  moveArray[startY] = true;
  moveArray[startY + 1] = true;

  return moveNeighbour(map, moveArray, coord.x, dX);
};

const moveNeighbour = (
  map: string[][],
  moveArray: boolean[],
  x: number,
  dX: number
): boolean => {
  const newX = x + dX;
  const isEveryCellEmpty = moveArray.every((shouldMove, index) => {
    if (shouldMove && map[newX][index] === ".") return true;
    if (!shouldMove) return true;
    return false;
  });
  if (isEveryCellEmpty) {
    moveArray.forEach((shouldMove, index) => {
      if (shouldMove) {
        map[newX][index] = map[x][index];
        map[x][index] = ".";
      }
    });
    return true;
  }
  const canEveryCellMove = moveArray.every((shouldMove, index) => {
    if (shouldMove && map[newX][index] !== "#") return true;
    if (!shouldMove) return true;
    return false;
  });
  if (canEveryCellMove) {
    const newMoveArray: boolean[] = new Array(moveArray.length).fill(false);
    moveArray.forEach((shouldMove, index) => {
      if (shouldMove && map[newX][index] === "[") {
        newMoveArray[index] = true;
        newMoveArray[index + 1] = true;
      }
      if (shouldMove && map[newX][index] === "]") {
        newMoveArray[index] = true;
        newMoveArray[index - 1] = true;
      }
    });
    const neighbourMoved = moveNeighbour(map, newMoveArray, newX, dX);
    if (neighbourMoved) {
      moveArray.forEach((shouldMove, index) => {
        if (shouldMove) {
          map[newX][index] = map[x][index];
          map[x][index] = ".";
        }
      });
      return true;
    }
  }
  return false;
};

const getNextFreeSpace = (
  map: string[][],
  step: Direction,
  coord: Coordinate
) => {
  let dX, dY;
  switch (step) {
    case Direction.UP:
      dX = -1;
      dY = 0;
      break;
    case Direction.RIGHT:
      dX = 0;
      dY = 1;
      break;
    case Direction.LEFT:
      dX = 0;
      dY = -1;
      break;
    case Direction.DOWN:
      dX = +1;
      dY = 0;
      break;
  }
  while (map[coord.x][coord.y] === "O") {
    coord.x += dX;
    coord.y += dY;
  }
  return coord;
};

const getNextCoords = (dir: Direction, pos: Coordinate): Coordinate => {
  switch (dir) {
    case Direction.UP:
      return { x: pos.x - 1, y: pos.y };
    case Direction.RIGHT:
      return { x: pos.x, y: pos.y + 1 };
    case Direction.LEFT:
      return { x: pos.x, y: pos.y - 1 };
    case Direction.DOWN:
      return { x: pos.x + 1, y: pos.y };
  }
};

const second = (map: string[][], steps: Direction[]) => {
  const newMap: string[][] = [];
  map.forEach((row) => {
    const newRow: string[] = [];
    row.forEach((char) => {
      switch (char) {
        case "#":
          newRow.push("#");
          newRow.push("#");
          break;
        case "@":
          newRow.push("@");
          newRow.push(".");
          break;
        case ".":
          newRow.push(".");
          newRow.push(".");
          break;
        case "O":
          newRow.push("[");
          newRow.push("]");
          break;
      }
    });
    newMap.push(newRow);
  });
  let robotPos: Coordinate;

  newMap.forEach((row, i) => {
    row.forEach((char, j) => {
      if (char === "@") {
        robotPos = { x: i, y: j };
      }
    });
  });
  createString(newMap);

  steps.forEach((step) => {
    robotPos = stepOnceWide(newMap, step, robotPos);
    // createString(newMap);
  });
  createString(newMap);

  let score = 0;
  newMap.forEach((row, i) => {
    row.forEach((char, j) => {
      if (char === "[") {
        score += i * 100 + j;
      }
    });
  });
  console.log("second", score);
};

const createString = (map: string[][]) => {
  let string = "";
  map.forEach((row) => {
    string += row.join("");
    string += "\n";
  });
  fs.writeFileSync("output.txt", string);
};
