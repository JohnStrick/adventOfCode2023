const testData: string[] = [
    "RL",
    "",
    "AAA = (BBB, CCC)",
    "BBB = (DDD, EEE)",
    "CCC = (ZZZ, GGG)",
    "DDD = (DDD, DDD)",
    "EEE = (EEE, EEE)",
    "GGG = (GGG, GGG)",
    "ZZZ = (ZZZ, ZZZ)"
];

const testData2 = [
    "LLR",
    "",
    "AAA = (BBB, BBB)",
    "BBB = (AAA, ZZZ)",
    "ZZZ = (ZZZ, ZZZ)"
]

const testData3 = [
    "LR",
    "",
    "11A = (11B, XXX)",
    "11B = (XXX, 11Z)",
    "11Z = (11B, XXX)",
    "22A = (22B, XXX)",
    "22B = (22C, 22C)",
    "22C = (22Z, 22Z)",
    "22Z = (22B, 22B)",
    "XXX = (XXX, XXX)"
]


type Node = {
    name: string,
    left: string,
    right: string
}

type Map = {
    instructions: string,
    nodes: {
        [key: string] : Node;
    }
}

function parse(data: string[]): Map {
    let ret = {} as Map
    ret.instructions = data[0];
    ret.nodes = {};

    for (let i = 2; i < data.length; i++) {
        let s = data[i].split('=');
        let n = s[0].trim();
        let children = s[1].split(',');
        let left = children[0].substring(2).trim();
        let right = children[1].trim();
        right = right.substring(0, 3);

        let node = {
            name: n,
            left,
            right
        }

        ret.nodes[n] = node;
    }

    // console.log("nodes=" + JSON.stringify(ret));
    return ret;
}

function part1(data: string[] = testData): number {
    let {
        instructions,
        nodes
    } = parse(data);

    let steps = 0;
    let current = nodes["AAA"];
    let i = 0;

    while (current.name != "ZZZ") {
        // console.log("current is " + current.name + ", steps=" + steps + ", i=" + i);
        if (instructions[i] == "L") {
            // console.log(" navigating left to " + current.left);
            current = nodes[current.left];
        } else {
            // console.log(" navigating right to " + current.right);
            current = nodes[current.right];
        }

        steps++;
        i = (i + 1) % instructions.length;
    }

    return steps;
}

/* NOTES:
Starting node #0 has a cycle of 11653 steps, which is 43 * 271
Starting node #1 has a cycle of 19783 steps, which is 73 * 271
Starting node #2 has a cycle of 19241 steps, which is 71 * 271
Starting node #3 has a cycle of 16531 steps, which is 61 * 271
Starting node #4 has a cycle of 11737 steps, which is 47 * 271
Starting node #5 has a cycle of 14363 steps, which is 53 * 271

LCM of the 6 nodes is 43 * 73 * 71 * 61 * 47 * 53 = 9177460370549

So that's the answer. This code will not finish executing since it would need to cycle
through 9.2 trillion steps! Sovled this via finding the cycles below and computing the LCM */
function part2(data: string[] = testData3): number {
    let {
        instructions,
        nodes
    } = parse(data);

    let currentNodes: Node[] = [];
    for (let key in nodes) {
        if (key[2] === 'A') {
            currentNodes.push(nodes[key]);
        }
    }

    let steps = 0;
    let i = 0;
    let last = [0, 0, 0, 0, 0, 0];
    
    function isAtEnd() {
        let atEnd = true;
        let endNodes = 0;

        for (let k = 0; k < currentNodes.length; k++) {
            if (currentNodes[k].name[2] !== 'Z') {
                atEnd = false;
            } else {
                // if (k == 5) {
                //     console.log("Found '" + currentNodes[k].name + "' for pos #" + k + ", steps=" + steps + ", i=" + i + ", diff=" + (steps - last[k]));
                // }
                last[k] = steps;
                endNodes++;
            }
        }

        // if (endNodes > 1) {
        //     console.log("Found " + endNodes + " at step=" + steps + ", i=" + i + ", nodes=" + printNodes());
        // }
        return atEnd;
    }

    function printNodes() {
        let s = "";
        for (let i = 0; i < currentNodes.length; i++) {
            s += currentNodes[i].name + ",";
        }
        return s.substring(0, s.length - 1);
    }

    while (!isAtEnd()) {
        // console.log("steps=" + steps + ", i=" + i + ", currentNodes=" + printNodes());
        if (instructions[i] === "L") {
            // console.log(" navigating all " + currentNodes.length + " to the left")
            for (let j = 0; j < currentNodes.length; j++) {
                currentNodes[j] = nodes[currentNodes[j].left];
            }
        } else {
            // console.log(" navigating all " + currentNodes.length + " to the right")
            for (let j = 0; j < currentNodes.length; j++) {
                currentNodes[j] = nodes[currentNodes[j].right];
            }
        }

        steps++;
        i = (i + 1) % instructions.length;
    }

    return steps;
}

function run(data: string[]): number {
    // return part1(testData2);
    // return part1(data); 
    // return part2(testData3);
    return part2(data);
}

export default run;