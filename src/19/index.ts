const testData: string[] = [
    "px{a<2006:qkq,m>2090:A,rfg}",
    "pv{a>1716:R,A}",
    "lnx{m>1548:A,A}",
    "rfg{s<537:gd,x>2440:R,A}",
    "qs{s>3448:A,lnx}",
    "qkq{x<1416:A,crn}",
    "crn{x>2662:A,R}",
    "in{s<1351:px,qqz}",
    "qqz{s>2770:qs,m<1801:hdj,R}",
    "gd{a>3333:R,R}",
    "hdj{m>838:A,pv}",
    "",
    "{x=787,m=2655,a=1222,s=2876}",
    "{x=1679,m=44,a=2067,s=496}",
    "{x=2036,m=264,a=79,s=2244}",
    "{x=2461,m=1339,a=466,s=291}",
    "{x=2127,m=1623,a=2188,s=1013}"
];

type Part = {
    "x": number,
    "m": number,
    "a": number,
    "s": number,
}

enum Operator {
    GreaterThan = 0,
    LessThan
}

enum Result {
    Accepted = "A",
    Rejected = "R"
}

type Condition = {
    att: "x" | "m" | "a" | "s",
    op: Operator,
    val: number,
}

type Rule = {
    condition?: Condition,
    result: Result | string
}

type Workflows = {
    [name: string]: Rule[]
}

function parse(data: string[]) {
    const workflows: Workflows = {};
    const parts: Part[] = [];
    let pos = 0;

    for(; data[pos].length !== 0; pos++) {
        const w = data[pos].split("{")
        const workflowName = w[0];
        const r = w[1].substring(0, w[1].length - 1).split(",");
        const rules = r.map((val): Rule => {
            const getResult = (r: string) => r === "A" ? Result.Accepted : r === "R" ? Result.Rejected : r;
            const getCondition = (c: string) => {
                return {
                    att: c[0] as  "x" | "m" | "a" | "s",
                    op: c[1] === "<" ? Operator.LessThan : Operator.GreaterThan,
                    val: Number(c.substring(2))
                };
            }

            const v = val.split(":");
            if (v.length > 1) {
                return {
                    condition: getCondition(v[0]),
                    result: getResult(v[1])
                }
            } else {
               return {
                    result: getResult(v[0])
               }
            }
        });

        workflows[workflowName] = rules;
    }

    pos++;
    for (; pos < data.length; pos++) {
        const p = data[pos].substring(1, data[pos].length - 1);
        const a = p.split(",");
        parts.push({
            x: Number(a[0].split("=")[1]),
            m: Number(a[1].split("=")[1]),
            a: Number(a[2].split("=")[1]),
            s: Number(a[3].split("=")[1]),
        })
    }

    // console.log("workflows=" + JSON.stringify(workflows));
    // console.log("parts=" + JSON.stringify(parts));

    return {
        workflows,
        parts
    };
}

function part1(data: string[] = testData): number {
    const {
        workflows,
        parts
    } = parse(data);

    const accepted: Part[] = [];

    for(let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const rules = workflows["in"];
        
        const processWorkflow = (rules: Rule[]): void => {
            for (let j = 0; j < rules.length; j++) {
                const condition = rules[j].condition;
                if (condition) {
                    if ((condition.op === Operator.GreaterThan && part[condition.att] <= condition.val) ||
                        condition.op === Operator.LessThan && part[condition.att] >= condition.val) {
                        continue;  // condition not met, process next
                    }
                }

                const result = rules[j].result;
                if (result === Result.Accepted) {
                    accepted.push(part);
                    break;
                } else if (result === Result.Rejected) {
                    break;
                } else {
                    processWorkflow(workflows[result]);
                    break;
                }
            }
        };

        processWorkflow(rules);
    }

    return accepted.reduce((acc, v) => acc + v.x + v.m + v.a + v.s, 0);
}
    
type Range = {
    x: number[],
    m: number[],
    a: number[],
    s: number[]
}

function part2(data: string[] = testData): number {
    const {
        workflows
    } = parse(data);

    function processRules(rules: Rule[], range: Range): number {    
        let a = 0;

        const getCombinations = (r: Range): number => 
            (r.x[1] - r.x[0] + 1) * (r.m[1] - r.m[0] + 1) * (r.a[1] - r.a[0] + 1) * (r.s[1] - r.s[0] + 1);
        const getNewRange = () => {
            return { x: [...range.x], m: [...range.m], a: [...range.a], s: [...range.s] };
        };

        while(rules.length > 0) {
            const rule = rules.shift() as Rule;
            const condition = rule.condition;
            let trueRange = getNewRange();
            let falseRange = getNewRange();

            if (condition) {
                switch (condition.op) {
                    case Operator.GreaterThan:
                        trueRange[condition.att] = [condition.val + 1, trueRange[condition.att][1]];
                        falseRange[condition.att] = [falseRange[condition.att][0], condition.val];
                        break;
                    case Operator.LessThan:
                        trueRange[condition.att] = [trueRange[condition.att][0], condition.val - 1];
                        falseRange[condition.att] = [condition.val, falseRange[condition.att][1]];
                        break;
                }
            }

            const result = rule.result;
            if (result === Result.Accepted) {
                a += getCombinations(trueRange);
            } else if (result !== Result.Rejected) {
                a += processRules(workflows[result], trueRange);
            }

            a += processRules(rules, falseRange);
        }

        return a;
    }

    return processRules(workflows["in"], { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] });
}

function run(data: string[]): number {
    // return part1();
    // return part1(data); 
    // return part2();
    return part2(data);
}

export default run;