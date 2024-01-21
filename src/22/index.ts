const testData: string[] = [
    "1,0,1~1,2,1",
    "0,0,2~2,0,2",
    "0,2,3~2,2,3",
    "0,0,4~0,2,4",
    "2,0,5~2,2,5",
    "0,1,6~2,1,6",
    "1,1,8~1,1,9"
];

type Orientation = "X" | "Y" | "Z";

type Brick = {
    name: number,
    orientation: Orientation,
    isStable: boolean,
    supportedBy: Brick[],
    supports: Brick[],
    start: number[],
    end: number[]
}

type Node = {
    occupied: boolean,
    brick?: Brick
}

function parse(data: string[]) {
    const bricks: Brick[] = Array(data.length);
    const grid: Node[][][] = [];
    let X = { max: 0}, Y = { max: 0 }, Z = { max: 0};

    for (let i = 0; i < data.length; i++) {
        let c = data[i].split("~");
        let start = c[0].split(",").map(v => Number(v));
        let end = c[1].split(",").map(v => Number(v));
        let orientation: Orientation = (end[1] === start[1] && end[2] == start[2]) ? "X" :
            (end[0] === start[0] && end[2] == start[2]) ? "Y" : "Z";
        let isStable = start[2] === 1 || end[2] === 1;

        bricks[i] = { name: i, orientation, isStable, supportedBy: [], start, end, supports: [] };
        
        X.max = Math.max(X.max, start[0], end[0]);
        Y.max = Math.max(Y.max, start[1], end[1]);
        Z.max = Math.max(Z.max, start[2], end[2]);
    }

    for (let x = 0; x <= X.max; x++) {
        let yRow = [];
        for (let y = 0; y <= Y.max; y++) {
            let zRow = [];
            for (let z = 0; z <= Z.max; z++) {
                zRow.push({ occupied: false });
            }
            yRow.push(zRow);
        }
        grid.push(yRow);
    }

    bricks.forEach((brick) => {
        for (let x = brick.start[0]; x < brick.end[0] + 1; x++) {
            for (let y = brick.start[1]; y < brick.end[1] + 1; y++) {
                for (let z = brick.start[2]; z < brick.end[2] + 1; z++) {
                    grid[x][y][z].occupied = true;
                    grid[x][y][z].brick = brick;
                }
            }
        }
    });

    return {
        bricks,
        grid
    };
}

function printGrid(grid: Node[][][]): void {
    const xRows= [], yRows =[];
    for (let z = grid[0][0].length - 1; z >= 0; z--) {
        let row = [];
        for (let x = 0; x < grid.length; x++) {
            const rowBricks: number[] = [];
            for (let y = 0; y < grid[0].length; y++) {
                if (grid[x][y][z].occupied ) {
                    const n = grid[x][y][z].brick?.name as number;
                    if (!rowBricks.includes(n)) {
                        rowBricks.push(n);
                    }
                }
            }

            rowBricks.length === 1 ? row.push(rowBricks[0]) : rowBricks.length > 1 ? "?" : ".";
        }
        xRows.push(row.join("\t") + "\t" + z);

        row = [];
        for (let y = 0; y < grid[0].length; y++) {
            const rowBricks: number[] = [];
            for (let x = 0; x < grid.length; x++) {
                if (grid[x][y][z].occupied ) {
                    const n = grid[x][y][z].brick?.name as number;
                    if (!rowBricks.includes(n)) {
                        rowBricks.push(n);
                    }
                }
            }

            rowBricks.length === 1 ? row.push(rowBricks[0]) : rowBricks.length > 1 ? "?" : ".";
        }
        yRows.push(row.join("\t") + "\t" + z);
    }

    console.log("Grid X/Z Perspective:");
    xRows.forEach(r => console.log(r))

    console.log("Grid Y/Z Perspective:");
    yRows.forEach(r => console.log(r))
}

