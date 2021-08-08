# Guide
There are some not obvious patterns used in this code. This guide can help understand it better.

## Elm Arhitecture
The code of GamePage is not strictly using Elm Architecture, but core idea is the same.

These three concepts are the core of The Elm Architecture:
- Model — the state of your application
- View — a way to turn your state into HTML
- Update — a way to update your state based on messages

Read more here: https://guide.elm-lang.org/architecture/

There are model, view and update folders here with the corresponding goals. 


**Model also can contain some functions to derive another data out of it. All functions inside Model and Update folders are pure. Views are just React components, can use hooks inside as usual.**

## Pure functions returns objects with methods
This approach helps to make implementation more concise and better structured. Also it allows to use `concatenative prototyping` later.
```ts
export const checkSquare = (square: SquareModel) => {
  const is = (standard: SquareModel) => square === standard;

  const self = {
    isWhite: () => is(SquareModel.white),
    isEmptyBlack: () => is(SquareModel.emptyBlack),
    // ...
    hasKing: () => self.hasWhiteKing() || self.hasBlackKing(),
    // ...
  };

  return self;
};
```
Using of such API is also quite convenient. It works the same as [expect from Jest](https://jestjs.io/docs/expect), but is a pure function.
```ts
checkSquare(square).hasWhiteChecker()
checkCoords(coords).toBeIn(possibleJumpTargets)
```

## Concatenative prototyping
Concatenative prototyping used for code reusing
```js
export const getSquareMonitor = (square: SquareModel) => {
  return Object.assign(checkSquare(square), {
    getSide(): Side | null {
      // ...
    },
  });
};
```
In this case `getSquareMonitor` inherits all the methods from checkSquare(square)

More details about it are here
https://en.wikipedia.org/wiki/Prototype-based_programming

## Monitors 
Idea of monitors was enspired by [react dnd monitors](https://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor).
