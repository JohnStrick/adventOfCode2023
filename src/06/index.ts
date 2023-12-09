function race(times: number[], distances: number[]): number {
    let totalWins = [];

    for (let i = 0; i < times.length; i++) {
        let time = times[i];
        let record = distances[i];
        let wins = 0;
        // console.log("Examining race w/ time=" + time + " and record=" + record);

        for (let t = 0; t < time; t++) {
            // console.log(" at t=" + t + " distance is " + (t*(time-t)).toString());
            if (t * (time - t) > record) {
                wins++;
            }
        }

        // console.log(" TOTAL WINS=" + wins);
        totalWins.push(wins);
    }

    console.log("totalWins=" + totalWins);
    return totalWins.reduce((a, b) => a * b);
}

function part1(times: number[], distances: number[]): number {
    return race(times, distances)
}

function part2(times: number[], distances: number[]): number {
    return race(times, distances)
}

function run(data: string[]): number {
    // return part1([7, 15, 30], [9, 40, 200]);
    // return part1([44, 80, 65, 72], [208, 1581, 1050, 1102]);
    // return part2([71530], [940200]); 
    return part2([44806572], [208158110501102]);
}

export default run;