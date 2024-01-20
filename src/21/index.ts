const testData: string[] = [
    "...........",
    ".....###.#.",
    ".###.##..#.",
    "..#.#...#..",
    "....#.#....",
    ".##..S####.",
    ".##..#...#.",
    ".......##..",
    ".##.#.####.",
    ".##..##.##.",
    "..........."
];

const testData3: string[] = [
        ".....",
        "...#.",
        "..S..",
        ".....",
        "#...."
];

type Pos = {
    x: number,
    y: number
};

type QueueItem = {
    node: Pos,
    distance: number
};

const getStart = (data: string[]): Pos => {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] === "S") {
                return { y: j, x: i};
            }
        }
    }

    throw "Couldn't find start!";
}

function part1(data: string[] = testData, steps: number): number {
    let current = getStart(data);

    const visited: {[name: string]: number}= {};
    const queue = []
    queue.push({node: current, distance: 0});
    const getKey = (node: Pos): string => node.y + "," + node.x;

    while(queue.length > 0) {
        let item = queue.shift() as QueueItem;
        current = item.node;

        if (visited[getKey(item.node)] !== undefined) {
            continue;
        } else {
            visited[getKey(item.node)] = item.distance;
        }

        const moves = [[ -1, 0], [1, 0], [0, -1], [0, 1]];

        moves.forEach((m) => {
            if (current.y + m[0] >= 0 && current.y + m[0] < data.length && current.x + m[1] >= 0 && current.x + m[1] < data[0].length) {
                if (data[current.y + m[0]][current.x + m[1]] !== "#") {
                    queue.push({ 
                        node: { y: current.y + m[0], x: current.x + m[1] },
                        distance: item.distance + 1
                    });
                }
            }
        });
    }

    let reachable = 0;
    for (let value of Object.values(visited)) {
        if (value <= steps && value % 2 === steps % 2) {
            reachable++;
        }
    }
    return reachable;
}

// We can calculate the size of the "walk diamond" by calculating the size of the diamond in the initial map
// This is only true if there is an easy path to all areas on the perimeter. Fortunately, the data file map
// is clear of rocks both up & down & left & right from start -- and also along the "walk diamond".
// 
// When there are no repeated maps, we can just calculate the diamond shape to the edges of the map
// When there is 1 repeated map, we have a total of 5 single-sized diamonds, and 4 sets of corners
// When there is 2 repeated maps, we have a total of 13 single-sized diamonds, and 12 sets of corners
// When there is 3 repeated maps, we have a total of 25 single-sized dimaonds, and 24 sets of corners
//
// Generally, the number of single-sized diamonds can be expressed as: (r + 1)^2 + r^2
// The number of corners is one less than the # of single-sized diamonds.
function part2(data: string[] = testData, steps: number): number {
    if (data.length !== data[0].length) {
        throw "This part only works on data that is square!";
    }

    let current = getStart(data);
    let start = current;

    const mapRepeats = (steps - start.x) / data.length;
    if ((steps - start.x) % data.length !== 0) {
        throw "This part only works if the number of steps is exactly equal to the edge of a repeated map!";
    }

    const visited: {[name: string]: number}= {};
    const queue = [{node: current, distance: 0}];
    const getKey = (node: Pos): string => node.y + "," + node.x;
    const moves = [[ -1, 0], [1, 0], [0, -1], [0, 1]];

    const diamond = { oddSteps: 0, evenSteps: 0 };
    const corners = { oddSteps: 0, evenSteps: 0 };

    while(queue.length > 0) {
        let item = queue.shift() as QueueItem;
        current = item.node;
        const key = getKey(current);

        if (visited[key] !== undefined) {
            continue;
        } else {
            visited[key] = item.distance;

            // Keep track of the number of plots that have an odd or even amount of steps to get there.
            // Also keep track of the "corners", that is, where the distance is outside the "diamond" of the BFS.
            if (item.distance <= start.x) {
                item.distance % 2 === 0 ? diamond.evenSteps++ : diamond.oddSteps++;
            } else {
                item.distance % 2 === 0 ? corners.evenSteps++ : corners.oddSteps++;
            }
        }

        // Breadth First Search (BFS) for the given map (no repeats).
        moves.forEach((m) => {
            if (current.y + m[0] >= 0 && current.y + m[0] < data.length && current.x + m[1] >= 0 && current.x + m[1] < data[0].length) {
                if (data[current.y + m[0]][current.x + m[1]] !== "#") {
                    queue.push({ 
                        node: { y: current.y + m[0], x: current.x + m[1] },
                        distance: item.distance + 1
                    });
                }
            }
        });
    }

    // Calculate the total area of the diamond across all map repeats.
    //  With a diamond of radius=1, there are 4 "points" + the center -> area = 5
    //  With a diamond of radius=2, the entire shape grows by 8       -> area = 13
    //  With a diamond of radius=3, the entire shape grows by 12      -> area = 25
    //  With a diamond of radius=4, the entire shape grows by 16      -> area = 41
    //  Generally, the area can be expressed as: (r + 1)^2 + r^2
    const multiplier = Math.pow(mapRepeats + 1, 2) + Math.pow(mapRepeats, 2);

    // Based on whether the steps & radius are odd or even, the perimeter will have either odd or even parity.
    // That's important because there will be more even or odd destinations. So the formulas are slightly different.
    //
    // The parity of the map changes depending upon how it is repeated. One map will have a majority of odd steps
    // while maps adjacent to it will have a majority of even steps. Thankfully, these values are inverse of each other.
    // The odd steps in a majority even step map equal the even steps in a majority odd step map.
    //
    // Here's a picture showing repeated maps with majority O(odd) or E(even) with a map with an Odd parity in the middle
    //     O
    //   O|E|O
    // O|E|O|E|O
    //   O|E|O
    //     O
    const diamondArea = steps % 2 & mapRepeats % 2 ? 
        Math.pow(mapRepeats + 1, 2) * diamond.evenSteps + Math.pow(mapRepeats, 2) * diamond.oddSteps :
        Math.pow(mapRepeats + 1, 2) * diamond.oddSteps  + Math.pow(mapRepeats, 2) * diamond.evenSteps;
    const cornersArea = ((multiplier - 1) / 2) * (corners.oddSteps + corners.evenSteps);

    return diamondArea + cornersArea;
}

function run(data: string[]): number {
    // return part1(testData, 6);
    // return part1(data, 64); 
    // return part2(testData3, 7);
    return part2(data, 26501365);
}

export default run;