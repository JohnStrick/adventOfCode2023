const testData: string[] = [
];

type Range = {
    start: number,
    end: number,
    offset: number
}

type Almanac = {
    seeds: string[],
    ranges: Array<Range[]>
}

function parse(data: string[]): Almanac {
    let ret = {} as Almanac;

    ret.seeds = data[0].split(":")[1].split(" ").filter(Number);
    ret.ranges = [];
    let pos = 1;

    function parseRange() {
        let range = [];
        let minSource = Number.MAX_SAFE_INTEGER;
        let maxSource = -1;

        while (pos < data.length && data[pos].length != 0) {
            let s = data[pos].split(" ");
            let source = Number(s[1]);
            let dest = Number(s[0]);
            let rLength = Number(s[2]);

            range.push({ start: source, end: source + rLength - 1, offset: dest - source});
            minSource = Math.min(minSource, source);
            maxSource = Math.max(maxSource, source);
            pos++;
        }

        if (minSource != 0) {
            range.push({ start: 0, end: minSource - 1, offset: 0});
        }
        range.push({ start: maxSource + 1, end: Number.MAX_SAFE_INTEGER, offset: 0})
        range.sort((a, b) => a.start - b.start);
        // console.log("pushing range: " + JSON.stringify(range));
        ret.ranges.push(range);
    }

    while ( pos < data.length) {
        if (data[pos].indexOf(":") !== -1) {
            pos++;
            parseRange();
        }
        pos++;
    }

    return ret;
}

function part1(data: string[] = testData): number {
    let almanac = parse(data);
    let seeds = almanac.seeds;
    let ranges = almanac.ranges;
    let locations = [];

    for ( let i = 0; i < seeds.length; i++) {
        let seed = Number(seeds[i]);
        let key = seed;
        // console.log("examining seed with value " + key);
        
        for (let j = 0; j < ranges.length; j++ ) {
            let range = ranges[j];

            for (let k = 0; k < range.length; k++) {
                if (key >= range[k].start && key <= range[k].end) {
                    key += range[k].offset;
                    // console.log("found map value for range #" + j +" at loc #" + k + ", new key value is " + key);
                    break;
                }
            }
        }

        // console.log("final location=" + key);
        locations.push(key);
    }

    let min = Math.min(...locations);
    return min;
}

// Takes 8 minutes to execute!!!
function part2(data: string[] = testData): number {
    let almanac = parse(data);
    
    let seeds = [];
    for (let i = 0; i < almanac.seeds.length; i+=2) {
        seeds.push([almanac.seeds[i], almanac.seeds[i + 1]]);
    }
    seeds.sort((a, b) => Number(a[0]) - Number(b[0]))

    let ranges = almanac.ranges;
    let minLocation = Number.MAX_SAFE_INTEGER;

    for ( let i = 0; i < seeds.length; i++) {
        let startSeed = Number(seeds[i][0]);
        let endSeed = startSeed + Number(seeds[i][1]) - 1;
        // console.log("examining seeds from " + startSeed + " to " + endSeed)

        for ( let t = startSeed; t <= endSeed; t++) {
            let seed = t
            let key = seed;
            // console.log("examining seed with value " + key);
            
            for (let j = 0; j < ranges.length; j++ ) {
                let range = ranges[j];

                for (let k = 0; k < range.length; k++) {
                    if (key >= range[k].start && key <= range[k].end) {
                        key += range[k].offset;
                        // console.log("found map value for range #" + j +" at loc #" + k + ", new key value is " + key);
                        break;
                    }
                }
            }

            // console.log("final location=" + key);
            minLocation = Math.min(minLocation, key);
        }
    }

    return minLocation;
}

function run(data: string[]): number {
    // return part1(data); // run as 'npm start 05 test.txt'
    // return part1(data); 
    // return part2(data);  // run as 'npm start 05 test.txt'
    return part2(data);
}

export default run;