import PriorityQueue from "../utils/PriorityQueue";

const testData: string[] = [
    "2413432311323",
    "3215453535623",
    "3255245654254",
    "3446585845452",
    "4546657867536",
    "1438598798454",
    "4457876987766",
    "3637877979653",
    "4654967986887",
    "4564679986453",
    "1224686865563",
    "2546548887735",
    "4322674655533"
];

const testData2: string[] = [
    "111111111111",
    "999999999991",
    "999999999991",
    "999999999991",
    "999999999991"
]

type Node = {
    x: number,
    y: number,
    dir: Direction,
    steps: number
}

enum Direction {
    Left = 0,
    Right,
    Up,
    Down
}

type DistanceHash = {
    [key: string]: {
        heat: number,
        path: Node[];
    }
}

type QueueItem = {
    node: Node,
    heat: number
    path: Node[]
}

function getKey(node: Node): string {
    return `${node.y},${node.x},${node.dir},${node.steps}`;
}

function initializeQueueAndHash(data: string[]) {
    const distances = {} as DistanceHash;
    const queue = new PriorityQueue<QueueItem>({ comparator: (a, b) => a.heat - b.heat})

    const startNodes = [ 
        {y: 0, x: 0, dir: Direction.Right, steps: 0},
        {y: 0, x: 0, dir: Direction.Down, steps: 0}
    ]
    startNodes.forEach((node) => {
        queue.push({ node, heat: -data[0][0], path: []});
        distances[getKey(node)] = { heat: 0, path: [] };
    });

    return {
        distances,
        queue
    }
}

function printPathToEnd(data: string[], path: Node[]): void {
    for(let i = 0; i < data.length; i++) {
        let row = "";
        for (let j = 0; j < data[i].length; j++) {
            if (path.find((val) => val.y == i && val.x === j)) {
                row += "."
            } else {
                row += data[i][j];
            }
        }
        console.log(row);
    }
}

function part1(data: string[] = testData): number {
    const {
        distances,
        queue
    } = initializeQueueAndHash(data);

    while (queue.length > 0) {
        const {
            node,
            heat,
            path
         } = queue.dequeue();

        // console.log("Evaluating node y=" + node.y + ", x=" + node.x + ", dir=" + node.dir + ", steps=" + node.steps + ", heat=" + heat + ", path.length=" + path.length + ", queue.length=" + queue.length + ", path=", JSON.stringify(path))

        const nextNodeHeat = heat + Number(data[node.y][node.x]);

        if (node.x == data[0].length - 1 && node.y === data.length - 1) {
            printPathToEnd(data, path);
            return nextNodeHeat;
        }

        function evaluateNode(n: Node) {
            const distance = distances[getKey(n)];
            if (distance === undefined || nextNodeHeat < distance.heat) {
                distances[getKey(n)] = { 
                    heat: nextNodeHeat,
                    path: [...path, node]
                };
                queue.push({ node: n, heat: nextNodeHeat, path: [...path, node]});
            }
        }

        // go right
        if (node.x < data[0].length - 1 && node.dir !== Direction.Left && (node.dir !== Direction.Right || node.steps + 1 <= 3)) {
            const rightNode = { y: node.y, x: node.x + 1, dir: Direction.Right, steps: node.dir === Direction.Right ? node.steps + 1 : 1 };
            evaluateNode(rightNode);
        }
        // go left
        if (node.x > 0 && node.dir !== Direction.Right && (node.dir !== Direction.Left || node.steps + 1 <= 3)) {
            const leftNode = { y: node.y, x: node.x - 1, dir: Direction.Left, steps: node.dir === Direction.Left ? node.steps + 1 : 1 };
            evaluateNode(leftNode);
        }
        // go up
        if (node.y > 0 && node.dir !== Direction.Down && (node.dir !== Direction.Up || node.steps + 1 <= 3)) {
            const upNode = { y: node.y - 1, x: node.x, dir: Direction.Up, steps: node.dir === Direction.Up ? node.steps + 1 : 1 };
            evaluateNode(upNode);
        }
        // go down
        if (node.y < data.length - 1 && node.dir !== Direction.Up && (node.dir !== Direction.Down || node.steps + 1 <= 3)) {
            const downNode = { y: node.y + 1, x: node.x, dir: Direction.Down, steps: node.dir === Direction.Down ? node.steps + 1 : 1 };
            evaluateNode(downNode);
        }
    }

    throw "Queue was empty before ever reaching end node!";
}

function part2(data: string[] = testData): number {
    const {
        distances,
        queue
    } = initializeQueueAndHash(data);

    while (queue.length > 0) {
        const {
            node,
            heat,
            path
         } = queue.dequeue();

        // console.log("Evaluating node y=" + node.y + ", x=" + node.x + ", dir=" + node.dir + ", steps=" + node.steps + ", heat=" + heat + ", path.length=" + path.length + ", queue.length=" + queue.length);// + ", path=", JSON.stringify(path))

        const nextNodeHeat = heat + Number(data[node.y][node.x]);

        if (node.x == data[0].length - 1 && node.y === data.length - 1) {
            if (node.steps < 4) {
                continue;
            }
            printPathToEnd(data, path);
            return nextNodeHeat;
        }

        function evaluateNode(n: Node) {
            const distance = distances[getKey(n)];
            if (distance === undefined || nextNodeHeat < distance.heat) {
                distances[getKey(n)] = { 
                    heat: nextNodeHeat,
                    path: [...path, node]
                };
                queue.push({ node: n, heat: nextNodeHeat, path: [...path, node]});
            }
        }

        // Determine if Ultra Crucible can turn. For example, if you want to turn Left:
        //   1. If the crucible is going right, can't reverse to the left
        //   2. If the crucible is going left, steps need to be less than max of 10
        //   3. If the crucible is going up or down, steps need to be at least 4
        function canUltraCrucibleMove(goDir: Direction) {
            let oppositeDir = [Direction.Right, Direction.Left, Direction.Down, Direction.Up];
            return node.dir !== oppositeDir[goDir] && ((node.dir === goDir && node.steps < 10) || (node.dir !== goDir && node.steps >= 4));
        }

        if (node.x < data[0].length - 1 && canUltraCrucibleMove(Direction.Right)) {
            const rightNode = { y: node.y, x: node.x + 1, dir: Direction.Right, steps: node.dir === Direction.Right ? node.steps + 1 : 1 };
            evaluateNode(rightNode);
        }
        if (node.x > 0 && canUltraCrucibleMove(Direction.Left)) {
            const leftNode = { y: node.y, x: node.x - 1, dir: Direction.Left, steps: node.dir === Direction.Left ? node.steps + 1 : 1 };
            evaluateNode(leftNode);
        }
        if (node.y > 0 && canUltraCrucibleMove(Direction.Up)) {
            const upNode = { y: node.y - 1, x: node.x, dir: Direction.Up, steps: node.dir === Direction.Up ? node.steps + 1 : 1 };
            evaluateNode(upNode);
        }
        if (node.y < data.length - 1 && canUltraCrucibleMove(Direction.Down)) {
            const downNode = { y: node.y + 1, x: node.x, dir: Direction.Down, steps: node.dir === Direction.Down ? node.steps + 1 : 1 };
            evaluateNode(downNode);
        }
    }

    throw "Queue was empty before ever reaching end node!";
}

function run(data: string[]): number {
    // return part1();
    // return part1(data); 
    // return part2(testData2);
    return part2(data);
}

export default run;