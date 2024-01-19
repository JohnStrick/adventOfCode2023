import { lcmAll } from "../utils";
import { FlipFlopState, Modules, ModuleType, PulseType, QueueItem } from "./types";

const testData: string[] = [
    "broadcaster -> a, b, c",
    "%a -> b",
    "%b -> c",
    "%c -> inv",
    "&inv -> a"
];

const testData2: string[] = [
    "broadcaster -> a",
    "%a -> inv, con",
    "&inv -> b",
    "%b -> con",
    "&con -> output"
]

function parse(data: string[]) {
    let modules: Modules = {};

    const getName = (n: string) => n !== "broadcaster" ? n.substring(1) : n;

    for (let i = 0; i < data.length; i++) {
        const c = data[i].split("->")[0].trim();
        const t = c[0];
        const name = getName(c);

        if (name === "broadcaster") {
            modules[name] = { type: ModuleType.Broadcast, dest: []};
        } else if (t === "%") {
            modules[name] = { type: ModuleType.FlipFlop, dest: [], state: FlipFlopState.Off };
        } else if (t === "&") {
            modules[name] = { type: ModuleType.Conjunction, dest: [], mem: {} }
        } else {
            throw "Invalid module:" + name;
        }
    }

    for (let i = 0; i < data.length; i++) {
        const c = data[i].split("->").map(v => v.trim());
        const name = getName(c[0]);
        const links = c[1].split(",").map(v => v.trim());

        links.forEach((m) => {
            let module = modules[name];
            module.dest.push(m);

            let destModel = modules[m];
            if (destModel?.type === ModuleType.Conjunction) {
                destModel.mem[name] = PulseType.Low;
            }
        });
    }

    return modules;
 }

function part1(data: string[] = testData): number {
    const modules = parse(data);
    let lowPulses = 0, highPulses = 0;

    for (let b = 0; b < 1000; b++) {
        const queue: QueueItem[] = [{ mod: "broadcaster", type: PulseType.Low, from: "button"}];
        
        while (queue.length > 0) {
            let current = queue.shift() as QueueItem;
            let module = modules[current.mod];
            let outputPulse: PulseType | undefined = undefined;

            current.type === PulseType.Low ? lowPulses++ : highPulses++;

            if (module?.type === ModuleType.FlipFlop) {
                switch (module.state) {
                    case FlipFlopState.On:
                        if (current.type === PulseType.Low) {
                            outputPulse = PulseType.Low;
                            module.state = FlipFlopState.Off;
                        }
                        break;
                    case FlipFlopState.Off:
                        if (current.type === PulseType.Low) {
                            outputPulse = PulseType.High
                            module.state = FlipFlopState.On;
                        }
                        break;
                }
            } else if (module?.type === ModuleType.Conjunction) {
                module.mem[current.from] = current.type;
                const allHighInMem = Object.values(module.mem).reduce((acc, p) => acc && p === PulseType.High, true);
                outputPulse = allHighInMem ? PulseType.Low : PulseType.High;
            } else if (module?.type === ModuleType.Broadcast) {
                outputPulse = current.type;
            }

            if (outputPulse !== undefined) {
                for (let i = 0; i < module.dest.length; i++) {
                    queue.push({mod: module.dest[i], type: outputPulse, from:current.mod});
                }
            }
        }
    }

    return lowPulses * highPulses;
}

function part2(data: string[] = testData): number {
    const modules = parse(data);

    let b = 0;
    let presses = [];
    while(presses.length < 4) {
        b++;
        let lowPulses = 0, highPulses = 0;

        let queue: QueueItem[] = [{ mod: "broadcaster", type: PulseType.Low, from: "button"}];
        while (queue.length > 0) {
            let current = queue.shift() as QueueItem;
            let module = modules[current.mod];
            let outputPulse: PulseType | undefined = undefined;

            // NAND gate before "rx" module
            if (current.mod === "ql") {
                current.type === PulseType.Low ? lowPulses++ : highPulses++;
            }

            if (module?.type === ModuleType.FlipFlop) {
                switch (module.state) {
                    case FlipFlopState.On:
                        if (current.type === PulseType.Low) {
                            outputPulse = PulseType.Low;
                            module.state = FlipFlopState.Off;
                        }
                        break;
                    case FlipFlopState.Off:
                        if (current.type === PulseType.Low) {
                            outputPulse = PulseType.High;
                            module.state = FlipFlopState.On;
                        }
                        break;
                }
            } else if (module?.type === ModuleType.Conjunction) {
                module.mem[current.from] = current.type;
                const allHighInMem = Object.values(module.mem).reduce((acc, p) => acc && p === PulseType.High, true);
                outputPulse = allHighInMem ? PulseType.Low : PulseType.High;
            } else if (module?.type === ModuleType.Broadcast) {
                outputPulse = current.type;
            }

            if (outputPulse !== undefined) {
                for (let i = 0; i < module.dest.length; i++) {
                    queue.push({mod: module.dest[i], type: outputPulse, from:current.mod});
                }
            }
        }

        if (lowPulses !== 0 && highPulses !== 0) {
            presses.push(b);
        }
    }

    return lcmAll(presses);
}

function run(data: string[]): number {
    // return part1();
    // return part1(data); 
    // return part2(testData2);
    return part2(data);
}

export default run;