const testData: string[] = [
    "#.##..##.",
    "..#.##.#.",
    "##......#",
    "##......#",
    "..#.##.#.",
    "..##..##.",
    "#.#.##.#.",
    "",
    "#...##..#",
    "#....#..#",
    "..##..###",
    "#####.##.",
    "#####.##.",
    "..##..###",
    "#....#..#"
];

function parse(data: string[]): Array<string[]> {
    let puzzle = [];

    let index = 0;
    while (index < data.length) {
        let input = [];
        while (data[index] !== "" && index < data.length) {
            input.push(data[index++]);
        }
        puzzle.push(input);
        index++;
    }

    // for(let i = 0; i < puzzle.length; i++) {
    //     console.log(puzzle[i]);
    // }

    return puzzle;
}

function getRelectingLine(input: string[], allowSmudge: boolean = false, original: number = -1): number {
    function getDiffOfRow(a: string, b: string): number {
        let diff = 0;

        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                diff++;
            }
        }

        return diff;
    }

    function getDiffOfColIndex(a: number, b: number): number {
        let diff = 0;

        for (let y = 0; y < input.length; y++) {
            if (input[y][a] !== input[y][b]) {
                diff++;
            }
        }

        return diff;
    }

    // scan rows
    for (let j = 1; j < input.length; j++) {
        // console.log(" scanning row " + j);
        let found = true;

        for (let k = 0; j - k - 1 >= 0 && j + k < input.length; k++) {
            let diff = getDiffOfRow(input[j + k], input[j - k - 1]);
            if (diff === 1 && allowSmudge) {
                // smudge current row
                let newInput = input.slice();
                newInput[j + k] = input[j - k - 1];
                
                let reflectingLine = getRelectingLine(newInput, false, original);
                if (reflectingLine !== 0) {
                    return reflectingLine;
                }

                // smudge previous row
                newInput = input.slice();
                newInput[j - k - 1] = newInput[j + k];
                
                reflectingLine = getRelectingLine(newInput, false, original);
                if (reflectingLine !== 0) {
                    return reflectingLine;
                }
            } else if (diff !== 0) {
                found = false;
                break;
            }
        }

        if (found && j * 100 !== original) {
            // console.log("  Found row reflecting line at " + j * 100);
            return j * 100;
        }
    }

    // scan columns
    for (let j = 1; j < input[0].length; j++) {
        // console.log(" scanning column " + j);
        let found = true;

        for (let k = 0; j - k - 1 >= 0 && j + k < input[0].length && found; k++) {
            let diff = getDiffOfColIndex(j + k, j - k - 1);
            if (diff === 1 && allowSmudge) {
                function smudgeColumnByIndex(a: number, b: number): string[] {
                    let newInput = input.slice();

                    for (let y = 0; y < input.length; y++) {
                        let s = newInput[y].split("");
                        s[a] = s[b];
                        newInput[y] = s.join("");
                    }

                    return newInput;
                }

                // smudge current column
                let newInput = smudgeColumnByIndex(j + k, j - k - 1);
                
                let reflectingLine = getRelectingLine(newInput, false, original);
                if (reflectingLine !== 0) {
                    return reflectingLine;
                }

                // smudge previous column
                newInput = smudgeColumnByIndex(j - k - 1, j + k);
                
                reflectingLine = getRelectingLine(newInput, false, original);
                if (reflectingLine !== 0) {
                    return reflectingLine;
                }
            } else if (diff !== 0) {
                found = false;
                break;
            }
        }

        if (found && j !== original) {
            // console.log("  Found column reflecting line at " + j);
            return j;
        }
    }

    // console.log(" == did not find reflecting line");
    return 0;
}

function part1(data: string[] = testData): number {
    let puzzle = parse(data);
    let sum = 0;

    for (let i = 0; i < puzzle.length; i++) {
        // console.log("starting with puzzle " + i);
        sum += getRelectingLine(puzzle[i]);
    }

    return sum;
}

function part2(data: string[] = testData): number {
    let puzzle = parse(data);
    let sum = 0;

    for (let i = 0; i < puzzle.length; i++) {
        // console.log("starting with puzzle " + i);
        // console.log(puzzle[i]);
        let orginalLine = getRelectingLine(puzzle[i]);
        let reflectingLine = getRelectingLine(puzzle[i], true, orginalLine);

        if (reflectingLine === 0) {
            throw "could not find reflecting line in puzzle "+ i;
        }

        sum += reflectingLine;
    }

    return sum;
}

function run(data: string[]): number {
    // return part1();
    // return part1(data); 
    // return part2();
    return part2(data);
}

export default run;