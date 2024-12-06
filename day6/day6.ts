import fs from "fs";
import readline from "readline";

enum GuardDirection {
  UP = "^",
  RIGHT = ">",
  DOWN = "v",
  LEFT = "<",
}

interface Coordinate {
  walkedDirections: GuardDirection[];
}

const file = readline.createInterface({
  input: fs.createReadStream("./day6/input.txt"),
  output: process.stdout,
  terminal: false,
});

const matrix: string[][] = [];
let guardStartXPos: number;
let guardStartYPos: number;
let guardStartDirection: GuardDirection;

let rowCount = 0;
file.on("line", (line) => {
  const split = line.split("");
  matrix.push(split);
  const guardIndex = split.findIndex(
    (character) => character !== "#" && character !== "."
  );
  if (guardIndex !== -1) {
    guardStartXPos = guardIndex;
    guardStartYPos = rowCount;
    guardStartDirection = split[guardIndex] as GuardDirection;
  }

  rowCount++;
});

file.on("close", () => {
  //first(copyMatrix(matrix));
  second(copyMatrix(matrix));
});

const second = (matrix: string[][]) => {
  let obstructionCount = 0;
  const originalWalkedPath = getWalkedPath(copyMatrix(matrix));
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (originalWalkedPath[i][j] === "X") {
        const copy = copyMatrix(matrix);
        copy[i][j] = "#";
        const result = isALoop(copy);
        if (result) obstructionCount++;
      }
    }
  }
  console.log("second", obstructionCount);
};

const isALoop = (matrix: string[][]) => {
  let guardXPos = guardStartXPos;
  let guardYPos = guardStartYPos;
  let guardDirection = guardStartDirection;
  let outOfBounds = false;
  const directionMatrix: Coordinate[][] = matrix.map((row) => {
    return row.map((e) => {
      return { walkedDirections: [] };
    });
  });
  while (!outOfBounds) {
    matrix[guardYPos][guardXPos] = "X";
    directionMatrix[guardYPos][guardXPos].walkedDirections.push(guardDirection);
    const [nextX, nextY] = getNextPositon(guardDirection, guardXPos, guardYPos);
    outOfBounds = isNextStepOutOfBounds(matrix, nextX, nextY);
    if (!outOfBounds) {
      if (
        directionMatrix[nextY][nextX].walkedDirections.includes(guardDirection)
      )
        return true
      if (isNextStepObstacle(matrix, nextX, nextY)) {
        guardDirection = rotate(guardDirection);
      } else {
        guardXPos = nextX;
        guardYPos = nextY;
      }
    }
  }
  return false;
};

const getWalkedPath = (matrix: string[][]) => {
  let outOfBounds = false;
  let guardXPos = guardStartXPos;
  let guardYPos = guardStartYPos;
  let guardDirection = guardStartDirection;
  while (!outOfBounds) {
    matrix[guardYPos][guardXPos] = "X";
    const [nextX, nextY] = getNextPositon(guardDirection, guardXPos, guardYPos);
    outOfBounds = isNextStepOutOfBounds(matrix, nextX, nextY);
    if (outOfBounds) break;
    if (isNextStepObstacle(matrix, nextX, nextY)) {
      guardDirection = rotate(guardDirection);
    } else {
      guardXPos = nextX;
      guardYPos = nextY;
    }
  }
  return matrix;
};

const first = (matrix: string[][]) => {
  const walkedPath = getWalkedPath(copyMatrix(matrix));
  console.log("first", countX(walkedPath));
};

const getNextPositon = (
  guardDirection: GuardDirection,
  currentX: number,
  currentY: number
) => {
  switch (guardDirection) {
    case GuardDirection.UP:
      return [currentX, currentY - 1];
    case GuardDirection.RIGHT:
      return [currentX + 1, currentY];
    case GuardDirection.DOWN:
      return [currentX, currentY + 1];
    case GuardDirection.LEFT:
      return [currentX - 1, currentY];
  }
};

const countX = (matrix: string[][]) => {
  let count = 0;
  matrix.forEach((row) => {
    count += row.filter((element) => element === "X").length;
  });
  return count;
};

const isNextStepOutOfBounds = (
  matrix: string[][],
  nextX: number,
  nextY: number
): boolean => {
  if (nextX < 0 || nextX >= matrix.length) return true;
  if (nextY < 0 || nextY >= matrix[0].length) return true;
  return false;
};

const isNextStepObstacle = (
  matrix: string[][],
  nextX: number,
  nextY: number
): boolean => {
  return matrix[nextY][nextX] === "#";
};

const rotate = (guardDirection: GuardDirection) => {
  switch (guardDirection) {
    case GuardDirection.UP:
      return GuardDirection.RIGHT;
    case GuardDirection.RIGHT:
      return GuardDirection.DOWN;
    case GuardDirection.DOWN:
      return GuardDirection.LEFT;
    case GuardDirection.LEFT:
      return GuardDirection.UP;
  }
};

const copyMatrix = (matrix: string[][]) => {
  return matrix.map((row) => {
    return row.slice();
  });
};
