'use strict';
const Table = require('cli-table');

type CellValue = string|number;
type Board = CellValue[][];
type Cell = [number, number];
const MINE = '💥';
const EMPTY = ' ';
const DEFUSED = '💣';
const OBSCURED = '-';

class Minesweeper {
    board: Board;
    visible: Board;
    height: number;
    width: number;
    win: boolean;

    constructor (height: number, width: number, mines: number) {
        this.height = height;
        this.width = width;
        this.board = this.buildBoard(height, width, mines);
        this.visible = new Array(height).fill(null).map(r => (
            new Array(width).fill(OBSCURED)
        ));
        this.win = false;
    }

    // 🤖
    autoPlay() {
        const knownMines: Cell[] = [];
        let remainingCells: Cell[] = this.getRemainingObscuredCells();
        // find number cells with obscured neighbor count == current cell value, filter
        // infer empty cell if all neighboring mines are filtered, return cell
        const findMinesReturnEmptyCell = (): Cell|void => {
            const numbered = this.getNumberCells();
            remainingCells = this.getRemainingObscuredCells();
            let next: Cell | null = null;
            for (const [cellR, cellC] of numbered)  {
                const numberValue = this.visible[cellR][cellC];
                let neighboringGuesses = this.getNeighboringCells(cellR, cellC, OBSCURED);

                if (neighboringGuesses.length === numberValue) {
                    neighboringGuesses.forEach(([mineRow, mineCol]) => {
                        const alreadyFound = !!knownMines.find(([r,c]) =>  r === mineRow && c === mineCol);
                        if (!alreadyFound) {
                            knownMines.push([mineRow,mineCol]);
                        }
                    });
                }
                // filter remaining by mine locations and check again for known empty cells
                const beforeFilter = neighboringGuesses.length;
                neighboringGuesses = neighboringGuesses.filter(matchKnownMines);
                const afterFilter = neighboringGuesses.length;
                // if all neighboring mines are known, return any other obscured neighbors
                if (neighboringGuesses.length && beforeFilter - afterFilter == numberValue) {
                    const [first] = neighboringGuesses;
                    next = first;
                }
            }
            remainingCells = remainingCells.filter(matchKnownMines);
            if (next) return next;
        };
        const matchKnownMines = ([row, column]: Cell) => !knownMines.find(([mR, mC]) => (mR == row && mC == column));

        const getNextBestGuess = (): Cell => {
            const emptyCell = findMinesReturnEmptyCell();
            if (emptyCell) {
                return emptyCell;
            }
            // rank by cell neighboring sum &  zScore (sum / obscured neighbors)
            // zScore is a crude approximation of the relative likelihood that this cell is a mine
            const remainingCellDetails = remainingCells.map(([r, c]) => {
                const borderSum = this.getNeighboringSum(r, c);
                const remainingNeighborCells = this.getNeighboringCells(r, c, OBSCURED).filter(matchKnownMines);
                const zScore = remainingNeighborCells.length ? borderSum / remainingNeighborCells.length : Infinity;
                const neighborDelta = remainingNeighborCells.length - this.getNeighboringCells(r,c, 'number').length;
                return {
                    location: [r, c] as [number, number],
                    borderSum,
                    zScore,
                    moreNeighborsThanMines: neighborDelta > 0
                };
            })
            // find lowest neighboring sums
            const lowestSum = remainingCellDetails.reduce((min: null | number, cell) => {
                if (typeof min !== 'number' || cell.borderSum < min) {
                    min = cell.borderSum;
                }
                return min;
            }, null);
            // choose random free square if any
            if (lowestSum == 0) {
                const noNeighboringMines = remainingCellDetails.filter(cell => cell.borderSum === lowestSum);
                return noNeighboringMines[Math.floor(Math.random() * noNeighboringMines.length)].location;
            }
            // if any have more obscured neighbors than numbered
            const higherConfidence = remainingCellDetails.find(c => c.moreNeighborsThanMines);
            if (higherConfidence)
                return higherConfidence.location;
            // return lowest bordersum or zScore
            return remainingCellDetails.sort((a, b) => {
                if (a.borderSum < b.borderSum) return -1;
                if (a.borderSum == b.borderSum) {
                    if (a.zScore < b.zScore) return -1;
                    return 1;
                }
                return 1;
            })[0].location;
        };
        
        let result;
        while (typeof result !== 'string') {
            const guessZeroIndexed = getNextBestGuess();
            const guess = guessZeroIndexed.map(v => ++v);
            const oneIndexed = knownMines.map(([r,c]) => ([++r, ++c]));
            const minesFound = knownMines.length;
            const mines = minesFound > 0 ?
                `,\x1b[35m ${minesFound} mine${minesFound > 1 ? 's' : ''} found\n${oneIndexed.join(' ')}` :
                '';
            console.log(`${remainingCells.length} remaining${mines}`);
            console.log('\x1b[37mreveal:', guess);

            result = m.reveal(guess[0], guess[1]);
            if (typeof result !== 'string')
                this.print();
        }
        if (typeof result == 'string') {
            if (result === 'LOSE')
                this.print('\x1b[31m');
            if (result === 'WIN')
                this.print('\x1b[32m');
        }
    }
    
    buildBoard(height: number, width: number, mines: number): Board {
        const mineLocations = this.getRandomCells(height, width, mines);
        const board = new Array(height).fill(null).map(r => (
            new Array(width).fill(null)
        ));        

        mineLocations.forEach(([row, column]: [number, number]) => {
            board[row].splice(column, 1, MINE);
        });

        return this.fillMineCounts(mineLocations, board);;
    }
    
