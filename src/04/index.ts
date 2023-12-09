const testData: string[] = [
    "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
    "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19",
    "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1",
    "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83",
    "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36",
    "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11"
];

type Card = {
    winningNums: string[],
    cardNums: string[],
    q: number
}

function parse(data: string[]): Card[] {
    let ret = [];
    

    for (let i = 0; i < data.length; i++) {
        let s = data[i].split(":")[1].split("|");

        let winningNums = s[0].split(" ").filter(Number);
        let cardNums = s[1].split(" ").filter(Number);
        
        ret.push({ winningNums, cardNums, q : 1});
    }

    return ret;
}

function part1(data: string[] = testData): number {
    let cards = parse(data);
    let sum = 0;

    for (let i = 0; i < cards.length; i++) {
        let matches = 0;
        let card = cards[i];

        for (let j = 0; j < card.winningNums.length; j++) {
            if (card.cardNums.includes(card.winningNums[j])) {
                matches++;
            }
        }

        if (matches > 0) {
            sum += Math.pow(2, matches - 1)
        }
    }

    return sum;
}

function part2(data: string[] = testData): number {
    let cards = parse(data);
    let sum = 0;

    for (let i = 0; i < cards.length; i++) {
        let matches = 0;
        let card = cards[i];
        sum += card.q;
        // console.log("Proessing card #" + i + ", with sum=" + sum + ", q=" + card.q);

        for (let j = 0; j < card.winningNums.length; j++) {
            if (card.cardNums.includes(card.winningNums[j])) {
                matches++;
            }
        }

        // console.log("Found " + matches + " matches");
        for (let j = 0; j < matches; j++) {
            cards[i + j + 1].q += card.q;
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