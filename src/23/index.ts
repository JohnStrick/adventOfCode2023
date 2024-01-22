import Queue from "../utils/Queue";

const testData: string[] = [
    "#.#####################",
    "#.......#########...###",
    "#######.#########.#.###",
    "###.....#.>.>.###.#.###",
    "###v#####.#v#.###.#.###",
    "###.>...#.#.#.....#...#",
    "###v###.#.#.#########.#",
    "###...#.#.#.......#...#",
    "#####.#.#.#######.#.###",
    "#.....#.#.#.......#...#",
    "#.#####.#.#.#########v#",
    "#.#...#...#...###...>.#",
    "#.#.#v#######v###.###v#",
    "#...#.>.#...>.>.#.###.#",
    "#####v#.#.###v#.#.###.#",
    "#.....#...#...#.#.#...#",
    "#.#########.###.#.#.###",
    "#...###...#...#...#.###",
    "###.###.#.###v#####v###",
    "#...#...#.#.>.>.#.>.###",
    "#.###.###.#.###.#.#v###",
    "#.....###...###...#...#",
    "#####################.#"
];

type Pos = {
    x: number,
    y: number
}

function part1(data: string[] = testData): number {
    const start = { x: data[0].indexOf("."), y: 0 };
    const end = { x: data[data.length - 1].indexOf("."), y: data.length - 1 };
    const moves = [ [-1, 0], [1, 0], [0, -1], [0, 1] ];
    const distances: number[] = [];
    const getKey = (node: Pos): string => node.y + "," + node.x;

    type QueueItem = {
        pos: Pos,
        visited: Map<string, boolean>,
        distance: number
    }

    const queue: QueueItem[] = [ { pos: start, visited: new Map(), distance: 0 }];
    while (queue.length > 0) {
        let {
            pos,
            visited,
            distance
        } = queue.shift() as QueueItem;

        if (pos.x === end.x && pos.y === end.y) {
            distances.push(distance);
            continue;
        }

        visited.set(getKey(pos),  true);

        for (let i = 0; i < moves.length; i++) {
            let newPos = { x: moves[i][1] + pos.x, y: moves[i][0] + pos.y };
            if (newPos.y >= 0 && newPos.y < data.length && newPos.x >= 0 && newPos.x < data[0].length &&
                visited.get(getKey(newPos)) === undefined) {
                    let s = data[newPos.y][newPos.x];
                    if ((s === "#") ||
                        (s === "v" && moves[i][0] !== 1) || (s === "^" && moves[i][0] !== -1) ||
                        (s === ">" && moves[i][1] !== 1) || (s === "<" && moves[i][1] !== -1)) {
                            continue;
                    }
                    queue.push({pos: newPos, visited: new Map(visited), distance: distance + 1});;
            }
        }
    }

    console.log("distances(" + distances.length + ")=" + distances.sort());
    let max = distances[0];
    distances.forEach((p) => max = Math.max(max, p));
    
    return max;
}

type Edge = {
    node: Node,
    distance: number
}

type Node = {
    name: number,
    edges: Edge[]
    x: number,
    y: number
}

function part2(data: string[] = testData): number {
    const start: Pos = { x: data[0].indexOf("."), y: 0 };
    const end: Pos = { x: data[data.length - 1].indexOf("."), y: data.length - 1 };

    const nodes = compressToJunctions(data);

    function compressToJunctions(data: string[]) {
        const searches = [ [-1, 0], [1, 0], [0, -1], [0, 1] ];
        const startNode = { name: 0, x: start.x, y: start.y, edges: [] as Edge[] };
        const nodes: Node[] = [ startNode ];

        type QueueItem = {
            pos: Pos,
            last: Pos,
            distance: number
        }

        traverse(startNode, start, 0, { x: 0, y: 0 });

        function traverse(currentNode: Node, pos: Pos, distance: number, last: Pos) {
            const queue: QueueItem[] = [ { pos, distance, last } ];

            while (queue.length > 0) {
                const {
                    pos,
                    last,
                    distance
                } = queue.shift() as QueueItem;

                let options = 0;
                const moves: Pos[] = [];

                for (let i = 0; i < searches.length; i++) {
                    const newPos = { x: searches[i][1] + pos.x, y: searches[i][0] + pos.y };
                    if (newPos.y >= 0 && newPos.y < data.length && newPos.x >= 0 && newPos.x < data[0].length &&
                            (newPos.y !== last.y || newPos.x !== last.x) &&
                            data[newPos.y][newPos.x] !== "#") {
                        options++;
                        moves.push(newPos);
                    }
                }

                if (options === 1) { // continue on path
                    queue.push({ pos: moves[0], last: pos, distance: distance + 1 });
                } else { // at a junction
                    let newNode = nodes.find((n) => n.x === pos.x && n.y === pos.y);
                    if (newNode === undefined) {  // found new junction
                        newNode = { name: nodes.length, x: pos.x, y: pos.y, edges: [] }
                        nodes.push(newNode);
                        currentNode.edges.push({ node: newNode, distance });
                        newNode.edges.push({ node: currentNode, distance });

                        moves.forEach((move) => {
                            traverse(newNode as Node, move, 1, pos);
                        });
                    } else {  // found existing junction
                        currentNode.edges.push({ node: newNode, distance });
                    }
                }
            }
        }

        function printNodes() {
            console.log("nodes.length=" + nodes.length);
            nodes.forEach((node) => {
                console.log("Node #" + node.name + " at (" + node.y + "," + node.x + ") has " + node.edges.length + " edges:");
                node.edges.forEach((edge) => {
                    console.log(" Edge to Node #" + nodes.indexOf(edge.node) + " with distance of " + edge.distance); 
                });
            });
        }

        printNodes();
        return nodes;
    }

    type NodesQueueItem = {
        current: Node,
        visited: boolean[],
        distance: number
    }

    let max = 0;
    let nodesQueue = Queue<NodesQueueItem>();
    nodesQueue.enqueue({ current: nodes[0], visited: [], distance: 0 });
    while (nodesQueue.peek() != undefined) {
        let {
            current,
            visited,
            distance
        } = nodesQueue.dequeue() as NodesQueueItem;

        if (current.x === end.x && current.y === end.y) {
            max = Math.max(max, distance);
            continue;
        }

        visited[current.name] = true;

        current.edges.forEach(edge => {
            if (visited[edge.node.name] === undefined) {
                nodesQueue.enqueue({ current: edge.node, visited: [...visited],  distance: distance + edge.distance });
            }
        });
    }
    
    return max;
}

function run(data: string[]): number {
    // return part1();
    // return part1(data); 
    // return part2();
    return part2(data);
}

export default run;