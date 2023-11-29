REPL Minesweeper game for command line time wasting

* Variable board size & 3 difficulty levels
* Try `sweep()` to see the bot play 🤖
* Difficulty is a proportion of mine cells:

```
easy:    15%
medium:  18%
hard:    20%
```

Reveal a cell (cells are 1-indexed):
```
go(row, col)
```
Start a new game:
```
newgame(size = 4, difficulty = "medium")
```

Bot play:
```
sweep()
```
About the Bot:
* use a process of elimination algorithm to discover mines and find empty cells
* next choose a cell with no revealed neighbors
* if no known empty cells, use a best-guess algorithm


Example:
```
~/minesweeper: npm install
~/minesweeper: npm start

2 mines
┌─────┬─────┬─────┬─────┐
│  -  │  -  │  -  │  -  │
├─────┼─────┼─────┼─────┤
│  -  │  -  │  -  │  -  │
├─────┼─────┼─────┼─────┤
│  -  │  -  │  -  │  -  │
├─────┼─────┼─────┼─────┤
│  -  │  -  │  -  │  -  │
└─────┴─────┴─────┴─────┘

> go(1,1)
┌─────┬─────┬─────┬─────┐
│     │  2  │  -  │  -  │
├─────┼─────┼─────┼─────┤
│     │  2  │  -  │  -  │
├─────┼─────┼─────┼─────┤
│     │  1  │  1  │  1  │
├─────┼─────┼─────┼─────┤
│     │     │     │     │
└─────┴─────┴─────┴─────┘

> go(1,4)
┌─────┬─────┬─────┬─────┐
│     │  2  │  -  │  2  │
├─────┼─────┼─────┼─────┤
│     │  2  │  -  │  -  │
├─────┼─────┼─────┼─────┤
│     │  1  │  1  │  1  │
├─────┼─────┼─────┼─────┤
│     │     │     │     │
└─────┴─────┴─────┴─────┘

> go(2,4)

 !  !  ! VICTORY !  !  !

┌─────┬─────┬─────┬─────┐
│     │  2  │ ⛳️  │  2  │
├─────┼─────┼─────┼─────┤
│     │  2  │ ⛳️  │  2  │
├─────┼─────┼─────┼─────┤
│     │  1  │  1  │  1  │
├─────┼─────┼─────┼─────┤
│     │     │     │     │
└─────┴─────┴─────┴─────┘

> |

```
