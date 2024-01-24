import * as fs from "fs/promises";
import * as fsSync from "fs";
import dayMap from "./dayMap";

async function readInput(path: string) {
    const data = await fs.readFile(path, { encoding: "utf8" });
    const lines = data.split(/\r?\n/);
    return lines;
}

async function init() {
    const args = process.argv.slice(2);
    const day = args[0];
    const fileName = args[1] || "data.txt";

    if (!day) {
        console.warn("Must supply a day as the first argument. Example '01'.");
        return;
    }

    const dirName = "./src/" + day;

    // create new day directory with code template if it doesn't exist yet
    if (!fsSync.existsSync(dirName)) {
        await fs.mkdir(dirName);
        await fs.copyFile("./src/dayTemplate.ts", dirName + "/index.ts");
        await fs.writeFile(dirName + "/" + "data.txt", "");
    }

    const data = await readInput("./src/" + day + "/" + fileName);
    const func = dayMap[day];

    const startTime = performance.now();
    console.log("Answer=" + func(data));
    const endTime = performance.now();

    console.log("");
    console.log("Executed in:" + ((endTime - startTime) / 1000).toPrecision(3) + " seconds");

    const used: NodeJS.MemoryUsage = process.memoryUsage();
    for (const [key, value] of Object.entries(used)) {
        console.log(`Memory: ${key} ${Math.round((value / 1024 / 1024) * 100) / 100} MB`);
    }
}

init();
