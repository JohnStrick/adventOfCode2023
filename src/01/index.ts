const testData: string[] = [
    "1abc2",
    "pqr3stu8vwx",
    "a1b2c3d4e5f",
    "treb7uchet"
];

const testData2: string[] = [
    "two1nine",
    "eightwothree",
    "abcone2threexyz",
    "xtwone3four",
    "4nineeightseven2",
    "zoneight234",
    "7pqrstsixteen"
]

function containsDigit(s:string, parseDigit:boolean): number {
    if (!isNaN(Number(s[0]))) {
      return Number(s[0]);
    }
  
    if (parseDigit) {
      let digits = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  
      for (let i = 0; i < digits.length; i++) {
        if (s.indexOf(digits[i]) == 0) {
          return i + 1;
        }
      }
    }

    return -1;
  }

function getValue(data: string[], parseDigit: boolean): number {
    let nums = [];
      
    for (let i = 0; i < data.length; i++) {
        let tens: number = -1;
        let ones: number = -1
        let s = data[i];
    
        for (let j = 0; j < s.length; j++) {
            if (tens == -1) {
                tens = containsDigit(s.substring(j), parseDigit);
            }

            if (ones == -1) {
                ones = containsDigit(s.substring(s.length - j - 1), parseDigit);
            }
        }
    
        nums.push(tens * 10 + ones);
        console.log(nums[i]);
    }
  
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
      sum += nums[i];
    }
  
    return sum;
}

function part1(data: string[] = testData): number {
    return getValue(data, false);
}

function part2(data: string[] = testData): number {
    return getValue(data, true);
}

function run(data: string[]): number {
    // return part1();
    // return part1(data); 
    // return part2(testData2);
    return part2(data);
}

export default run;