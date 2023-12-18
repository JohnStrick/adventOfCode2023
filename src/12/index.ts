const testData: string[] = [
    "???.### 1,1,3",
    ".??..??...?##. 1,1,3",
    "?#?#?#?#?#?#?#? 1,3,1,6",
    "????.#...#... 4,1,1",
    "????.######..#####. 1,6,5",
    "?###???????? 3,2,1"
];

const validData: string[] = [
    "#.#.### 1,1,3",
    ".#...#....###. 1,1,3",
    ".#.###.#.###### 1,3,1,6",
    "####.#...#... 4,1,1",
    "#....######..#####. 1,6,5",
    ".###.##....# 3,2,1"
]

type Records = {
    record: string,
    counts: number[];
}

function parse(data: string[]): Records[] {
    let recs = [] as Records[];

    for (let i = 0; i < data.length; i++) {
        let s = data[i].split(" ");
        let record = s[0].trim();

        let n = s[1].split(",");
        let counts = Array.from(n, Number);
        recs.push({record, counts});
    }

    // console.log("recs=" + JSON.stringify(recs));
    return recs;
}

function parsePart2(data: string[]): Records[] {
    let recs = [] as Records[];

    for (let i = 0; i < data.length; i++) {
        let s = data[i].split(" ");
        let record = s[0].trim();

        let n = s[1].split(",");
        let counts = Array.from(n, Number);

        let newRecord = record;
        let newCounts = counts;

        for (let j = 0; j < 4; j++) {
            newRecord += "?" + record;
            newCounts = newCounts.concat(...counts);
        }

        recs.push({record: newRecord, counts: newCounts});
    }

    console.log("recs=" + JSON.stringify(recs));
    return recs;
}

function solve(recs: Records[]): number {
    let sum = 0;

    function isValid(s: string, c: number[]): boolean {
        let t = [];

        let isBroken = (s[0] == "#");
        let brokenCount = isBroken ? 1 : 0;
        for (let i = 1; i < s.length; i++) {
            if (s[i] == "#") {
                if (isBroken) {
                    brokenCount++;
                } else {
                    isBroken = true;
                    brokenCount = 1;
                }
            } else {
                if (isBroken) {
                    t.push(brokenCount);
                    brokenCount = 0;
                    isBroken = false;
                }
            }
        }

        if (brokenCount > 0) {
            t.push(brokenCount);
        }

        let valid = c.length == t.length;
        for (let i = 0; valid && i < c.length; i++) {
            if (t[i] != c[i]) {
                valid = false;
            }
        }

        return valid;
    }

    function startToggle(record: string, counts: number[]): number {
        // console.log(" Testing '" + record + "' for " + counts.join());
        let first = record.indexOf("?");
        if (first == -1) {
            return isValid(record, counts) ? 1 : 0; 
        }

        let toggleOp = record.substring(0, first) + ".";
        if (first < record.length - 1) {
            toggleOp += record.substring(first + 1);
        }

        let toggleDamaged = record.substring(0, first) + "#";
        if (first < record.length - 1) {
            toggleDamaged += record.substring(first + 1);
        }

        return startToggle(toggleOp, counts) + startToggle(toggleDamaged, counts);
    }

    // let testRecord = "#.#.###";
    // let testRecord = "..#..##....##";
    // let testRecord = ".##...#...###.";
    // let testCount = [1,1,3];
    // let ans = isValid(testRecord, testCount);
    // console.log("** Test for '" + testRecord + "' with " + testCount.join() + " equals " + ans);    

    for (let i = 0; i < recs.length; i++) {
        console.log("**** Examining record #" + i + " ****");
        let num = startToggle(recs[i].record, recs[i].counts);
        console.log("!!!! There are " + num + " valid");
        sum += num;
    }

    return sum;
}
function part1(data: string[] = testData): number {
    let parsedData = parse(data);
    return solve(parsedData);
}

function part2(data: string[] = testData): number {
    let parsedData = parsePart2(data);
    return solve(parsedData);
}

function run(data: string[]): number {
    // return part1();
    return part1(data); 
    // return part2();
    // return part2(data);
}

export default run;