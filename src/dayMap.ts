import runDay1 from "./01";
import runDay9 from "./09";
// import runDay10 from "./10";

type DayMap = {
    [day: string]: (data: string[]) => number,
}

const dayMap: DayMap = {
    "01": runDay1,  
    "09": runDay9,
    // "10": runDay10
}

export default dayMap