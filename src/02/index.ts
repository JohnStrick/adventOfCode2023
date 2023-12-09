const testData: string[] = [
    "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
    "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
    "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
    "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
    "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green"
];

type BallList = {
    red: number,
    blue: number,
    green: number
}

type Color = "red" | "blue" | "green";

function parse(data: string[]): BallList[] {
    let ret = [];

    for (let i = 0; i < data.length; i++) {
        console.log("Parsing game #" + i);
        let balls: BallList = { "red" : 0, "blue": 0, "green" : 0 };

        let s = data[i].substring(data[i].indexOf(":") + 2).split(";");
        console.log("Game #" + i + " data is " + s);
        for (let j = 0; j < s.length; j++) {
            let t = s[j].split(',');

            for (let k = 0; k < t.length; k++) {
                t[k] = t[k].trim();
                
                let tokens = t[k].split(" ") as Color[];
                balls[tokens[1]] = Math.max(balls[tokens[1]], Number(tokens[0]));
            }
        }
        
        console.log("Game #" + i + " object is " + JSON.stringify(balls));
        ret.push(balls);
    }

    return ret;
}

function part1(data: string[] = testData): number {
    let log = parse(data);
    let sum = 0;
    let check = { "red" : 12, "blue" : 14, "green": 13 };

    for (let i = 0; i < log.length; i++) {
        if (log[i].red <= check.red && log[i].blue <= check.blue && log[i].green <= check.green) {
            sum += (i + 1);
        }
    }

    return sum;
}

function part2(data: string[] = testData): number {
    let log = parse(data);
    let sum = 0;

    for (let i = 0; i < log.length; i++) {
        sum += log[i].red * log[i].blue * log[i].green;
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