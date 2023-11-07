REPL Minesweeper game for command line time wasting

* Variable board size
* Amount of mines is size - 1
* Try `autog()` automated play if you're feelin' lucky


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
auto()
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

> newgame()

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
