import PriorityQueue from "../utils/PriorityQueue";

const testData: string[] = [
    "jqt: rhn xhk nvd",
    "rsh: frs pzl lsr",
    "xhk: hfx",
    "cmg: qnr nvd lhk bvb",
    "rhn: xhk bvb hfx",
    "bvb: xhk hfx",
    "pzl: lsr hfx nvd",
    "qnr: nvd",
    "ntq: jqt hfx bvb xhk",
    "nvd: lhk",
    "lsr: lhk",
    "rzs: qnr cmg lsr rsh",
    "frs: qnr lhk lsr"
];

type Edge = {
    node: string,
    weight?: number
}

type Node = {
    name: string,
    edges: Edge[]
}

type Nodes = {
    [key: string]: Node
}

function parse(data: string[]): Nodes {
    const nodes = {} as Nodes;

    for (let i = 0; i < data.length; i++) {
        data[i]
            .replace(":", "")
            .split(" ")
            .forEach((n) => nodes[n] = {name: n, edges: [] });
    }

    for (let i = 0; i < data.length; i++) {
        const n = data[i].split(":");
        const source = nodes[n[0]];
        const dest = n[1].trim().split(" ");
        dest.forEach((d) => {
            source.edges.push({ node:d });
            nodes[d].edges.push({ node: source.name });
        })
    }

    return nodes;
}

const findShortestPath = (source: Node, destination: Node, graph: Nodes): string[] | undefined => {
    type QueueItem = {
        node: string,
        path: string[],
        distance: number
    };

    const queue = new PriorityQueue<QueueItem>({ comparator: (a, b) => a.distance - b.distance})
    queue.push({ node: source.name, path: [], distance: 0 });
    const visited = new Map();

    while (queue.length > 0) {
        const {
            node,
            path,
            distance
        } = queue.dequeue();

        visited.set(node, true);
        if (node === destination.name) {
            return path;
        }
        
        graph[node].edges.forEach((edge) => {
            if (visited.get(edge.node) === undefined) {
                queue.push({ 
                    node: graph[edge.node].name,
                    path: [ ...path, `${node}:${edge.node}` ],
                    distance: distance + (edge.weight || 1 )
                });
            }
        });
    }

    return undefined; // No path exists
}

const deleteEdge = (graph: Nodes, source: string, destination: string) => {
    const findAndDelete = (edges: Edge[], name: string) => {
        const index = edges.findIndex((e) => e.node === name);
        if (index !== -1) {
            edges.splice(index, 1);
        }
    }

    findAndDelete(graph[source].edges, destination);
    findAndDelete(graph[destination].edges, source);
}

const addEdge = (graph: Nodes, source: string, destination: string) => {
    graph[source].edges.push({ node: destination });
    graph[destination].edges.push({ node: source });
}

const findConnectedNodes = (graph: Nodes, start: string) => {
    const subGraphNodes = [];
    let queue = [graph[start].name];
    const visited = new Map();

    while (queue.length > 0) {
        let current = queue.shift() as string;

        if (visited.get(current)) {
            continue;
        }

        subGraphNodes.push(current);
        visited.set(current, true);

        graph[current].edges.forEach((edge) => {
            queue.push(edge.node);
        });
    }

    return subGraphNodes;
}

// This picks an arbitrary start node and then finds the shortest path to an arbitrary destination node.
//  It then performs 3 successive cuts and find the shortest path after each cut.
//  We know that the edges to cuts can't contain any edges from the previous shortest path.
//  Add we know that after 3 cuts, the graph should be disconnected if we've made the right cuts.
//  If there doesn't exist such a path, try picking a new node.
function part1(data: string[] = testData): number {
    const nodes = parse(data);
    const source = nodes[Object.keys(nodes)[0]];  // pick any node as source node
    let cuts: string[] = [];

    for (const [name, destination] of Object.entries(nodes)) {
        if (destination.name === source.name) {
            continue;
        }

        if (performCut(findShortestPath(source, destination, nodes))) {
            break;
        }

        function performCut(path: string[] | undefined): boolean {
            if (cuts.length === 3 && path === undefined) {
                console.log("Found cut edges=" + cuts);
                return true;
            } else if (cuts.length === 3 || path === undefined) {
                return false;
            }

            for (let i = 0; i < path.length; i++) {
                const [ s, d ] = path[i].split(":");
                cuts.push(path[i]);
                deleteEdge(nodes, s, d);
                const newPath = findShortestPath(source, destination, nodes);
                if (performCut(newPath)) {
                    return true;
                }
                addEdge(nodes, s, d);
                cuts.pop();
            }

            return false;
        }
    }

    let subgraph2 = [];
    let subgraph1 = findConnectedNodes(nodes, source.name);

    for (const name of Object.keys(nodes)) {
        if (!subgraph1.includes(name)) {
            subgraph2 = findConnectedNodes(nodes, name);
            break;
        }
    }

    return subgraph1.length * subgraph2.length;
}

function run(data: string[]): number {
    // return part1();
    return part1(data); 
}

export default run;