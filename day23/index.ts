import fs from "fs";
import readline from "readline";
import { Graph, Node } from "./graph";

const file = readline.createInterface({
    input: fs.createReadStream("./day23/input.txt"),
    output: process.stdout,
    terminal: false,
});

const graph = new Graph();

file.on("line", (line) => {
    const split = line.split("-");
    const a = graph.getOrCreateNode(split[0]);
    const b = graph.getOrCreateNode(split[1]);
    graph.addNeighbour(a, b);
});

file.on("close", () => {
    first();
    second();
});

const first = () => {
    const cliques: Set<string> = new Set();
    for (let i = 0; i < graph.nodes.length; i++) {
        for (let j = 0; j < graph.nodes.length; j++) {
            for (let k = 0; k < graph.nodes.length; k++) {
                if (i !== j && j !== k && k !== i) {
                    const a = graph.nodes[i];
                    const b = graph.nodes[j];
                    const c = graph.nodes[k];

                    if (
                        graph.isThreeClique(a, b, c) &&
                        startsWithT([a, b, c])
                    ) {
                        cliques.add(stringifyClique([a, b, c]));
                    }
                }
            }
        }
    }
    console.log("first", cliques.size);
};

let max = 0;
let maxNodes: string;
const second = () => {
    graph.sort();

    graph.nodes.forEach((n, index) => {
        maxClique([...n.neighbours].concat(n));
    });
    console.log("second", maxNodes);
};

const maxClique = (nodes: Node[]) => {
    if (nodes.length < max) {
        return;
    }
    if (graph.isClique(nodes)) {
        if (max < nodes.length) {
            max = nodes.length;
            maxNodes = stringifyClique(nodes);
        }
    } else {
        nodes.forEach((n) => {
            maxClique(nodes.filter((node) => node !== n));
        });
    }
};

const startsWithT = (nodes: Node[]): boolean => {
    return nodes.some((n) => n.name.startsWith("t"));
};

const stringifyClique = (nodes: Node[]) => {
    nodes.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });

    return nodes.map((n) => n.name).join(",");
};
