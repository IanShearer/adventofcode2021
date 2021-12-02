import * as colors from 'https://deno.land/std/fmt/colors.ts';

type part =  'one' | 'two';

function aoc(p: part, fn: (args: number[]) => number) {
    return function (args: number[]) {
        const start = performance.now();
        const ans: number = fn(args);
        const finish = performance.now();
    
        console.log(`Part ${p}: ${colors.green(ans.toString())}\nTime: ${finish - start}ms`)
    }
}

function partOne(nums: number[]): number {
    let counts = -1;
    let previousNumber = 0;
    for (const n of nums) {
        if (previousNumber < n) {
            counts++;
        }
        previousNumber = n;
    }

    return counts;
}

function partTwo(nums: number[]): number {
    let counts = -1;
    let previousNumber = 0;
    for (let i = 0; i < nums.length - 2; i++) {
        const n = nums[i] + nums[i+1] + nums[i+2];
        if (previousNumber < n) {
            counts++;
        }
        previousNumber = n;
    }

    return counts;
}

async function main() {
    const startTime = performance.now();

    const input = await Deno.readTextFile("./input.txt");
    const nums = input.split("\n").map(n => parseInt(n));

    aoc('one', partOne)(nums);
    aoc('two', partTwo)(nums);

    const finishTime = performance.now();
    console.log(`Total time: ${finishTime - startTime}ms`)
}

main();