function performTetris(data: string[]): Brick[] {
    const { 
        grid,
        bricks
    } = parse(data);

    // printGrid(grid);

    for (let z = 0; z < grid[0][0].length; z++) {
        for (let y = 0; y < grid[0].length; y++) {
            for (let x = 0; x < grid.length; x++) {
                if (grid[x][y][z].occupied) {
                    let brick = grid[x][y][z].brick as Brick;
                    if (brick.isStable) {
                        continue;
                    }

                    const checkAndMarkStability = (node: Node) => {
                        if (node.occupied) {
                            brick.isStable = true;
                            const supportingBrick = node.brick as Brick;
                            if (!brick.supportedBy.includes(supportingBrick)) {
                                brick.supportedBy.push(supportingBrick);
                            }
                            if (!supportingBrick.supports.includes(brick)) {
                                supportingBrick.supports.push(brick);
                            }
                        }
                    }

                    const swapPositionsInGrid = (row: Node[], z: number, d: number) => {
                        row[z].occupied = false;
                        delete row[z].brick;

                        row[d].occupied = true;
                        row[d].brick = brick;
                    }

                    let d = z;
                    switch (brick.orientation) {  // find a brick below this one
                        case "X":
                            for (; d > 1; d--) { // if d=1, we are on the ground level
                                for (let o = brick.start[0]; o <= brick.end[0]; o++) {
                                    checkAndMarkStability(grid[o][y][d - 1]);
                                }
                                if (brick.isStable) {
                                    break;
                                }
                            }

                            if (z !== d) {  // we need to move the brick down
                                for (let o = brick.start[0]; o <= brick.end[0]; o++) {
                                    swapPositionsInGrid(grid[o][y], z, d);
                                }
                            }

                            break;
                        case "Y":
                            for (; d > 1; d--) {
                                for (let o = brick.start[1]; o <= brick.end[1]; o++) {
                                    checkAndMarkStability(grid[x][o][d - 1]);
                                }
                                if (brick.isStable) {
                                    break;
                                }
                            }

                            if (z !== d) {  // we need to move the brick down
                                for (let o = brick.start[1]; o <= brick.end[1]; o++) {
                                    swapPositionsInGrid(grid[x][o], z, d);
                                }
                            }
                            break;
                        case "Z":
                            for (; d > 1; d--) { 
                                checkAndMarkStability(grid[x][y][d - 1]);
                                if (brick.isStable) {
                                    break;
                                }
                            }

                            if (z !== d) {  // we need to move the brick down
                                for (let o = brick.start[2]; o <= brick.end[2]; o++) {
                                    swapPositionsInGrid(grid[x][y], o, d + (o - brick.start[2]));
                                }
                            }
                            break;
                    }
                }
            }  // for x loop
        }  // for y loop
    }  // for z loop

    // printGrid(grid);
    return bricks;
}


function printSupportingBricks(bricks: Brick[]) {
    bricks.forEach((brick, i) => {
        console.log("Brick " + i + " is supportd by " + brick.supportedBy.map((b) => b.name).join(","));
    });
}

function printSupportsBricks(bricks: Brick[]) {
    bricks.forEach((brick, i) => {
        console.log("Brick " + i + " supports " + brick.supports.map((b) => b.name).join(","));
    });
}

function part1(data: string[] = testData): number {
    const bricks = performTetris(data);
    // printSupportingBricks(bricks);

    let disintegrate = bricks.map((b) => b.name.toString());

    bricks.forEach((brick) => {
        if (brick.supportedBy.length === 1) {
            let supportBrick = brick.supportedBy[0].name.toString();
            if (disintegrate.indexOf(supportBrick) !== -1) {
                disintegrate.splice(disintegrate.indexOf(brick.supportedBy[0].name.toString()), 1);
            }
        }
    });

    return disintegrate.length;
}

function part2(data: string[] = testData): number {
    const bricks = performTetris(data);

    // printSupportingBricks(bricks);
    // printSupportsBricks(bricks);

    let totalFallingBricks: number[][] = [];

    bricks.forEach((start, i) => {
        let queue: number[] = [];
        queue.push(start.name);
        totalFallingBricks.push([start.name]);

        while (queue.length > 0) {
            let brick = queue.shift() as number;

            let unsupported = true;
            for (let j = 0; j < bricks[brick].supportedBy.length; j++) {
                if (!totalFallingBricks[i].includes(bricks[brick].supportedBy[j].name)) {
                    unsupported = false;
                    break;
                }
            }

            if (unsupported && !totalFallingBricks[i].includes(brick)) {
                totalFallingBricks[i].push(brick);
            }

            bricks[brick].supports.forEach((s) => {
                if (!totalFallingBricks[i].includes(s.name) && !queue.includes(s.name)) {
                    queue.push(s.name);
                }
            })
        }
    });

    let total = 0;
    for (let i = 0; i < totalFallingBricks.length; i++) {
        total += (totalFallingBricks[i].length - 1);
    }

    return total;
}

function run(data: string[]): number {
    // return part1();
    // return part1(data); 
    // return part2();
    return part2(data);
}

export default run;