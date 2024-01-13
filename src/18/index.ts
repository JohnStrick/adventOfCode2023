const testData: string[] = [
    "R 6 (#70c710)",
    "D 5 (#0dc571)",
    "L 2 (#5713f0)",
    "D 2 (#d2c081)",
    "R 2 (#59c680)",
    "D 2 (#411b91)",
    "L 5 (#8ceee2)",
    "U 2 (#caa173)",
    "L 1 (#1b58a2)",
    "U 2 (#caa171)",
    "R 2 (#7807d2)",
    "U 3 (#a77fa3)",
    "L 2 (#015232)",
    "U 2 (#7a21e3)"
];

enum Direction {
    Right = 0,
    Down,
    Left,
    Up
}

type Pos = {
    x: number,
    y: number
}

type Instruction = {
    dir: Direction,
    len: number,
}

function parsePart1(data: string[]): Instruction[] {
    let dirMap = { "R": Direction.Right, "D": Direction.Down, "L": Direction.Left, "U": Direction.Up };

    let plan = data.map((value) => {
        let t = value.split(" ");
        return {
            dir: dirMap[t[0] as "R" | "D" | "L" | "U"],
            len: Number(t[1])
        }
    });

    return plan;
}

function parsePart2(data: string[]): Instruction[] {
    let dirMap = { 0: Direction.Right, 1: Direction.Down, 2: Direction.Left, 3: Direction.Up };
    let plan = data.map((value) => {
        let t = value.split(" ");
        let hex = Number.parseInt(t[2].substring(2, t[2].length - 2), 16);
        let dir = Number(t[2][t[2].length - 2]);
        return {
            dir: dirMap[dir as 0 | 1 | 2 | 3],
            len: hex
        }
    });

    return plan;
}

function part1(data: string[] = testData): number {
    const plan: Instruction[] = parsePart1(data);

    const {minX, maxX, minY, maxY, xLength, yLength} = getBounds();
    function getBounds() {
        let minX = 0, maxX = 0, minY = 0, maxY = 0;
        let current = {
            x: 0,
            y: 0
        }

        for (let i = 0; i < plan.length; i++) {
            let inst = plan[i];
            switch (inst.dir) {
                case Direction.Left:
                    current.x -= inst.len;
                    break;
                case Direction.Right:
                    current.x += inst.len;
                    break;
                case Direction.Up:
                    current.y -= inst.len;
                    break;
                case Direction.Down:
                    current.y += inst.len;
                    break;
                default:
                    throw "Unknown direction:" + inst.dir;
            }

            minX = Math.min(minX, current.x);
            maxX = Math.max(maxX, current.x);
            minY = Math.min(minY, current.y);
            maxY = Math.max(maxY, current.y);
        }

        console.log("minX=" + minX + ", maxX=" + maxX + ", minY=" + minY + ", maxY=" + maxY);
        return {minX, maxX, minY, maxY, xLength: maxX - minX + 1, yLength: maxY - minY + 1};
    }

    type Node = {
        val: string,
        inside: boolean
    }

    let lagoon: Array<Node[]> = [];
    for (let i = 0; i < yLength; i++) {
        let ret = [];
        for ( let j = 0; j < xLength; j++) {
            ret.push({ val: ".", inside: false});
        }
        lagoon.push(ret);
    }
    
    let start = { x: -minX, y: -minY }
    lagoon[start.y][start.x] = { val: "#", inside: false};

    plan.forEach((inst) => {
        for (let i = 0; i < inst.len; i++) {
            switch (inst.dir) {
                case Direction.Left:
                    start.x--;
                    break;
                case Direction.Right:
                    start.x++;
                    break;
                case Direction.Up:
                    start.y--;
                    break;
                case Direction.Down:
                    start.y++;
                    break;
            }
            lagoon[start.y][start.x] = { val: "#", inside: true};
        }
    })

    // printLagoon();
    function printLagoon() {
        lagoon.forEach((row) => {
            let ret = "";
            for (let i = 0; i < row.length; i++) {
                ret += row[i].val;
            }
            console.log(ret);
        });
    }
    console.log("");
    fillInside();

    function fillInside() {
        for (let i = 0; i < lagoon.length; i++) {
            let isInside = false;
            for (let j = 0; j < lagoon[i].length; j++) {
                if (i > 0 && lagoon[i][j].val === "#" && lagoon[i - 1][j].val === "#") {
                    isInside = !isInside;
                }
                lagoon[i][j].inside = lagoon[i][j].val === "#" || isInside;
            }
        }
    }

    let inside = 0;
    calcInside();
    function calcInside() {
        lagoon.forEach((row, j) => {
            let ret = ""
            for (let i = 0; i < row.length; i++) {
                ret += (row[i].inside === true ? "X" : ".");
                inside += (row[i].inside === true ? 1 : 0);
            }
            // console.log(ret);
        });
    }

    return inside;
}

// Brute force in part1 won't work here. Got an out of memory error on the heap. The numbers are too big.
// Needed some help on finding a pure mathematical answer using just the vertice's of the lagoon.
function part2(data: string[] = testData): number {
    const plan: Instruction[] = parsePart2(data);

    const dirMap = {[Direction.Right]: [0, 1], [Direction.Down]: [1, 0],
        [Direction.Left]: [0, -1], [Direction.Up]: [-1, 0]};

    const vertices = [];
    let current = [0, 0];  // [ y, x ]
    vertices.push(current);

    for (let i = 0; i < plan.length - 1; i++) {
        const inst = plan[i];
        let v = dirMap[inst.dir].map((val, i) => current[i] + val * inst.len);
        vertices.push(v);
        current = v;
    }

    let perimeter = 0;
    let insideArea = 0;
    
    // Shoelace Formula for insideArea: https://en.wikipedia.org/wiki/Shoelace_formula
    for (let i = 0; i < vertices.length; i++) {
        insideArea += vertices.at(i - 1)![1] * vertices[i][0] - vertices[i][1] * vertices.at(i - 1)![0];
        perimeter += plan[i].len;
    }

    insideArea /= 2;
    console.log("insideArea=" + insideArea + ", perimeter=" + perimeter);

    // Modified Pick's Theorum: https://en.wikipedia.org/wiki/Pick's_theorem
    // Because the "holes" are dug around the vertices, we need to add up the 1/2 meter outer layer.
    // Each side of the perimeter has exactly a 1/2 meter outer shell, so we can just use that.
    // However, this doesn't include the corners. Since each corner is 1/4 meter, we add 1 more
    //  square meter to get the final answer.
    return insideArea + perimeter / 2 + 1;
}

function run(data: string[]): number {
    // return part1();
    // return part1(data); 
    // return part2();
    return part2(data);
}

export default run;