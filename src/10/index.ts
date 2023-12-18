import { notDeepEqual } from "assert";

const testData: string[] = [
    "7-F7-",
    ".FJ|7",
    "SJ.L7",
    "|F--J",
    "LJ.LJ"
];

const testData2: string[] = [
    "...........",
    ".S-------7.",
    ".|F-----7|.",
    ".||.....||.",
    ".||.....||.",
    ".|L-7.F-J|.",
    ".|..|.|..|.",
    ".L--J.L--J.",
    "..........."
]

const testData3: string[] = [
    "..........",
    ".S------7.",
    ".|F----7|.",
    ".||....||.",
    ".||....||.",
    ".|L-7F-J|.",
    ".|..||..|.",
    ".L--JL--J.",
    "..........",
]

const testData4: string[] = [
    "FF7FSF7F7F7F7F7F---7",
    "L|LJ||||||||||||F--J",
    "FL-7LJLJ||||||LJL-77",
    "F--JF--7||LJLJ7F7FJ-",
    "L---JF-JLJ.||-FJLJJ7",
    "|F|F-JF---7F7-L7L|7|",
    "|FFJF7L7F-JF7|JL---7",
    "7-L-JL7||F7|L7F-7F7|",
    "L.L7LFJ|||||FJL7||LJ",
    "L7JLJL-JLJLJL--JLJ.L"
]

type Node = {
    val: string,
    x: number,
    y: number,
    visited: boolean,
    distance: number,
    isOutside: boolean
}

function parse(data: string[]): { maze: Array<Node[]>, start: Node } {
    let maze = [];
    let start = {} as Node;

    for (let i = 0; i < data.length; i++) {
        let row = data[i];
        let newRow = [];
        for (let j = 0; j < row.length; j++) {
            let node = { val: row[j], x: j, y: i, visited: false, distance: -1, isOutside: false }

            if (node.val == "S") {
                node.visited = true;
                node.distance = 0;
                start = node;
            }

            newRow.push(node);
        }
        maze.push(newRow);
    }

    return {
        maze,
        start
    }
}

function part1(maze: Array<Node[]>, start: Node): number {
    let path1: Node | undefined = start;
    let path2: Node | undefined = start;
    let path1Dist = 0
    let path2Dist = 0;
    let maxDistance = -1;

    function printMaze() {
        let ret = [];
        for (let i = 0; i < maze.length; i++) {
            let s = "";
            for (let j = 0; j < maze[i].length; j++) {
                let node = maze[i][j];
                if (node.distance != -1) {
                    s += node.distance;
                } else {
                    s += node.val;
                }
            }
            ret.push(s);
        }
        return ret;
    }

    function getNextNode(n: Node) {
        function getLeft(n: Node) { return maze[n.y][n.x - 1] };
        function getRight(n: Node) { return maze[n.y][n.x + 1] };
        function getAbove(n: Node) { return maze[n.y - 1][n.x]};
        function getBelow(n: Node) { return maze[n.y + 1][n.x]};

        switch (n.val) {
            case "F":
                if (!getRight(n).visited) {
                    return getRight(n);
                } else if (!getBelow(n).visited) {
                    return getBelow(n);
                }
                break;
            case "J":
                if (!getLeft(n).visited) {
                    return getLeft(n);
                } else if (!getAbove(n).visited) {
                    return getAbove(n);
                }
                break;
            case "|":
                if (!getAbove(n).visited) {
                    return getAbove(n);
                } else if (!getBelow(n).visited) {
                    return getBelow(n);
                }
                break;
            case "-":
                if (!getLeft(n).visited) {
                    return getLeft(n);
                } else if (!getRight(n).visited) {
                    return getRight(n);
                }
                break;
            case "7":
                if (!getLeft(n).visited) {
                    return getLeft(n);
                } else if (!getBelow(n).visited) {
                    return getBelow(n);
                }
                break;
            case "L":
                if (!getAbove(n).visited) {
                    return getAbove(n);
                } else if (!getRight(n).visited) {
                    return getRight(n);
                }
                break;
            case "S":
                let a = false, l = false, b = false, r = false;
                if (n.y > 0) {
                    let above = getAbove(n);
                    if ((above.val === "F" || above.val === "|" || above.val === "7") && !above.visited) {
                        return above;
                    }
                }
                if (n.x > 0) {
                    let left = getLeft(n);
                    if ((left.val === "F" || left.val === "-" || left.val === "L") && !left.visited) {
                        return left;
                    }
                }
                if (n.y < maze.length - 2) {
                    let below = getBelow(n);
                    if ((below.val === "L" || below.val === "|" || below.val === "J") && !below.visited) {
                        return below;
                    }
                }
                if (n.x < maze[n.y].length - 2) {
                    let right = getRight(n);
                    if ((right.val === "J" || right.val === "-" || right.val === "7") && !right.visited) {
                        return right;
                    } 
                }

                throw "Couldn't find match from 'S' node!";
            default:
                throw "Invalid maze value=" + n.val; 
        }
    }

    start.visited = true;

    while (path1 !== undefined && path2 !== undefined) {
        path1 = getNextNode(path1);
        if (path1) {
            path1.visited = true;
            path1.distance = ++path1Dist;
        }

        path2 = getNextNode(path2);
        if (path2) {
            path2.visited = true;
            path2.distance = ++path2Dist;
        }
        maxDistance = Math.max(path1Dist, path2Dist);

        // console.log("** Maze after step #" + maxDistance + " **");
        // console.log(printMaze().join("\r\n"));
    }

    return maxDistance;
}

function part2(maze: Array<Node[]>, start: Node): number {
    part1(maze, start);

    function replaceStart() {
        function getLeft(n: Node) { return maze[n.y][n.x - 1] };
        function getRight(n: Node) { return maze[n.y][n.x + 1] };
        function getAbove(n: Node) { return maze[n.y - 1][n.x]};
        function getBelow(n: Node) { return maze[n.y + 1][n.x]};

        if (getAbove(start).visited && getRight(start).visited) {
            start.val = "L";
        } else if (getAbove(start).visited && getLeft(start).visited) {
            start.val = "J";
        } else if (getAbove(start).visited && getBelow(start).visited) {
            start.val = "|";
        } else if (getBelow(start).visited && getRight(start).visited) {
            start.val = "F";
        } else if (getBelow(start).visited && getLeft(start).visited) {
            start.val = "7";
        } else {
            start.val = "-";
        }
    }

    replaceStart();

    for (let i = 0; i < maze.length; i++) {
        let row = maze[i];
        let outside = true;
        let horizontalSegments = ["F", "7", "-"];

        for (let j = 0; j < row.length; j++) {
            // imagine just above this node is a gap, only count crossing the boundary if the pipe extends vertically above the current node 
            if (row[j].visited && !horizontalSegments.includes(row[j].val)) {
                outside = !outside;
            } else {
                row[j].isOutside = outside;
            }
        }
    }

    let sum = 0;
    for (let i = 0; i < maze.length; i++) {
        let row = maze[i];
        let outside = true;

        for (let j = 0; j < row.length; j++) {
            if (!row[j].isOutside && !row[j].visited) {
                sum++;
            }
        }
    }
    
    return sum;
}

function run(data: string[]): number {
    let {
        maze,
        start
    } = parse(data);

    // return part1(maze, start);
    return part2(maze, start);
}

export default run;