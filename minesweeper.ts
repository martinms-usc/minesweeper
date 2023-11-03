type Board = (number|string)[][];
type Cell = [number, number];
const MINE = 'X';

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
            new Array(width).fill('-')
        ));
        this.win = false;
    }
    
    autoGuess() {
        let remainingCells: Cell[] = [];
        const nextGuess = (): Cell => {
            remainingCells = this.getRemainingGuesses();
            const randomIndex = Math.floor(Math.random() * remainingCells.length);
            return remainingCells[randomIndex];
        };
        
        let guess = nextGuess();
        console.log(`guess: row ${guess[0]} col ${guess[1]}\n`);
        let result = m.reveal(...guess);

        while (typeof result !== 'string') {
            this.print();
            guess = nextGuess();
            console.log(`guess: row ${guess[0]} col ${guess[1]}, ${remainingCells.length} remaining\n`);
            result = m.reveal(...guess);
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

        return this.markNumbers(mineLocations, board);;
    }
    
    markNumbers(mines: Cell[], board: (string|null)[][]): Board {
        return board.map((row, cellRow) => {
            return row.map((val: string | null, cellColumn: number) => {
                if (val === MINE) return MINE;
                const bordered = mines.filter(([mineRow, mineColumn]) => { 
                    const borderX = Math.abs(cellRow - mineRow) <= 1;
                    const borderY = Math.abs(cellColumn - mineColumn) <= 1;
                    return borderX && borderY;
                }) || [];
                return bordered.length === 0 ? ' ' : bordered.length;
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
        const board = this.win ? this.board : this.visible;
        let s = `${prepend}`;
        board.forEach(row => {
            s += `${row.join('   ')}\n\n`;
        });
        console.log(s);
    }
    
    reveal(rowInput: number, colInput: number): Board | 'WIN' | 'LOSE' {
        const row = rowInput -1;
        const col = colInput -1;

        if (this.visible[row][col] === '-') {
            const val = this.board[row][col];
            if (val === MINE) {
                this.visible[row][col] = val;
                console.log('\x1b[31m\n   * /  `\n ~ . BOOM ~ * \n   ` * ~ \n\x1b[0m');
                return 'LOSE';
            }
            this.visible[row][col] = val;
            
            if (val === 0) {
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
            console.log('\x1b[32m\n\n !  !  ! VICTORY !  !  ! \n\n');
            this.win = true;
            return 'WIN';
        }
        return this.visible;
    }
    
    checkIfDone() {
        return this.visible.every((row, rowI) => row.every((cell, colI) => 
                typeof cell === 'number' || 
                typeof cell === 'string' && this.board[rowI][colI] == 'X'
            )
        );
    }
    
    getRemainingGuesses(): Cell[] {
        const cells: Cell[] = [];
        
        this.visible.forEach((row, rowI) => {
            row.forEach((val, col) => {
                if (val === '-') {
                    cells.push([rowI+1, col+1]);
                }
            })
        })
        return cells;
    }
    
    getNeighboringCells(row: number, column: number): Cell[] {
        const neighbors: Cell[] = [];

        for (let r = row-1; r <= row+1; r++) {
            if (r < 0 || r >= this.height) continue;
            
            for (let c = column -1; c <= column +1; c++) {
                if (r == row && c == this.width) continue;
                if (c > this.width) continue;
                
                const cell: Cell = [r, c];
                if (c >= 0 && r >= 0 && !(r == row && c == column)) {
                    neighbors.push(cell);
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

function autoguess () {
    return m.autoGuess();
}

function newgame(n: number = 4) {
    m = new Minesweeper(n,n,n-1);
    m.print();
}

function print() {
    m.print();
}


// TODO: 
// minesweeper in constant time

// data structure
// constructor(size)

// obscured [...descriptors]
// revealed [...]
    // cell descriptor = row:col
// cells {
//   descriptor: state
// }

// state
//  hidden
//  value: whitespace, number, or X (string|number)

// on reveal, update cell state, filter from obscured, push revealed,

// check val
// check done

// print

// build board for display on print
// array(size).fill()
