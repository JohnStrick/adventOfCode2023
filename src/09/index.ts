const testData: string[] = [
    "0 3 6 9 12 15",
    "1 3 6 10 15 21",
    "10 13 16 21 30 45"
];

function part1(data: string[] = testData): number {
    let sum = 0;

    for ( let i = 0; i < data.length; i++) {
        let sequences: Array<number[]> = [];
        sequences.push(data[i].split(" ").map(Number));

        function isArrayAllZeros(seq: number[]): boolean {
            let isAllZeros = true;

            for (let i = 0; i < seq.length; i++) {
                if (seq[i] != 0) {
                    isAllZeros = false;
                }
             }

             return isAllZeros;
        }

        while (!isArrayAllZeros(sequences[sequences.length - 1])) {
            let newSeq: number[] = [];
            let curSeq = sequences[sequences.length - 1];
            // console.log("examining sequence:" + curSeq);

            for (let i = 1; i < curSeq.length; i++) {
                newSeq.push(curSeq[i] - curSeq[i - 1]);
            }

            // console.log(" pushing new sequence:" + newSeq);
            sequences.push(newSeq);
        }

        for (let i = sequences.length - 2; i >= 0; i--) {
            let a = sequences[i];
            let b = sequences[i + 1];
            let newVal = a[a.length - 1] + b[b.length - 1];

            // console.log("pushing newVal=" + newVal);
            a.push(newVal);;
        }
        
        // console.log("final sequences=" + sequences.join(","));
        let seq = sequences[0];
        sum += seq[seq.length - 1];
    }

    return sum;
}

function part2(data: string[] = testData): number {
    let sum = 0;

    for ( let i = 0; i < data.length; i++) {
        let sequences: Array<number[]> = [];
        sequences.push(data[i].split(" ").map(Number));

        function isArrayAllZeros(seq: number[]): boolean {
            let isAllZeros = true;

            for (let i = 0; i < seq.length; i++) {
                if (seq[i] != 0) {
                    isAllZeros = false;
                }
             }

             return isAllZeros;
        }

        while (!isArrayAllZeros(sequences[sequences.length - 1])) {
            let newSeq: number[] = [];
            let curSeq = sequences[sequences.length - 1];
            // console.log("examining sequence:" + curSeq);

            for (let i = 1; i < curSeq.length; i++) {
                newSeq.push(curSeq[i] - curSeq[i - 1]);
            }

            // console.log(" pushing new sequence:" + newSeq);
            sequences.push(newSeq);
        }

        for (let i = sequences.length - 2; i >= 0; i--) {
            let a = sequences[i];
            let b = sequences[i + 1];
            let newVal = a[0] - b[0];

            // console.log("pushing newVal=" + newVal);
            sequences[i] = [newVal].concat(...a);
        }
        
        // console.log("final sequences=" + sequences.join("|"));
        let seq = sequences[0];
        sum += seq[0];
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