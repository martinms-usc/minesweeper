REPL Minesweeper game for command line time wasting

* Variable board size
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
newgame(size, difficulty)
// board width & height = size
// defaults to size = 4, difficulty "medium"
```

Bot play:
```
sweep()
// use a best-guess algorithm for auto select
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
