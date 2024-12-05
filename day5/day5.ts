import fs from "fs";
import readline from "readline";
import { Graph } from "./graph";

const file = readline.createInterface({
  input: fs.createReadStream("./day5/day5-input.txt"),
  output: process.stdout,
  terminal: false,
});

const graph = new Graph();
const pagesArray: number[][] = [];
file.on("line", (line) => {
  if (line.includes("|")) {
    const split = line.split("|");
    const leftId = parseInt(split[0]);
    const rightId = parseInt(split[1]);

    const leftNode = graph.createOrGetNode(leftId);
    const rightNode = graph.createOrGetNode(rightId);

    leftNode.addConnection(rightNode);
  } else {
    if (line !== "") {
      pagesArray.push(line.split(",").map((element) => parseInt(element)));
    }
  }
});

file.on("close", () => {
  first();
  second();
});

const first = () => {
  let sum = 0;
  pagesArray.forEach((pages) => {
    let isCorrectOrder = true;
    for (let i = 0; i < pages.length - 1; i++) {
      const node = graph.getNodeById(pages[i]);
      const nextNode = graph.getNodeById(pages[i + 1]);
      if (!node?.isConnected(nextNode!)) {
        isCorrectOrder = false;
      }
    }
    if (isCorrectOrder) {
      sum += pages[Math.floor(pages.length / 2)];
    }
  });
  console.log("first", sum);
};

const second = () => {
  let sum = 0;
  pagesArray.forEach((pages) => {
    let isCorrectOrder = true;
    for (let i = 0; i < pages.length - 1; i++) {
      const node = graph.getNodeById(pages[i]);
      const nextNode = graph.getNodeById(pages[i + 1]);
      if (!node?.isConnected(nextNode!)) {
        isCorrectOrder = false;
      }
    }
    if (!isCorrectOrder) {
      pages.sort((a, b) => {
        const aNode = graph.getNodeById(a);
        const bNode = graph.getNodeById(b);
        if (aNode?.isConnected(bNode!)) {
          return -1;
        }
        if (bNode?.isConnected(aNode!)) {
          return 1;
        }
        return 0;
      });
      sum += pages[Math.floor(pages.length / 2)];
    }
  });
  console.log("second", sum);
};
