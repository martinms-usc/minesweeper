REPL Minesweeper game for command line time wasting

* Variable board size
* Amount of mines is size - 1
* Use `autoguess()` if you're feelin' lucky


Reveal a cell:
```
guess(row, col)
```
Start a new game:
```
newgame(size)
// board width & height = size
// defaults to size = 4
```
Auto play:
```
autoguess()
// random guess from remaining cells
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

> guess(2,3)

   * /  `
 ~ . BOOM ~ *
   ` * ~

-   -   -   -

-   -   X   -

-   -   -   -

-   -   -   -

> newgame()

-   -   -   -

-   -   -   -

-   -   -   -

-   -   -   -

> guess(2,3)

-   -   -   -

-   -   2   -

-   -   -   -

-   -   -   -

> guess(1,1)

    1   -   -

    1   2   -

1   2   -   -

-   -   -   -


> |

```
