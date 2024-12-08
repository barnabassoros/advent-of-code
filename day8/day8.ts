import fs from "fs";
import readline from "readline";
import { Timer } from "../timer";

const file = readline.createInterface({
    input: fs.createReadStream("./day8/input.txt"),
    output: process.stdout,
    terminal: false,
});

const map: string[][] = [];
const charactersMap = new Map<string, Coordinate[]>();
let rowIndex = 0;
file.on("line", (line) => {
    const split = line.split("");
    map.push(split);
    split.forEach((char, index) => {
        if (char !== ".") {
            const array = charactersMap.get(char);
            const coord = { x: rowIndex, y: index };
            if (array) array.push(coord);
            else charactersMap.set(char, [coord]);
        }
    });
    rowIndex++;
});

file.on("close", () => {
    first(structuredClone(map));
    second(structuredClone(map));
});
interface Coordinate {
    x: number;
    y: number;
}

const first = (map: string[][]) => {
    const timer = new Timer();
    timer.startTimer();
    const antinodes: string[][] = [];
    map.forEach((row) => {
        antinodes.push(new Array(row.length).fill("."));
    });

    charactersMap.forEach((array) => {
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array.length; j++) {
                if (i != j) {
                    const { smaller, bigger } = calulateCoords(
                        array[i],
                        array[j]
                    );
                    const size = map.length;
                    if (isValidCoord(smaller, size, size))
                        antinodes[smaller.x][smaller.y] = "#";

                    if (isValidCoord(bigger, size, size))
                        antinodes[bigger.x][bigger.y] = "#";
                }
            }
        }
    });

    let count = 0;

    antinodes.forEach((row) => {
        row.forEach((element) => {
            if (element === "#") count++;
        });
    });

    console.log(timer.endTimer());
    console.log("first", count);
};

const isValidCoord = (
    coord: Coordinate,
    sizeX: number,
    sizeY: number
): boolean => {
    if (coord.x < 0 || coord.y < 0) return false;
    if (coord.x >= sizeX || coord.y >= sizeY) return false;
    return true;
};

const calulateCoords = (
    a: Coordinate,
    b: Coordinate
): { smaller: Coordinate; bigger: Coordinate } => {
    const { x: aX, y: aY } = a;
    const { x: bX, y: bY } = b;

    const dx = bX - aX;
    const dy = bY - aY;

    return {
        smaller: { x: aX - dx, y: aY - dy },
        bigger: { x: bX + dx, y: bY + dy },
    };
};

const second = (map: string[][]) => {
    const timer = new Timer();
    timer.startTimer();

    const antinodes: string[][] = [];
    map.forEach((row) => {
        antinodes.push(new Array(row.length).fill("."));
    });

    charactersMap.forEach((array) => {
        for (let i = 0; i < array.length; i++) {
            if(array.length>1) {
                antinodes[array[i].x][array[i].y] = "#";
            }
            for (let j = 0; j < array.length; j++) {
                if (i != j) {
                    const a = array[i];
                    const b = array[j];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    let smallerCoords = {
                        x: a.x - dx,
                        y: a.y - dy,
                    };
                    while (
                        isValidCoord(smallerCoords, map.length, map.length)
                    ) {
                        antinodes[smallerCoords.x][smallerCoords.y] = "#";
                        smallerCoords = {
                            x: smallerCoords.x - dx,
                            y: smallerCoords.y - dy,
                        };
                    }
                    let biggerCoords = {
                        x: b.x + dx,
                        y: b.y + dy,
                    };
                    while (isValidCoord(biggerCoords, map.length, map.length)) {
                        antinodes[biggerCoords.x][biggerCoords.y] = "#";
                        biggerCoords = {
                            x: biggerCoords.x + dx,
                            y: biggerCoords.y + dy,
                        };
                    }
                }
            }
        }
    });

    let count = 0;

    antinodes.forEach((row) => {
        row.forEach((element) => {
            if (element === "#") count++;
        });
    });

    console.log(timer.endTimer());
    console.log("second", count);
};
