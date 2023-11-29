REPL Minesweeper game for command line time wasting

* Variable board size
* Amount of mines is size - 1
* Try `autog()` automated play if you're feelin' lucky


Reveal a cell (cells are 1-indexed):
```
go(row, col)
```
Start a new game:
```
newgame(size, difficulty)
// board width & height = size
// defaults to size = 4, difficulty "medium"

type difficulty = "easy" | "medium" | "hard"
```

Try the minesweeper bot 🤖:
```
sweep()
// use a best-guess algorithm for auto select
```
Print:
```
print()
// prints current state of the board
```

Example:
```
~/minesweeper: npm start


-   -   -   -

-   -   -   -

-   -   -   -

-   -   -   -

> check(2,3)

   * /  `
 ~ . BOOM ~ *
   ` * ~

-   -   -   -

-   -   X   -

-   -   -   -

-   -   -   -

> newgame(4)

-   -   -   -

-   -   -   -

-   -   -   -

-   -   -   -

> check(2,3)

-   -   -   -

-   -   2   -

-   -   -   -

-   -   -   -

> check(1,1)

    1   -   -

    1   2   -

1   2   -   -

-   -   -   -


> |

```
