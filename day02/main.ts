import * as colors from 'https://deno.land/std/fmt/colors.ts';

type part =  'one' | 'two';

function aoc(p: part, fn: (args: string[][]) => number) {
    return function (args: string[][]) {
        const start = performance.now();
        const ans: number = fn(args);
        const finish = performance.now();
    
        console.log(`Part ${p}: ${colors.green(ans.toString())}\nTime: ${finish - start}ms`)
    }
}

function partOne(nums: string[][]): number {
    let horizontal = 0;
    let depth = 0;

    for (const command of nums) {
        const c = command[0];
        const n = parseInt(command[1]);

        switch (c) {
            case 'forward':
                horizontal += n;
                break;
            case 'down':
                depth += n;
                break;
            case 'up':
                depth -= n;
                break;
            default:
                break;
        }
    }

    return depth * horizontal;
}

function partTwo(nums: string[][]): number {
    let horizontal = 0;
    let depth = 0;
    let aim = 0;

    for (const command of nums) {
        const c = command[0];
        const n = parseInt(command[1]);

        switch (c) {
            case 'forward':
                horizontal += n;
                depth += aim * n;
                break;
            case 'down':
                aim += n;
                break;
            case 'up':
                aim -= n;
                break;
            default:
                break;
        }
    }

    return depth * horizontal;
}

async function main() {
    const startTime = performance.now();

    const input = await Deno.readTextFile("./input.txt");
    const nums = input.split("\n").map(n => n.split(" "));

    aoc('one', partOne)(nums);
    aoc('two', partTwo)(nums);

    const finishTime = performance.now();
    console.log(`Total time: ${finishTime - startTime}ms`)
}

main();