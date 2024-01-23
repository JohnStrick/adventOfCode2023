const testData: string[] = [
    "19, 13, 30 @ -2,  1, -2",
    "18, 19, 22 @ -1, -1, -2",
    "20, 25, 34 @ -2, -2, -4",
    "12, 31, 28 @ -1, -2, -1",
    "20, 19, 15 @  1, -5, -3"
];

type Pos = {
    x: number,
    y: number,
    z: number
}

type Line = {
    pos: Pos,
    v: Pos,
    slope: { xy: number, xz:  number, yz: number }
    intercepts: Pos
}

type Range = {
    low: number,
    high: number
}

const calculateSlope = (v: number[]) => {
    return { xy: v[1] / v[0], xz: v[2] / v[0], yz: v[2] / v[1] };
}

const calculateIntercepts = (slope:{ xy: number, xz: number, yz: number }, p: number[]) => {
    return { x: (slope.xy * p[0] - p[1]) / slope.xy, y: p[1] - slope.xy * p[0], z: p[2] - slope.xz * p[0] }
}

function parse(data: string[]): Line[] {
    const lines = [];

    for (let i = 0; i < data.length; i++) {
        const t = data[i].split(" @ ");
        const p = t[0].split(",").map(Number);
        const v = t[1].split(",").map(Number);

        const slope = calculateSlope(v);

        const line = {
            pos: { x: p[0], y: p[1], z: p[2] },
            v: {x: v[0], y: v[1], z: v[2] },
            slope,
            intercepts: calculateIntercepts(slope, p)
        };

        lines.push(line);
    }

    // console.log("lines=" + JSON.stringify(lines));

    return lines;
}

function part1(data: string[] = testData, range: Range): number {
    const lines = parse(data);

    let total = 0;

    for (let i = 0; i < lines.length; i++) {
        let a = lines[i];
        for (let j = i + 1; j < lines.length; j++) {
            let b = lines[j];

            let x = (a.intercepts.y - b.intercepts.y) / (b.slope.xy - a.slope.xy);
            let y = a.slope.xy * x + a.intercepts.y;
            let aTime = (x - a.pos.x) / a.v.x;
            let bTime = (x - b.pos.x) / b.v.x;
            let crossInside =  x >= range.low && x <= range.high && y >= range.low && y <= range.high &&
                aTime >=0 && bTime >= 0;

            total += crossInside ? 1 : 0;

            // console.log("Paths will cross " + (crossInside ? "in" : "out") + "side the test area (at x=" + x + ", y=" + y + ") aTime=" + aTime + ", bTime=" + bTime);
        }
    }

    return total;
}

function part2(data: string[] = testData): number {
    const lines = parse(data);

    let total = 0;

    return total;
}

function run(data: string[]): number {
    // return part1(testData, { low: 7, high: 27 });
    return part1(data, { low: 200000000000000, high: 400000000000000 }); 
    // return part2();
    // return part2(data);
}

export default run;