import * as colors from 'https://deno.land/std/fmt/colors.ts';

type part =  'one' | 'two';

function aoc(p: part, fn: (args: string[]) => number) {
    return function (args: string[]) {
        const start = performance.now();
        const ans: number = fn(args);
        const finish = performance.now();
    
        console.log(`Part ${p}: ${colors.green(ans.toString())}\nTime: ${finish - start}ms`)
    }
}

function partOne(nums: string[]): number {
    const firstRow = nums[0];
    const bitsPerRow = firstRow.length;
    const zeroBitArray = new Array<number>(bitsPerRow).fill(0);
    const oneBitArray = new Array<number>(bitsPerRow).fill(0);

    for (const row of nums) {
        let pos = 0;
        for (const c of row) {
            c === "1" ? oneBitArray[pos] = oneBitArray[pos] + 1 : zeroBitArray[pos] = zeroBitArray[pos] + 1;
            pos++;
        }
    }

    const gamma = new Array(bitsPerRow);
    const eps = new Array(bitsPerRow);
    const numOfRows = nums.length;
    let pos = 0;
    for (const bit of oneBitArray) {    
        if (bit / numOfRows >= 0.5) {
            gamma[pos] = 1;
            eps[pos] = 0;
        } else {
            gamma[pos] = 0;
            eps[pos] = 1;
        }
        pos++;
    }

    return parseInt(gamma.join(""), 2) * parseInt(eps.join(""), 2);
}

function partTwo(nums: string[]): number {
    const firstRow = nums[0];
    const bitsPerRow = firstRow.length;
    let oxygenArray = [...nums];
    let cotwoArray = [...nums];

    let i = 0;
    while (oxygenArray.length !== 1) {
        let zero = 0;
        let one = 0;

        for (const row of oxygenArray) {
            const bit = row[i%bitsPerRow];
            bit === "1"? one++ : zero++;
        }

        if (one < zero) {
            oxygenArray = oxygenArray.filter((r) => {return r[i%bitsPerRow] !== "1"})
        } else {
            oxygenArray = oxygenArray.filter((r) => {return r[i%bitsPerRow] === "1"})
        }
        i++;
    }

    i = 0;
    while (cotwoArray.length !== 1) {
        let zero = 0;
        let one = 0;

        for (const row of cotwoArray) {
            const bit = row[i%bitsPerRow];
            bit === "1"? one++ : zero++;
        }

        if (one < zero) {
            cotwoArray = cotwoArray.filter((r) => {return r[i%bitsPerRow] === "1"})
        } else {
            cotwoArray = cotwoArray.filter((r) => {return r[i%bitsPerRow] !== "1"})
        }
        i++;
    }

    return parseInt(oxygenArray[0], 2) * parseInt(cotwoArray[0], 2);
}

async function main() {
    const startTime = performance.now();

    const input = await Deno.readTextFile("./input.txt");
    const nums = input.split("\n");

    aoc('one', partOne)(nums);
    aoc('two', partTwo)(nums);

    const finishTime = performance.now();
    console.log(`Total time: ${finishTime - startTime}ms`)
}

main();