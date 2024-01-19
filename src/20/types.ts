export enum ModuleType {
    Broadcast,
    FlipFlop,
    Conjunction
}

export enum PulseType {
    Low = 0,
    High
}

export enum FlipFlopState {
    Off = 0,
    On
}

type FlipFlopModule = {
    type: ModuleType.FlipFlop,
    dest: string[],
    state: FlipFlopState
}

type ConjunctionModule = {
    type: ModuleType.Conjunction,
    dest: string[],
    mem: {
        [name: string]: PulseType 
    }
}

type BroadcastModule = {
    type: ModuleType.Broadcast,
    dest: string[]
}

export type Module = FlipFlopModule | ConjunctionModule | BroadcastModule;

export type Modules = {
    [name: string]: Module;
}

export type QueueItem = {
    mod: string,
    type: PulseType,
    from: string
};