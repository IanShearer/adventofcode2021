import * as colors from 'https://deno.land/std/fmt/colors.ts';
// SOME OF THE WORST CODE EVER WRITTEN BUT IT WORKS I GUESS

type part =  'one' | 'two';

function aoc(p: part, fn: (args: number[], aargs: piece[][][]) => number) {
    return function (args: number[], aargs: piece[][][]) {
        const start = performance.now();
        const ans: number = fn(args, aargs);
        const finish = performance.now();
    
        console.log(`Part ${p}: ${colors.green(ans.toString())}\nTime: ${finish - start}ms`)
    }
}

interface piece {
    val: number;
    called: boolean;
}

const checkRow = (b: piece[][], row: number): boolean => {
    for (const col of b[row]) {
        if (!col.called) {
            return false;
        }
    }
    return true;
};

const checkCol = (b: piece[][], col: number): boolean => {
    for (const row of b) {
        if (!row[col].called) {
            return false;
        }
    }
    return true;
};

function partOne(nums: number[], boards: piece[][][]): number {
    const findBoard = (): [piece[][], number] => {
        for (const num of nums) {
            // mark called
            for (const board of boards) {
                for (const row of board) {
                    for (const p of row) {
                        if (p.val === num) {
                            p.called = true;
                        }
                    }
                }
            }

            // check for horizontal and vertical full matches
            for (const board of boards) {
                // check full row
                for (let i = 0; i < board.length; i++) {
                    if (checkRow(board, i)) {
                        return [board, num];
                    }
                }

                for (let i = 0; i < board.length; i++) {
                    if (checkCol(board, i)) {
                        return [board, num];
                    }
                }
            }
        }

        return [boards[0], 0];
    }

    const [b, n] = findBoard();
    // console.log(b, n);
    let sum = 0;
    for (const row of b) {
        for (const p of row) {
            if (!p.called) {
                sum += p.val;
            }
        }
    }

    return sum * n;
}

function partTwo(nums: number[], boards: piece[][][]): number {
    const wonBoards: piece[][][] = [];

    const findBoard = (): [piece[][], number] => {
        for (const num of nums) {
            // mark called
            for (const board of boards) {
                for (const row of board) {
                    for (const p of row) {
                        if (p.val === num) {
                            p.called = true;
                        }
                    }
                }
            }

            // check for horizontal and vertical full matches
            for (const board of boards) {
                // check full row
                for (let i = 0; i < board.length; i++) {
                    if (checkRow(board, i) && !wonBoards.includes(board)) {
                        wonBoards.push(board);
                        if (wonBoards.length === 100) {
                            return [board, num];
                        }
                    }
                }

                for (let i = 0; i < board.length; i++) {
                    if (checkCol(board, i) && !wonBoards.includes(board)) {
                        wonBoards.push(board);
                        if (wonBoards.length === 100) {
                            return [board, num];
                        }
                    }
                }
            }
        }

        return [boards[0], 0];
    }

    const [b, n] = findBoard();
    let sum = 0;
    for (const row of b) {
        for (const p of row) {
            if (!p.called) {
                sum += p.val;
            }
        }
    }

    return sum * n;
}

async function main() {
    const startTime = performance.now();

    const input = await Deno.readTextFile("./input.txt");
    const nums = input.split("\n");

    const callNumbers = nums[0].split(",").map(n => parseInt(n));
    const boards: piece[][][] = [[[]]];

    let boardNumber = -1;
    let weirdthingseen = false;
    for (const row of nums) {
        if (row.length != 14) {
            if (row.length === 0) {
                boardNumber++;
            }
            continue
        }
        if (boards.length != boardNumber) {
            boards.push([]);
        }

        // some hacky bs to remove some array that
        // was pushed in there.
        // idk its midnight and im tired lol
        if (boardNumber === 0 && !weirdthingseen) {
            boards[0] = [];
            weirdthingseen = true;
        }

        boards[boardNumber].
            push(row.
            split(" ").
            filter(c => c.length !== 0).
            map(c => {return{ val: parseInt(c), called: false, }}
        ));
    }

    aoc('one', partOne)(callNumbers, boards);
    aoc('two', partTwo)(callNumbers, boards);

    const finishTime = performance.now();
    console.log(`Total time: ${finishTime - startTime}ms`)
}

main();