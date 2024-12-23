export class Node {
    name: string;
    neighbours: Set<Node> = new Set();

    constructor(name: string) {
        this.name = name;
    }

    addNeighbour(n: Node) {
        this.neighbours.add(n);
    }

    areNeighbours(n: Node) {
        return this.neighbours.has(n);
    }
}

export class Graph {
    nodes: Node[] = [];

    addNode(n: Node) {
        this.nodes.push(n);
    }

    sort() {
        this.nodes.sort((a, b) => b.neighbours.size - a.neighbours.size);
    }

    addNeighbour(a: Node, b: Node) {
        a.addNeighbour(b);
        b.addNeighbour(a);
    }

    getOrCreateNode(name: string) {
        const node = this.findByName(name);
        if (node) return node;
        const newNode = new Node(name);
        this.addNode(newNode);
        return newNode;
    }

    findByName(name: string): undefined | Node {
        return this.nodes.find((node) => node.name === name);
    }

    isThreeClique(a: Node, b: Node, c: Node): boolean {
        return a.areNeighbours(b) && b.areNeighbours(c) && c.areNeighbours(a);
    }

    isClique(nodes: Node[]): boolean {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = 0; j < nodes.length; j++) {
                if (i !== j) {
                    if (!nodes[i].areNeighbours(nodes[j])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
