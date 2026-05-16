import zip from "../../../utils/zip";
import { BoardModel } from "./board.model";
import { SquareMonitor } from "./square.model";

type Coord = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Coords<X = Coord, Y = Coord> = [X, Y] & { __brand: "Coords" };

export const tryCreateCoords = (x: number, y: number): Coords | null => {
  if (x < 0 || x > 7 || y < 0 || y > 7) {
    return null;
  }

  return [x, y] as Coords;
};

export const checkCoords = (coords: Coords) => ({
  areEquals: (anotherCoords: Coords) => {
    const [x, y] = coords;
    const [x1, y1] = anotherCoords;

    return x === x1 && y === y1;
  },
  toBeIn: (list: Coords[]) => {
    return list.some(checkCoords(coords).areEquals);
  },
});

export type MoveSnapshot = {
  from: Coords;
  to: Coords;
};

export const CoordsMonitor = (coords: Coords, board: BoardModel) => {
  const [x, y] = coords;

  const square = board[y][x];

  const self = {
    ...SquareMonitor(square),
    findSlides(): MoveSnapshot[] {
      const nextBlackSquares = findCoordsOnDistance(1);

      return nextBlackSquares
        .filter((next): next is Coords => next !== null)
        .filter((next) => CoordsMonitor(next, board).isEmptyBlack())
        .map(createMoveSnapshot(coords));
    },
    findJumps(): MoveSnapshot[] {
      const maybeOpponentCoords = findCoordsOnDistance(1);
      const maybeEmptyCoords = findCoordsOnDistance(2);

      const pairs = zip(maybeOpponentCoords, maybeEmptyCoords);

      return pairs
        .filter(([shouldBeOpponent, shouldBeEmpty]) => {
          if (!shouldBeOpponent || !shouldBeEmpty) {
            return false;
          }

          const opponentCoords = CoordsMonitor(shouldBeOpponent, board);
          const emptyCoords = CoordsMonitor(shouldBeEmpty, board);

          const hasEmptySquare = emptyCoords.isEmptyBlack();
          const hasOpponentChecker =
            opponentCoords.hasChecker() &&
            opponentCoords.getSide() !== self.getSide();

          return hasOpponentChecker && hasEmptySquare;
        })
        .map(([, emptyCoords]) => emptyCoords)
        .filter((targetCoords): targetCoords is Coords => targetCoords !== null)
        .map(createMoveSnapshot(coords));
    },
  };

  return self;

  function findCoordsOnDistance(distance: number): (Coords | null)[] {
    const forbiddenDirection = getForbiddenDirection();
    const coordsOnDiagonals: (Coords | null)[] = [];

    if (forbiddenDirection !== "top") {
      coordsOnDiagonals.push(
        move(coords, "top", "right", distance),
        move(coords, "top", "left", distance),
      );
    }

    if (forbiddenDirection !== "bottom") {
      coordsOnDiagonals.push(
        move(coords, "bottom", "right", distance),
        move(coords, "bottom", "left", distance),
      );
    }

    return coordsOnDiagonals;
  }

  function getForbiddenDirection(): "top" | "bottom" | null {
    if (self.hasKing()) {
      return null;
    }

    return self.hasWhiteChecker() ? "top" : "bottom";
  }
};

const signByDirection = {
  top: -1,
  left: -1,
  right: 1,
  bottom: 1,
};

type Direction = keyof typeof signByDirection;

function move(
  coords: Coords,
  dirY: Direction,
  dirX: Direction,
  distance: number,
): Coords | null {
  const deltaX = signByDirection[dirX] * distance;
  const deltaY = signByDirection[dirY] * distance;

  const [x, y] = coords;

  return tryCreateCoords(x + deltaX, y + deltaY);
}

function createMoveSnapshot(from: Coords) {
  return (to: Coords): MoveSnapshot => ({
    from,
    to,
  });
}
