const testData: string[] = [
    "467..114..",
    "...*......",
    "..35...633",
    "......#...",
    "617*......",
    ".....+.58.",
    "..592.....",
    "......755.",
    "...$.*....",
    ".664.598.."
];

type Ratio = {
    val: number,
    startX: number,
    endX: number,
    y: number
}

function parse(data: string[]): Ratio[] {
    let ret: Ratio[] = [];

    for ( let i = 0; i < data.length; i++ ) {
        for ( let j = 0; j < data[i].length; j++ ) {
            if (!isNaN(Number(data[i][j]))) {
                let numLen = 1;

                while (j + numLen < data[i].length) {
                    if (isNaN(Number(data[i][j + numLen]))) {
                        break;
                    }
                    numLen++;
                }
                
                let num = Number(data[i].substring(j, j + numLen));
                ret.push({
                    val: num,
                    startX: j,
                    endX: j + numLen - 1,
                    y: i
                });

                j += numLen - 1;
            }
        }
    }

    // console.log("number map is " + JSON.stringify(ret));
    return ret;
}

function part1(data: string[] = testData): number {
    let sum = 0;

    for ( let i = 0; i < data.length; i++ ) {
        for ( let j = 0; j < data[i].length; j++ ) {
            if (!isNaN(Number(data[i][j]))) {

                let includeNumber = false;

                let lowerX = Math.max(j - 1, 0);
                let numLen = 1;

                while (j + numLen < data[i].length) {
                    if (isNaN(Number(data[i][j + numLen]))) {
                        break;
                    }
                    numLen++;
                }
                let upperX = Math.min(j + numLen, data[i].length - 1);

                console.log("scanning number at pos y=" + i + ", x=" + j + ", with lowerX=" + lowerX + ", and upperX=" + upperX + ", and numLen=" + numLen);

                // scan above
                if (i > 0) {
                    for (let k = lowerX; k <= upperX; k++) {
                        if (data[i - 1][k] != "." && isNaN(Number(data[i - 1][k]))) {
                            includeNumber = true;
                            break;
                        }
                    }
                }

                // scan row
                if (!includeNumber) {
                    if ((data[i][lowerX] != "." && isNaN(Number(data[i][lowerX]))) ||
                         (data[i][upperX] != "." && isNaN(Number(data[i][upperX])))) {
                        includeNumber = true;
                    }
                }
                // scan below
                if (i < data.length - 1) {
                    for (let k = lowerX; k <= upperX; k++) {
                        if (data[i + 1][k] != "." && isNaN(Number(data[i + 1][k]))) {
                            includeNumber = true;
                            break;
                        }
                    }
                }

                let num = Number(data[i].substr(j, numLen));
                if (includeNumber) {
                    sum += num;
                    console.log("adding " + num + " to sum");
                } else {
                    console.log("ommitting " + num + " from sum");
                }

                j += numLen - 1;
            }
        }
    }

    return sum;
}

function part2(data: string[] = testData): number {
    let sum = 0;

    function isGear(i: number, j: number) {
        let numParts = 0;
        let numbers = parse(data);

        for (let k = 0; k < numbers.length; k++) {
            if (numbers[k].y >= i - 1 && numbers[k].y <= i + 1 && j >= numbers[k].startX - 1 && j <= numbers[k].endX + 1) {
                numParts++;
            }
        }

        console.log("numParts=" + numParts);
        return numParts == 2;
    }

    function addNumbers(i: number, j: number) {
        let product = 1;
        let numbers = parse(data);

        for (let k = 0; k < numbers.length; k++) {
            if (numbers[k].y >= i - 1 && numbers[k].y <= i + 1 && j >= numbers[k].startX - 1 && j <= numbers[k].endX + 1) {
                console.log("  one gear ratio is:" + numbers[k].val)
                product *= numbers[k].val;
            }
        }

        console.log("product is " + product);
        return product;
    }

    for ( let i = 0; i < data.length; i++ ) {
        for ( let j = 0; j < data[i].length; j++ ) {
            if (data[i][j] == '*') {
                console.log("checking if i=" + i + ", j=" + j + " is a gear");
                if (isGear(i, j)) {
                    console.log("It is a gear!");
                    sum += addNumbers(i, j);
                }
            }
        }
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