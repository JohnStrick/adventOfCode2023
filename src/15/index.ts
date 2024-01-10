const testHash: string = "HASH";
const testData: string = "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7";

function getHashValue(c: string, pos: number, total: number): number {
    total += c.charCodeAt(pos);
    total *= 17;
    total %= 256;
    return total;
}

function part1(data: string = testData): number {
    let steps = data.split(",");
    let sum = 0;

    for (let i = 0; i < steps.length; i++) {
        let total = 0;
        // console.log("processing '" + steps[i] + "'");

        for (let j = 0; j < steps[i].length; j++) {
            total = getHashValue(steps[i], j, total)
        }

        // console.log("total for step " + (i + 1) + " =" + total)
        sum += total;
    }

    return sum;
}

type Lense = {
    label: string,
    focalLength: number
}

function part2(data: string = testData): number {
    let steps = data.split(",");

    // work-around intersting JS behavior that fill([]) will not be a unique array for each element
    let boxes: Array<Lense[]> = new Array(256).fill([]).map(() => []);

    function printBoxes() {
        for (let i = 0; i < boxes.length; i++) {
            let box = boxes[i];
            if (box.length > 0) {
                console.log(" box #" + i);
                for (let j = 0; j < box.length; j++) {
                    console.log("  lense: " + box[j].label + " " + box[j].focalLength);
                }
            }
        }
    }
 
    for (let i = 0; i < steps.length; i++) {
        let step = steps[i];
        // console.log("Performing step:" + step);

        let boxNum = 0, stepIndex = 0;
        while (step[stepIndex] !== "=" && step[stepIndex] !== "-") {
            boxNum = getHashValue(step, stepIndex++, boxNum)
        }

        // console.log(" acting on box #" + boxNum);
        let lenses = boxes[boxNum];
        
        if (step[stepIndex] === "=") {
            let label = step.split("=")[0];
            let focalLength = Number(step[stepIndex + 1]);
            let existingIndex = lenses.findIndex((value) => value.label === label);

            if (existingIndex === -1) {  // add new lense to back
                lenses.push({
                    label,
                    focalLength
                });
            } else {  // replace existing lense
                lenses[existingIndex].focalLength = focalLength;
            }
        } else {  // remove lense (if it exists)
            let label = step.split("-")[0];
            let existingIndex = lenses.findIndex((value) => value.label === label);
            if (existingIndex !== -1) {
                lenses.splice(existingIndex, 1);
            }
        }

        // printBoxes();
    }

    let sum = 0;
    for (let i = 0; i < boxes.length; i++) {
        let box = boxes[i];
        for (let j = 0; j < box.length; j++) {
            sum += (i + 1) * (j + 1) * box[j].focalLength;
        }
    }

    return sum;
}

function run(data: string[]): number {
    // return part1();
    // return part1(data[0]); 
    // return part2();
    return part2(data[0]);
}

export default run;