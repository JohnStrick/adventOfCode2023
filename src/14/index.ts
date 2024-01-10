import { readFile } from "fs/promises";

const testData: string[] = [
    "O....#....",
    "O.OO#....#",
    ".....##...",
    "OO.#O....O",
    ".O.....O#.",
    "O.#..O.#.#",
    "..O..#O..O",
    ".......O..",
    "#....###..",
    "#OO..#...."
];

type Node = {
    val: string;
}

function parse(data: string[]): Array<Node[]> {
    let puzzle = [] as Array<Node[]>;

    for(let i = 0; i < data.length; i++) {
        let row = [] as Node[];

        for (let j = 0; j < data[i].length; j++) {
            row.push({val: data[i][j]});
        }

        puzzle.push(row);
    }

    return puzzle;
}

function calculateNorthLoad(rocks: Array<number[]>): number {
    let load = 0;

    for (let i = 0; i < rocks.length; i++) {
        load += (rocks.length - i) * rocks[i].length;
    }

    return load;
}

// Returns array of round rock locations
function getRocks(platform: Array<Node[]>): Array<number[]> {
    let rocks = [];

    for (let i = 0; i < platform.length; i++) {
        let row = [];
        for (let j = 0; j < platform[i].length; j++) {
            if (platform[i][j].val === "O") {
                row.push(j);
            }
        }
        rocks.push(row);
    }

    return rocks;
}

function part1(data: string[] = testData): number {
    let platform = parse(data);

    for (let i = 0; i < platform[0].length; i++) {
        let rocks = 0;
        let lastCube = platform.length;

        for (let j = platform.length - 1; j >= 0; j--) {
            if (platform[j][i].val === "O") {
                rocks++;
                platform[j][i].val = ".";
            } else if (platform[j][i].val === "#") {
                for (let k = 1; k <= rocks; k++) {
                    platform[j + k][i].val = "O";
                }

                rocks = 0;
                lastCube = j;
            }
        }

        // Move rocks on top edge
        for (let k = 0; k < lastCube; k++) {
            platform[k][i].val = k < rocks ? "O" : ".";
        }
    }

    return calculateNorthLoad(getRocks(platform));
}

function part2(data: string[] = testData): number {
    let platform = parse(data);

    function printPlatform() {
        for (let i = 0; i < platform.length; i++) {
            let line = "";
            for (let j = 0; j < platform[i].length; j++) {
                line += platform[i][j].val
            }
            console.log(" " + line);
        }
    }

    // console.log("Original Platform");
    // printPlatform();

    function getKey(): string {
        return JSON.stringify(getRocks(platform));
    }

    type Lookup = {
        [key: string]: string
    }

    let lookup: Lookup = {};
    let lastKey = "";

    for (let cycles = 0; cycles < 1000000000; cycles++) {
        const key = lastKey !== "" ? lastKey : getKey();
        let value = lookup[key];
        if (value !== undefined) {
            lastKey = value;
            continue;
        }
        
        for (let iteration = 0; iteration < 4; iteration++) {
            switch (iteration % 4) {
                case 0: // North
                    for (let i = 0; i < platform[0].length; i++) {
                        let rocks = 0;
                        let lastCube = platform.length;
                
                        for (let j = platform.length - 1; j >= 0; j--) {
                            if (platform[j][i].val === "O") {
                                rocks++;
                            } else if (platform[j][i].val === "#") {
                                for (let k = 1; k <= rocks; k++) {
                                    platform[j + k][i].val = "O";
                                }
                                for (let k = j + rocks + 1; k < lastCube; k++) {
                                    platform[k][i].val = ".";
                                }

                                rocks = 0;
                                lastCube = j;
                            }
                        }

                        // Move rocks on top edge
                        for (let k = 0; k < rocks; k++) {
                            platform[k][i].val = "O";
                        }
                        for (let k = rocks; k < lastCube; k++) {
                            platform[k][i].val = ".";
                        }
                    }
                    break;
                case 1: // West
                    for (let i = 0; i < platform.length; i++) {
                        let rocks = 0;
                        let lastCube = platform[0].length;
                
                        for (let j = platform.length - 1; j >= 0; j--) {
                            if (platform[i][j].val === "O") {
                                rocks++;
                            } else if (platform[i][j].val === "#") {
                                for (let k = 1; k <= rocks; k++) {
                                    platform[i][j + k].val = "O";
                                }
                                for (let k = j + rocks + 1; k < lastCube; k++) {
                                    platform[i][k].val = ".";
                                }

                                rocks = 0;
                                lastCube = j;
                            }
                        }

                        // Move rocks on left edge
                        for (let k = 0; k < rocks; k++) {
                            platform[i][k].val = "O";
                        }
                        for (let k = rocks; k < lastCube; k++) {
                            platform[i][k].val = ".";
                        }
                    }
                    break;
                case 2:  // South
                    for (let i = 0; i < platform[0].length; i++) {
                        let rocks = 0;
                        let lastCube = -1;
                
                        for (let j = 0; j < platform.length; j++) {
                            if (platform[j][i].val === "O") {
                                rocks++;
                            } else if (platform[j][i].val === "#") {
                                for (let k = 1; k <= rocks; k++) {
                                    platform[j - k][i].val = "O";
                                }
                                for (let k = j - rocks - 1; k > lastCube; k--) {
                                    platform[k][i].val = ".";
                                }

                                rocks = 0;
                                lastCube = j;
                            }
                        }

                        // Move rocks on bottom edge
                        for (let k = platform.length - 1; k > lastCube; k--) {
                            if (platform.length - 1 - rocks < k) {
                                platform[k][i].val = "O";
                            } else {
                                platform[k][i].val = ".";
                            }
                        }
                    }
                    break;
                case 3:  // East
                    for (let i = 0; i < platform.length; i++) {
                        let rocks = 0;
                        let lastCube = -1;
                
                        for (let j = 0; j < platform[0].length; j++) {
                            if (platform[i][j].val === "O") {
                                rocks++;
                            } else if (platform[i][j].val === "#") {
                                for (let k = 1; k <= rocks; k++) {
                                    platform[i][j - k].val = "O";
                                }
                                for (let k = j - rocks - 1; k > lastCube; k--) {
                                    platform[i][k].val = ".";
                                }

                                rocks = 0;
                                lastCube = j;
                            }
                        }

                        // Move rocks on right edge
                        for (let k = platform[i].length - 1; k > lastCube; k--) {
                            if (platform.length - 1 - rocks < k) {
                                platform[i][k].val = "O";
                            } else {
                                platform[i][k].val = ".";
                            }
                        }
                    }
                    break;
            }
            // console.log("After iteration " + iteration );
            // printPlatform();
        }

        // console.log("After cycle " + (cycles + 1));
        // printPlatform();

        lookup[key] = getKey();
    }

    return calculateNorthLoad(JSON.parse(lastKey));
}

function run(data: string[]): number {
    // return part1();
    // return part1(data); 
    // return part2();
    return part2(data);
}

export default run;