    fillMineCounts(mines: Cell[], board: Board): Board {
        return board.map((row, cellRow) => {
            return row.map((val: CellValue, cellColumn: number) => {
                if (val === MINE) return MINE;
                const bordered = mines.filter(([mineRow, mineColumn]) => { 
                    const borderX = Math.abs(cellRow - mineRow) <= 1;
                    const borderY = Math.abs(cellColumn - mineColumn) <= 1;
                    return borderX && borderY;
                }) || [];
                return bordered.length === 0 ? EMPTY : bordered.length;
            });
        });
    }
    
    check(r: number, i: number) {
        if (r > this.height || i > this.width) {
            console.log('\x1b[31mOUT OF BOUNDS');
            return;
        }
        
        let result = this.reveal(r,i);
        if (result === 'LOSE') {
            this.print('\x1b[31m');
        } else {
            this.print();
        }
    }
    
    print(prepend: string = '') {
        let output = `${prepend}`;
        const board = this.win ? this.board : this.visible;
        const gridRows = board.map(row => {
            return row.map((c) => {
                if (this.win && c == MINE) return DEFUSED;
                return c.toString();
            });
        });
        var table = new Table({
            colWidths: new Array(this.width).fill(5),
            rows: gridRows,
            colAligns: new Array(this.width).fill('middle')
        });
        output += table.toString();
        console.log(output + '\n');
    }
    
    reveal(rowInput: number, colInput: number): Board | 'WIN' | 'LOSE' {
        const row = rowInput -1;
        const col = colInput -1;

        if (this.visible[row][col] === OBSCURED) {
            const val = this.board[row][col];
            if (val === MINE) {
                this.visible[row][col] = val;
                console.log('\x1b[31m\n   * /  `\n ~ . BOOM ~ * \n   ` * ~ \n');
                return 'LOSE';
            }
            this.visible[row][col] = val;
            
            if (val === EMPTY) {
                const neighboring = this.getNeighboringCells(row,col);
                neighboring.forEach((([a, b]: Cell) => {
                    this.reveal(a+1, b+1)
                }).bind(this));
            }
        }
        if (this.visible[row][col] == MINE) {
            this.print('\x1b[31m YOU LOSE ');
        }

        if (this.checkIfDone()) {
            console.log('\x1b[32m\n !  !  ! VICTORY !  !  ! \n');
            this.win = true;
            return 'WIN';
        }
        return this.visible;
    }
    
    checkIfDone() {
        return this.visible.every((row, rowI) => row.every((cell, colI) => 
                typeof cell === 'number' || 
                typeof cell === 'string' && (
                    cell == EMPTY ||
                    this.board[rowI][colI] == MINE
                )
            )
        );
    }
    
    getCells(cellMatchCb: (v: CellValue) => boolean) {
        const cells: Cell[] = [];

        this.visible.forEach((row, rowI) => {
            row.forEach((val, col) => {
                if (cellMatchCb(val)) {
                    cells.push([rowI, col]);
                }
            });
        });
        return cells;
    }

    getRemainingObscuredCells(): Cell[] {
        return this.getCells((v: CellValue) => v === OBSCURED);
    }

    getNumberCells(): Cell[] {
        return this.getCells((v: CellValue) => typeof v == 'number');
    }

    getNeighboringSum(row: number, column: number): number {
        const cells = this.getNeighboringCells(row, column);
        return cells.reduce((t, [r, c]) => {
            const val = this.visible[r][c];
            if (typeof val == 'number') {
                t += val;
            }
            return t;
        }, 0);
    }

    getNeighboringCells(row: number, column: number, valueMatch?: CellValue): Cell[] {
        const neighbors: Cell[] = [];

        for (let r = row -1; r <= row +1; r ++) {
            if (r < 0 || r >= this.height) continue;
            
            for (let c = column -1; c <= column +1; c++) {
                if (r == row && c == this.width) continue;
                if (c > this.width) continue;
                
                if (c >= 0 && r >= 0 && !(r == row && c == column)) {
                    const v = this.visible[r][c];
                    if (!valueMatch || (valueMatch && v == valueMatch)) {
                        neighbors.push([r, c]);
                    }
                }
            }
        }
        return neighbors;
    }
    
    getRandomCells(height: number, width: number, amount: number): Cell[] {
        const cells: Cell[] = [];
        
        while (cells.length < amount) {
            const row = Math.floor(Math.random() * height);
            const col = Math.floor(Math.random() * width);
            const exists = cells.findIndex((cell: [number, number]) => (
                cell[0] === row && cell[1] == col
            )) > -1;
            if (!exists) {
                cells.push([row, col]);
            }
        }
        return cells;
    }
}

let m = new Minesweeper(4, 4, 3);
m.print();

function check (r: number, c: number) {
    return m.check(r,c);
}

function auto () {
    return m.autoPlay();
}

function newgame(n: number = 4) {
    // const mines = Math.floor((n) * Math.log(n-1));
    // console.log('mines', mines)
    m = new Minesweeper(n,n,n-1);
    m.print();
}

function print() {
    m.print();
}


// TODO: minesweeper in linear time

// unifying data structure instead of 2x 2-dimensional arrays
// constructor(size)

// obscured [...descriptors]
// revealed [...descriptors]
// cells {
//   descriptor: state
// }

// cell descriptor = row:col

// state
//  hidden
//  value: whitespace, number, or X (string|number)

// on reveal, update cell state, filter from obscured, push revealed,

// check val
// check done
// obscured.length vs mines count

// build board for display on print
// new Array(size).fill * new array(size).fill
// map both collections and add value to output

