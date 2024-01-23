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
}

type Range = {
    low: number,
    high: number
}

function parse(data: string[]): Line[] {
    const lines = [];

    for (let i = 0; i < data.length; i++) {
        const t = data[i].split(" @ ");
        const p = t[0].split(",").map(Number);
        const v = t[1].split(",").map(Number);

        const line = {
            pos: { x: p[0], y: p[1], z: p[2] },
            v: {x: v[0], y: v[1], z: v[2] }
        };

        lines.push(line);
    }

    return lines;
}

function part1(data: string[] = testData, range: Range): number {
    const lines = parse(data);

    let total = 0;

    for (let i = 0; i < lines.length; i++) {
        const a = lines[i];
        for (let j = i + 1; j < lines.length; j++) {
            const b = lines[j];

            const timeB = (a.v.x * (b.pos.y - a.pos.y) - a.v.y * (b.pos.x - a.pos.x)) / (a.v.y * b.v.x - a.v.x * b.v.y);
            const timeA = (b.pos.x - a.pos.x + b.v.x * timeB) / a.v.x;
            const x = a.pos.x + timeA * a.v.x;
            const y = a.pos.y + timeA * a.v.y;

            const crossInside = x >= range.low && x <= range.high && y >= range.low && y <= range.high && timeA >0 && timeB > 0;

            total += crossInside ? 1 : 0;
            console.log("Paths will cross " + (crossInside ? "in" : "out") + "side the test area (at x=" + x + ", y=" + y + ") aTime=" + timeA + ", bTime=" + timeB);
        }
    }

    return total;
}

const zero = BigInt(0);
const convertToBigInt = (a: { pos: Pos, v: Pos}) => {
    return {
        pos: { x: BigInt(a.pos.x), y: BigInt(a.pos.y), z: BigInt(a.pos.z) },
        v: { x: BigInt(a.v.x), y: BigInt(a.v.y), z: BigInt(a.v.z) }
    };
};

const getXYIntersection = (a: { pos: Pos, v: Pos }, b: { pos: Pos, v: Pos }): { x: bigint, y: bigint} | null  => {
    const A = convertToBigInt(a);
    const B = convertToBigInt(b);

    const denominator = A.v.y * B.v.x - A.v.x * B.v.y;
    
    if (denominator === zero || A.v.x === zero) {
        return null;
    }

    // Formula derived by hand from solving for time in the equation:
    //  a.pos.x + a.v.x * timeA = b.pos.x + b.v.x * timeB
    let timeB = (A.v.x * (B.pos.y - A.pos.y) - A.v.y * (B.pos.x - A.pos.x)) / denominator;
    let timeA = (B.pos.x - A.pos.x + B.v.x * timeB) / A.v.x;

    return { 
        x: A.pos.x + timeA * A.v.x, 
        y: A.pos.y + timeA * A.v.y,
    };
}

const getXZIntersection = (a: { pos: Pos, v: Pos }, b: { pos: Pos, v: Pos }): { x: bigint, z: bigint } | null => {
    const A = convertToBigInt(a);
    const B = convertToBigInt(b);

    const denominator = (A.v.z * B.v.x - A.v.x * B.v.z);

    if (denominator === zero || A.v.x === zero) {
        return null;
    }

    const timeB = (A.v.x * (B.pos.z - A.pos.z) - A.v.z * (B.pos.x - A.pos.x)) / denominator;
    const timeA = (B.pos.x - A.pos.x + B.v.x * timeB) / A.v.x;

    return { 
        x: A.pos.x + timeA * A.v.x, 
        z: A.pos.z + timeA * A.v.z
    };
}

function part2(data: string[] = testData): number {
    const lines = parse(data);

    // Insight: The rock is moving at some velocity. If you subtract that velocity from each hail stone, you get
    //  a relative velocity with respect to the rock. By doing this, the rock is then stationary relative to all
    //  the other hail stones. Then you just need to go through each hail stone and find a common intersection
    //  point. If one exists for all hailstones, then you've found the initial position of the rock.
    const getHailRelativeVelocity = (a: Line, v: Pos): { pos: Pos, v: Pos } => {
        const vel = { x: a.v.x - v.x, y: a.v.y - v.y, z: a.v.z - v.z };
        return { pos: a.pos, v: vel };     
    }

    const rock = {} as Line;

    // Assumption: Rock velocity will be between -300 and 300. Iterate through all possible values to find the right one.
    function findXYMatch() {
        for (let x = -300; x < 300; x++) {
            for (let y = -300; y < 300; y++) {
                let a = getHailRelativeVelocity(lines[0], { x, y, z: 0});

                let foundMatch = true;
                let lastIntersection: { x: bigint, y: bigint } | null = null;

                for (let i = 1; i < lines.length; i++) {
                    let b = getHailRelativeVelocity(lines[i], {x, y, z: 0});
                    let intersection = getXYIntersection(a, b);
                    if (intersection && lastIntersection && (intersection.x !== lastIntersection.x || intersection.y !== lastIntersection.y)) {
                        foundMatch = false;
                        break;
                    }
                    lastIntersection = intersection;
                }

                if (foundMatch  && lastIntersection) {
                    console.log("Found common interesection for x=" + x + ", y=" + y + " velocity!");
                    console.log("Common intersection=(" + lastIntersection.x + ", " + lastIntersection.y + ")");
                    rock.pos = { x: Number(lastIntersection.x), y: Number(lastIntersection.y), z: 0 };
                    rock.v = { x,  y, z:0 }
                    return;
                }
            }
        }
    }

    findXYMatch();

    let x = rock.v.x;
    for (let z = -300; z < 300; z++) {
        let a = getHailRelativeVelocity(lines[0], { x, y:0, z});
        let foundMatch = true;
        let lastIntersection: { x: bigint, z: bigint } | null = null;

        for (let i = 1; i < lines.length; i++) {
            let b = getHailRelativeVelocity(lines[i], {x, y:0, z});
            let intersection = getXZIntersection(a, b);
            if (intersection && lastIntersection && (intersection.x !== lastIntersection.x || intersection.z !== lastIntersection.z)) {
                foundMatch = false;
                break;
            }
            lastIntersection = intersection;
        }

        if (foundMatch  && lastIntersection) {
            console.log("Found common interesection for x=" + x + ", z=" + z + " velocity!");
            console.log("Common intersection=(" + lastIntersection.x + ", " + lastIntersection.z + ")");
            rock.pos.z = Number(lastIntersection.z);
            rock.v.z = z;

            console.log("Found rock!");
            return Number(rock.pos.x + rock.pos.y + rock.pos.z);
        }
    }

    return -1;  // didn't find a common intersection point
}

function run(data: string[]): number {
    // return part1(testData, { low: 7, high: 27 });
    // return part1(data, { low: 200000000000000, high: 400000000000000 }); 
    // return part2();
    return part2(data);
}

export default run;