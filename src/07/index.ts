const testData: string[] = [
    "32T3K 765",
    "T55J5 684",
    "KK677 28",
    "KTJJT 220",
    "QQQJA 483"
];

type Round = {
    hand: string,
    bid: number
}

function parse(data: string[]): Round[] {
    let ret = [];

    for (let i = 0; i < data.length; i++) {
        let line = data[i].split(" ");
        ret.push({
            hand: line[0],
            bid: Number(line[1])
        });
    }

    return ret;
}

function part1(data: string[] = testData): number {
    let input = parse(data);
    let cardVal = "23456789TJQKA";
    let handType = [ "5KIND", "4KIND", "FULLHOUSE", "3KIND", "2PAIR", "1PAIR", "HIGHCARD" ];

    input.sort((a, b) => {
        function getHandType(hand: string) {
            let ret = "";
            let cards = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

            for (let i = 0; i < hand.length; i++) {
                cards[cardVal.indexOf(hand[i])]++;
            }
            // console.log("for hand=" + hand + ", cards=" + cards);

            if (cards.indexOf(5) >= 0) {
                return handType[0];
            } else if (cards.indexOf(4) >= 0) {
                return handType[1];
            } else if (cards.indexOf(3) >= 0) {
                if (cards.indexOf(2) >= 0) {
                    return handType[2];
                } else {
                    return handType[3];
                }
            } else if (cards.indexOf(2) >= 0) {
                if (cards.indexOf(2) !== cards.lastIndexOf(2)) {
                    return handType[4];
                } else {
                    return handType[5];
                }
            } else {
                return handType[6];
            }
        }

        let aHandType = getHandType(a.hand);
        let bHandType = getHandType(b.hand);
        // console.log(a.hand + " is of type " + aHandType + ", " + b.hand + " is of type " + bHandType);

        if (aHandType !== bHandType) {
            return handType.indexOf(bHandType) - handType.indexOf(aHandType)
        }

        for (let i = 0; i < a.hand.length; i++) {
            if (a.hand[i] == b.hand[i]) {
                continue;
            }

            return cardVal.indexOf(a.hand[i]) - cardVal.indexOf(b.hand[i])
        }

        return 0;
    });

    // console.log(JSON.stringify(input));

    let winnings = 0;
    for (let i = 0; i < input.length; i++) {
        winnings += (i + 1) * input[i].bid;
    }

    return winnings;
}

function part2(data: string[] = testData): number {
    let input = parse(data);
    let cardVal = "J23456789TQKA";
    let handType = [ "5KIND", "4KIND", "FULLHOUSE", "3KIND", "2PAIR", "1PAIR", "HIGHCARD" ];

    input.sort((a, b) => {
        function getHandType(hand:string ) {
            let ret = "";
            let cards = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
            let jokers = 0;

            for (let i = 0; i < hand.length; i++) {
                if (hand[i] !== 'J') {
                    cards[cardVal.indexOf(hand[i])]++;
                } else {
                    jokers++;
                }
            }
            // console.log("for hand=" + hand + ", cards=" + cards);

            if (Math.max(...cards) + jokers === 5) {
                return handType[0];
            } else if (Math.max(...cards) + jokers === 4) {
                return handType[1];
            } else if (Math.max(...cards) + jokers === 3) {
                // Won't have 4444_ or 444J_ or 44JJ_ or 4JJJ_ or JJJJ_
                // Could have 444TT or 44412 or 44JTT or 44J12 or 4JJ12
                if (jokers == 0) {
                    if (cards.indexOf(2) >= 0) {
                        return handType[2];
                    } else {
                        return handType[3];
                    }
                } else if (jokers == 2) { // can't be full house, would be 4 or 5 of a kind if there was a pair
                    return handType[3];
                } else { // 1 joker
                    if (cards.indexOf(2) !== cards.lastIndexOf(2)) {
                        return handType[2];
                    } else {
                        return handType[3];
                    }
                }
            } else if (Math.max(...cards) + jokers === 2) {
                if (jokers == 0) {
                    if (cards.indexOf(2) !== cards.lastIndexOf(2)) {
                        return handType[4];
                    } else {
                        return handType[5];
                    }
                } else { // 1 joker
                    return handType[5];
                }
            } else {
                return handType[6];
            }
        }

        let aHandType = getHandType(a.hand);
        let bHandType = getHandType(b.hand);
        // console.log(a.hand + " is of type " + aHandType + ", " + b.hand + " is of type " + bHandType);

        if (aHandType !== bHandType) {
            return handType.indexOf(bHandType) - handType.indexOf(aHandType)
        }

        for (let i = 0; i < a.hand.length; i++) {
            if (a.hand[i] == b.hand[i]) {
                continue;
            }

            return cardVal.indexOf(a.hand[i]) - cardVal.indexOf(b.hand[i])
        }

        return 0;
    });

    // console.log(JSON.stringify(input));

    let winnings = 0;
    for (let i = 0; i < input.length; i++) {
        winnings += (i + 1) * input[i].bid;
    }

    return winnings;
}

function run(data: string[]): number {
    // return part1();
    // return part1(data); 
    // return part2();
    return part2(data);
}

export default run;