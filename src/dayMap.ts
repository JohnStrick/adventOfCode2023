import runDay9 from "./09";
// import runDay10 from "./10";

type DayMap = {
    [day: string]: (data: string[]) => number,
}

const dayMap: DayMap = {
    "09": runDay9,
    // "10": runDay10
}

export default dayMap