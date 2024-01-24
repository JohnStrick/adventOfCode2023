import { useMemo } from "../utils";

const testData: string[] = [
    "???.### 1,1,3",
    ".??..??...?##. 1,1,3",
    "?#?#?#?#?#?#?#? 1,3,1,6",
    "????.#...#... 4,1,1",
    "????.######..#####. 1,6,5",
    "?###???????? 3,2,1"
];

type Records = {
    record: string,
    counts: number[];
}

function parse(data: string[], copies: number = 1): Records[] {
    let recs = [] as Records[];

    for (let i = 0; i < data.length; i++) {
        let s = data[i].split(" ");
        let r = s[0].trim();
        let n = Array.from(s[1].split(","), Number);

        let record = r;
        let counts = n;
        
        for (let j = 0; j < copies - 1; j++) {
            record += "?" + r;
            counts = counts.concat(...n);
        }

        recs.push({ record, counts });
    }

    // console.log("recs=" + JSON.stringify(recs));
    return recs;
}

function solve(recs: Records[]): number {
    const getKey = (args: [record: string, counts: number[]]): string => {
        return args[0] + "|" + args[1].join(",");
    }
  
    const startToggle = useMemo((record: string, counts: number[]): number => {
        while (record[0] === ".") {  // remove any leading '.' characters
            record = record.slice(1);
        }

        if (record.length === 0) {
            if (counts.length === 0) {
                return 1;
            } else {
                return 0;
            }
        }

        if (counts.length === 0) {
            if (record.indexOf("#") !== -1) {
                return 0;
            } else {
                return 1;
            }
        }

        // Check if there is room left in the string for all the counts we still need to find
        if (counts.reduce((acc, c) => acc + c + 1, 0) - 1 > record.length) {
            return 0;
        }

        if (record[0] === "#") {
            let i = 0;
            for (; i < counts[0]; i++) {
                if (record[i] === ".") {  // i might go out of bounds, but that's ok. It'll just be undefined.
                    return 0;
                }
            }

            if (record[i] === "#") {
                return 0;
            }

            const [ r, ...remainingCounts] = counts;
            return startToggle(record.slice(i + 1), remainingCounts);
        } else {  // record[0] === "?"
            return startToggle("#" + record.slice(1), counts) + startToggle("." + record.slice(1), counts);
        }
    }, getKey);

    let sum = 0;
    for (let i = 0; i < recs.length; i++) {
        sum += startToggle(recs[i].record, recs[i].counts);
    }

    return sum;
}

function part1(data: string[] = testData): number {
    let parsedData = parse(data);
    return solve(parsedData);
}

function part2(data: string[] = testData): number {
    let parsedData = parse(data, 5);
    return solve(parsedData);
}

function run(data: string[]): number {
    // return part1();
    // return part1(data); 
    // return part2();
    return part2(data);
}

export default run;