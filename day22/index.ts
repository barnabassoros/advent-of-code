import fs, { Dir } from "fs";
import readline from "readline";
import { Timer } from "../timer";

const file = readline.createInterface({
    input: fs.createReadStream("./day22/input.txt"),
    output: process.stdout,
    terminal: false,
});

const numbers: bigint[] = [];

file.on("line", (line) => {
    numbers.push(BigInt(line));
});

file.on("close", () => {
    first();
    second();
});

const first = () => {
    const newNumbers = numbers.map((num) => {
        let temp = num;
        for (let i = 0; i < 2000; i++) {
            temp = calcNumber(temp);
        }
        return temp;
    });

    const sum = newNumbers.reduce((prev, current) => prev + current, 0n);

    console.log("first", Number(sum));
};

function generateCombinations(): number[][] {
    const results: number[][] = [];

    for (let i = -9; i <= 9; i++) {
        for (let j = -9; j <= 9; j++) {
            for (let k = -9; k <= 9; k++) {
                for (let l = -9; l <= 9; l++) {
                    results.push([i, j, k, l]);
                }
            }
        }
    }

    return results;
}

const second = () => {
    const map: Map<bigint, number[]> = new Map();
    const combinations = generateCombinations().filter((comb) => {
        const sum = comb.reduce((prev, current) => prev + current, 0);
        return sum >= 0;
    });
    numbers.forEach((num) => {
        let temp = num;
        let array = [Number(num % 10n)];
        for (let i = 0; i < 2000; i++) {
            temp = calcNumber(temp);
            array.push(Number(temp % 10n));
        }
        map.set(num, array);
        return temp;
    });
    let max = 0;
    combinations.forEach((comb, index) => {
        console.log(index);
        let sum = 0;
        map.forEach((value) => {
            sum += getSequence(value, comb);
        });
        if (sum > max) max = sum;
    });

    console.log("second", max);
};

const getSequence = (numbers: number[], sequence: number[]): number => {
    let i = 4;
    while (i < numbers.length) {
        const first = numbers[i] - numbers[i - 1] === sequence[3];
        const second = numbers[i - 1] - numbers[i - 2] === sequence[2];
        const third = numbers[i - 2] - numbers[i - 3] === sequence[1];
        const fourth = numbers[i - 3] - numbers[i - 4] === sequence[0];
        if (first && second && third && fourth) {
            return numbers[i];
        }
        i++;
    }
    return 0;
};

const calcNumber = (num: bigint): bigint => {
    let temp = num * 64n;
    temp = mix(temp, num);
    temp = prune(temp); //first step

    let temp2 = temp / 32n;
    temp = mix(temp2, temp);
    temp = prune(temp); // second step

    let temp3 = temp * 2048n;
    temp = mix(temp3, temp);
    temp = prune(temp); // third step

    return temp;
};

const mix = (a: bigint, b: bigint): bigint => {
    return a ^ b;
};

const prune = (a: bigint) => {
    return a % 16777216n;
};
