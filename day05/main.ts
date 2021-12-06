import * as colors from 'https://deno.land/std/fmt/colors.ts';

type part =  'one' | 'two';

function aoc(p: part, fn: (args: vector[]) => number) {
    return function (args: vector[]) {
        const start = performance.now();
        const ans: number = fn(args);
        const finish = performance.now();
    
        console.log(`Part ${p}: ${colors.green(ans.toString())}\nTime: ${finish - start}ms`)
    }
}

declare interface vector {
    from: coordinate;
    to: coordinate;
}

declare interface coordinate {
    x: number;
    y: number;
    hits: number;
}

type grid = number[][];
let g: grid;

function makeGrid(n: number): grid {
    const grid: grid = new Array(n);
    for (let i = 0; i < n; i++) {
        grid[i] = new Array(n).fill(0);
    }
    return grid;
}

// Bresenham's_line_algorithm
// https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
function lowLine(xZero: number, yZero: number, xOne: number, yOne: number) {
    const dx = xOne - xZero;
    let dy = yOne - yZero;
    let yi = 1;
    if (dy < 0) {
        yi = -1;
        dy = -dy;
    }
    let d = (2 * dy) - dx;
    let y = yZero;

    for (let x = xZero; x <= xOne; x++) {
        g[y][x] += 1;
        if (d > 0) {
            y = y + yi;
            d = d + (2 * (dy - dx));
        } else {
            d = d + (2 * dy);
        }
    }
}

function highLine(xZero: number, yZero: number, xOne: number, yOne: number) {
    let dx = xOne - xZero;
    const dy = yOne - yZero;
    let xi = 1;
    if (dx < 0) {
        xi = -1;
        dx = -dx;
    }
    let d = (2 * dx) - dy;
    let x = xZero;

    for (let y = yZero; y <= yOne; y++) {
        g[y][x] += 1;
        if (d > 0) {
            x = x + xi;
            d = d + (2 * (dx - dy));
        } else {
            d = d + (2 * dx);
        }
    }
}

function fillLine(xZero: number, yZero: number, xOne: number, yOne: number) {
    if (Math.abs(yOne - yZero) < Math.abs(xOne - xZero)) {
        if (xZero > xOne) {
            lowLine(xOne, yOne, xZero, yZero);
        } else {
            lowLine(xZero, yZero, xOne, yOne);
        }            
    } else {
        if (yZero > yOne) {
            highLine(xOne, yOne, xZero, yZero);
        } else {
            highLine(xZero, yZero, xOne, yOne);
        }           
    }
}

function partOne(vectors: vector[]): number {
    // x y grid of 1000 spaces each dimension
    g = makeGrid(1000);

    for (const v of vectors) {
        // we are ingoring not fully horizontal and vertical lines
        if (v.from.x !== v.to.x && v.from.y !== v.to.y) {
            continue;
        }

        fillLine(v.from.x, v.from.y, v.to.x, v.to.y);
    }

    let multipleHits = 0;
    for (const row of g) {
        for (const col of row) {
            if (col > 1) {
                multipleHits++;
            }
        }
    }

    return multipleHits;
}

function partTwo(vectors: vector[]): number {
    // x y grid of 1000 spaces each dimension
    g = makeGrid(1000);

    for (const v of vectors) {
        fillLine(v.from.x, v.from.y, v.to.x, v.to.y);
    }

    let multipleHits = 0;
    for (const row of g) {
        for (const col of row) {
            if (col > 1) {
                multipleHits++;
            }
        }
    }

    return multipleHits;
}

async function main() {
    const startTime = performance.now();

    const input = await Deno.readTextFile("./input.txt");
    const nums: vector[] = input.split("\n").map(n => {
        const v = n.split("->");
        const from = v[0].trim().split(",");
        const to = v[1].trim().split(",");

        return {
            from: {
                x: parseInt(from[0]),
                y: parseInt(from[1]),
                hits: 0,
            },
            to: {
                x: parseInt(to[0]),
                y: parseInt(to[1]),
                hits: 0,
            }
        };
    });

    aoc('one', partOne)(nums);
    aoc('two', partTwo)(nums);

    const finishTime = performance.now();
    console.log(`Total time: ${finishTime - startTime}ms`)
}

main();