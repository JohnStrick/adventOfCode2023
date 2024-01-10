import runDay1 from "./01";
import runDay2 from "./02";
import runDay3 from "./03";
import runDay4 from "./04";
import runDay5 from "./05";
import runDay6 from "./06";
import runDay7 from "./07";
import runDay8 from "./08";
import runDay9 from "./09";
import runDay10 from "./10";
import runDay11 from "./11";
import runDay12 from "./12";
import runDay13 from "./13";
import runDay14 from "./14";

type DayMap = {
    [day: string]: (data: string[]) => number,
}

const dayMap: DayMap = {
    "01": runDay1,
    "02": runDay2,
    "03": runDay3,
    "04": runDay4,
    "05": runDay5,
    "06": runDay6,
    "07": runDay7,
    "08": runDay8,
    "09": runDay9,
    "10": runDay10,
    "11": runDay11,
    "12": runDay12,
    "13": runDay13,
    "14": runDay14
}

export default dayMap