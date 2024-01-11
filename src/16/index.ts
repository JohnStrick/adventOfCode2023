const testData: string[] = [
    ".|...\\....",
    "|.-.\\.....",
    ".....|-...",
    "........|.",
    "..........",
    ".........\\",
    "..../.\\\\..",
    ".-.-/..|..",
    ".|....-|.\\",
    "..//.|...."
];

enum LightDirection {
    Left = 0,
    Right,
    Up,
    Down
}

type Tile = {
    val: string,
    energized: boolean,
    lightDir: LightDirection[]
}

function parse(data: string[]): Array<Tile[]> {
    let contraption = [];

    for (let i = 0; i < data.length; i++) {
        let row = [];
        for (let j = 0; j < data[i].length; j++) {
            let tile = {
                val: data[i][j],
                energized: false,
                lightDir: []
            }
            row.push(tile);
        }
        contraption.push(row);
    }

    return contraption;
}

function getEnergizedTiles(data: string[], x: number, y: number, dir: LightDirection) {
    let contraption = parse(data);

    function crawl(x: number, y: number, dir: LightDirection) {
        // Handle case where light reaches the edge
        if (y < 0 || y >= contraption.length || x < 0 || x >= contraption[0].length) {
            return;
        }
        // console.log("Crawling at y=" + y + ", x=" + x + ", direction=" + dir);
        // printEnergizedTiles();

        let currentTile = contraption[y][x];
        if (currentTile.energized && currentTile.lightDir.includes(dir)) {  // Light already moved in this direction
            return;
        } else if (currentTile.energized) {  // New light direction for this tile  
            currentTile.lightDir.push(dir);
        } else { // First time moving through this tile
            currentTile.energized = true;
            currentTile.lightDir.push(dir);    
        }

        let goRight = () => crawl(x + 1, y, LightDirection.Right);
        let goLeft = () => crawl(x - 1, y, LightDirection.Left);
        let goUp = () => crawl(x, y - 1, LightDirection.Up);
        let goDown = () => crawl(x, y + 1, LightDirection.Down);

        switch (dir) {
            case LightDirection.Up:
                if (currentTile.val === "/") {
                    goRight();
                } else if (currentTile.val === "\\") {
                    goLeft();
                } else if (currentTile.val === "-") {
                    goLeft();
                    goRight();
                } else if (currentTile.val === "|" || currentTile.val === ".") {
                    goUp();
                }
                break;
            case LightDirection.Down:
                if (currentTile.val === "/") {
                    goLeft();
                } else if (currentTile.val === "\\") {
                    goRight();
                } else if (currentTile.val === "-") {
                    goLeft();
                    goRight();
                } else if (currentTile.val === "|" || currentTile.val === ".") {
                    goDown();
                }
                break;
            case LightDirection.Left:
                if (currentTile.val === "/") {
                    goDown();
                } else if (currentTile.val === "\\") {
                    goUp();
                } else if (currentTile.val === "-" || currentTile.val === ".") {
                    goLeft();
                } else if (currentTile.val === "|") {
                    goUp();
                    goDown();
                }
                break;
            case LightDirection.Right:
                if (currentTile.val === "/") {
                    goUp();
                } else if (currentTile.val === "\\") {
                    goDown();
                } else if (currentTile.val === "-" || currentTile.val === ".") {
                    goRight();
                } else if (currentTile.val === "|") {
                    goUp();
                    goDown();
                }
                break;
        }
    }

    crawl(x, y, dir);
    // printEnergizedTiles();

    function printEnergizedTiles() {
        for (let i = 0; i < contraption.length; i++) {
            let row = "";
            for (let j = 0; j < contraption[i].length; j++) {
                row += contraption[i][j].energized ? "#" : ".";
            }
            console.log(row);
        }
    }
 
    let energizedTiles = 0;
    for (let i = 0; i < contraption.length; i++) {
        for (let j = 0; j < contraption[i].length; j++) {
            if (contraption[i][j].energized) {
                energizedTiles++;
            }
        }
    }

    return energizedTiles;
}

function part1(data: string[] = testData): number {
    return getEnergizedTiles(data, 0, 0, LightDirection.Right);
}

function part2(data: string[] = testData): number {
    let max = 0;

    for (let i = 0; i < data[0].length; i++) {
        max = Math.max(max, getEnergizedTiles(data, i, 0, LightDirection.Down),
            getEnergizedTiles(data, i, data.length - 1, LightDirection.Up))
    }

    for (let i = 0; i < data.length; i++) {
        max = Math.max(max, getEnergizedTiles(data, 0, i, LightDirection.Right),
            getEnergizedTiles(data, data[0].length - 1, i, LightDirection.Left));
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