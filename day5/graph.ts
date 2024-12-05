export class Graph {
  nodes: Node[];

  constructor() {
    this.nodes = [];
  }

  addNode(node: Node) {
    this.nodes.push(node);
  }

  getNodeById = (id: number): Node | undefined => {
    return this.nodes.find((node) => node.id === id);
  };

  existsNode = (id: number): boolean => {
    const node = this.getNodeById(id);
    return node !== undefined;
  };

  createOrGetNode = (id: number): Node => {
    let node;
    if (!this.existsNode(id)) {
      node = new Node(id);
      this.addNode(node);
    } else {
      node = this.getNodeById(id);
    }
    return node!;
  };
}

export class Node {
  id: number;
  connectedTo: Node[];

  constructor(id: number) {
    this.id = id;
    this.connectedTo = [];
  }

  addConnection(node: Node): void {
    this.connectedTo.push(node);
  }

  isConnected(node: Node): boolean {
    return this.connectedTo.includes(node);
  }
}
