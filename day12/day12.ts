import fs, { Dir } from "fs";
import readline from "readline";
import { Timer } from "../timer";

const file = readline.createInterface({
  input: fs.createReadStream("./day12/input.txt"),
  output: process.stdout,
  terminal: false,
});

const map: string[][] = [];

file.on("line", (line) => {
  map.push(line.split(""));
});

file.on("close", () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      findNeighboursForCoord(map[i][j], { x: i, y: j });
    }
  }
  first();
  second();
});

interface Coordinate {
  x: number;
  y: number;
}

const plants: Set<string>[] = [];

const second = () => {
  let price = 0;

  plants.forEach((plant) => {
    const corners = calculateCorners(plant);
    const area = plant.size;
    console.log(`${area}*${corners}=${area * corners}`);
    price += corners * area;
  });

  console.log("second", price);
};

const first = () => {
  let price = 0;

  plants.forEach((plant) => {
    const perimeter = calculatePerimeter(plant);
    const area = plant.size;
    console.log(`${area}*${perimeter}=${area * perimeter}`);
    price += perimeter * area;
  });

  console.log("first", price);
};

const findNeighboursForCoord = (plant: string, coords: Coordinate) => {
  if (!plants.some((plant) => plant.has(stringifyCoords(coords)))) {
    const set: Set<string> = new Set();
    findNeighbours(plant, coords, set);
    plants.push(set);
  }
};

const findNeighbours = (
  plant: string,
  coords: Coordinate,
  set: Set<string>
): void => {
  if (
    isValidCoord(coords) &&
    !set.has(stringifyCoords(coords)) &&
    map[coords.x][coords.y] === plant
  ) {
    set.add(stringifyCoords(coords));
    findNeighbours(
      plant,
      {
        x: coords.x - 1,
        y: coords.y,
      },
      set
    );
    findNeighbours(
      plant,
      {
        x: coords.x,
        y: coords.y + 1,
      },
      set
    );
    findNeighbours(
      plant,
      {
        x: coords.x + 1,
        y: coords.y,
      },
      set
    );
    findNeighbours(
      plant,
      {
        x: coords.x,
        y: coords.y - 1,
      },
      set
    );
  }
};

const calculateCorners = (plants: Set<string>): number => {
  const coords: Coordinate[] = [];
  plants.forEach((plant) => {
    coords.push(destringifyCoords(plant));
  });
  const maxX = Math.max(...coords.map((c) => c.x));
  const maxY = Math.max(...coords.map((c) => c.y));
  const map: string[][] = [];
  for (let i = 0; i < maxX + 1; i++) {
    map.push(new Array(maxY + 1).fill("."));
  }
  coords.forEach((coord) => {
    map[coord.x][coord.y] = "X";
  });

  let corners = 0;
  if (coords.length === 1) return 4;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "X") {
        const isUpX = isValidCoord(
          { x: i - 1, y: j },
          map.length,
          map[i].length
        )
          ? map[i - 1][j] === "X"
          : false;

        const isRightX = isValidCoord(
          { x: i, y: j + 1 },
          map.length,
          map[i].length
        )
          ? map[i][j + 1] === "X"
          : false;

        const isDownX = isValidCoord(
          { x: i + 1, y: j },
          map.length,
          map[i].length
        )
          ? map[i + 1][j] === "X"
          : false;

        const isLeftX = isValidCoord(
          { x: i, y: j - 1 },
          map.length,
          map[i].length
        )
          ? map[i][j - 1] === "X"
          : false;

        const isTopLeftX = isValidCoord(
          { x: i - 1, y: j - 1 },
          map.length,
          map[i].length
        )
          ? map[i - 1][j - 1] === "X"
          : false;
        const isTopRightX = isValidCoord(
          { x: i - 1, y: j + 1 },
          map.length,
          map[i].length
        )
          ? map[i - 1][j + 1] === "X"
          : false;
        const isBottomLeftX = isValidCoord(
          { x: i + 1, y: j - 1 },
          map.length,
          map[i].length
        )
          ? map[i + 1][j - 1] === "X"
          : false;
        const isBottomRightX = isValidCoord(
          { x: i + 1, y: j + 1 },
          map.length,
          map[i].length
        )
          ? map[i + 1][j + 1] === "X"
          : false;

        if (isUpX && isRightX && !isDownX && !isLeftX) corners++;
        if (isUpX && isLeftX && !isDownX && !isRightX) corners++;
        if (isDownX && isRightX && !isUpX && !isLeftX) corners++;
        if (isDownX && isLeftX && !isUpX && !isRightX) corners++;

        if (isUpX && isRightX && !isTopRightX) corners++;
        if (isUpX && isLeftX && !isTopLeftX) corners++;
        if (isDownX && isRightX && !isBottomRightX) corners++;
        if (isDownX && isLeftX && !isBottomLeftX) corners++;

        if (isUpX && !isRightX && !isDownX && !isLeftX) corners += 2;
        if (!isUpX && isRightX && !isDownX && !isLeftX) corners += 2;
        if (!isUpX && !isRightX && isDownX && !isLeftX) corners += 2;
        if (!isUpX && !isRightX && !isDownX && isLeftX) corners += 2;
      }
    }
  }
  return corners;
};

const calculatePerimeter = (plants: Set<string>): number => {
  let sum = 0;
  const coords: Coordinate[] = [];
  plants.forEach((plant) => {
    coords.push(destringifyCoords(plant));
  });

  coords.forEach((plant1, index1) => {
    const neighbours = coords.filter(
      (plant2, index2) => index1 !== index2 && areNeighbours(plant1, plant2)
    );
    sum += 4 - neighbours.length;
  });
  return sum;
};

const areNeighbours = (a: Coordinate, b: Coordinate): boolean => {
  const xDiff = Math.abs(a.x - b.x);
  const yDiff = Math.abs(a.y - b.y);
  if ((a.x === b.x && yDiff === 1) || (a.y == b.y && xDiff === 1)) return true;
  return false;
};

const stringifyCoords = (coord: Coordinate): string => {
  return `${coord.x}-${coord.y}`;
};

const destringifyCoords = (coord: string): Coordinate => {
  const split = coord.split("-");
  return {
    x: parseInt(split[0]),
    y: parseInt(split[1]),
  };
};

const isValidCoord = (
  coord: Coordinate,
  xSize = map.length,
  ySize = map.length
): boolean => {
  if (coord.x < 0 || coord.x >= xSize) return false;
  if (coord.y < 0 || coord.y >= ySize) return false;
  return true;
};
