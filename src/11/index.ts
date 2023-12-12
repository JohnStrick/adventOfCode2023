import exp from "constants";

const testData: string[] = [
    "...#......",
    ".......#..",
    "#.........",
    "..........",
    "......#...",
    ".#........",
    ".........#",
    "..........",
    ".......#..",
    "#...#....."
];

type Galaxy = {
    x: number,
    y: number
}

function parse(data: string[]): Galaxy[] {
    let galaxy = [] as Galaxy[];

    for (let i = 0; i < data.length; i++) {
        let row = data[i];
        for (let j = 0; j < row.length; j++) {
            if ( row[j] == "#") {
                galaxy.push({
                    x: j,
                    y: i
                });
            }
        }
    }

    return galaxy;
}

function galaxyMath(data: string[], expansionNumber: number): number {
    let galaxies = parse(data);
    let rows = [] as number[];
    let cols = [] as number[];
    let sum = 0;
    
    // find rowShift
    for ( let i = 0; i < data.length; i++) {
        let row = data[i];
        if (!row.includes("#")) {
            rows.push(expansionNumber);
        } else {
            rows.push(0);
        }
    }
    
    // find colShift
    for (let j = 0; j < data[0].length; j++) {
        let isEmpty = true;
        for (let i = 0; i < data.length; i++) {
            if (data[i][j] == "#") {
                isEmpty = false;
                break;
            }
        }

        if (isEmpty) {
            cols.push(expansionNumber);
        } else {
            cols.push(0);
        }
    }

    function calculateDistance(a: Galaxy, b: Galaxy): number {
        let minY = Math.min(a.y, b.y);
        let maxY = Math.max(a.y, b.y);
        let minX = Math.min(a.x, b.x);
        let maxX = Math.max(a.x, b.x);

        let sum = (maxY - minY) + (maxX - minX);
        // console.log("Distance between gal at y=" + a.y + ", x=" + a.x + " and gal at y=" + b.y + ", x=" + b.x + " is=" + sum);

        for (let i = minX + 1; i < maxX; i++) {
            sum += cols[i];
        }
        // console.log("  sum after X shift=" + sum);

        for (let i = minY + 1; i < maxY; i++) {
            sum += rows[i];
        }

        // console.log("  sum after Y shift=" + sum);

        // console.log("Distance between gal at y=" + a.y + ", x=" + a.x + " and gal at y=" + b.y + ", x=" + b.x + " is=" + sum);
        // console.log("  minX=" + minX + ", maxX=" + maxX + ", minY=" + minY + ", maxY=" + maxY);
        return sum;
    }

    console.log("rowShift=" + rows.join(","));
    console.log("colShift=" + cols.join(","));
    
    // calculate distance between each galaxy
    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            sum += calculateDistance(galaxies[i], galaxies[j]);
        }
    }
    
    return sum;
}

function part1(data: string[] = testData): number {
    return galaxyMath(data, 1);
}

function part2(data: string[] = testData): number {
    return galaxyMath(data, 999999);
}

function run(data: string[]): number {
    // return part1(testData);
    // return part1(data); 
    // return part2(testData);
    return part2(data);
}

export default run;