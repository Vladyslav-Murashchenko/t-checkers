import zip from "utils/zip";
import { BoardData } from "./board.model";
import { Coords, MoveSnapshot } from "./coords.model";
import { getSquareMonitor } from "./square.model";

export const getCoordsMonitor = (coords: Coords, board: BoardData) => {
  const [x, y] = coords;
  const square = board[y]?.[x] ?? null;

  if (!square) {
    return null;
  }

  const squareMonitor = getSquareMonitor(square);

  const self = Object.assign(squareMonitor, {
    findMoves(): MoveSnapshot[] {
      const nextBlackSquares: Coords[] = findCoordsOnDistance(1, coords, board);

      return nextBlackSquares
        .filter((next) => getCoordsMonitor(next, board)?.isEmptyBlack())
        .map(createMoveShapshot(coords));
    },
    findJumps(): MoveSnapshot[] {
      const maybeOpponentCoords = findCoordsOnDistance(1, coords, board);
      const maybeEmptyCoords = findCoordsOnDistance(2, coords, board);

      const pairs = zip(maybeOpponentCoords, maybeEmptyCoords);

      return pairs
        .filter(([shouldBeOpponent, shouldBeEmpty]) => {
          const opponentCoords = getCoordsMonitor(shouldBeOpponent, board);
          const emptyCoords = getCoordsMonitor(shouldBeEmpty, board);

          if (opponentCoords && emptyCoords && opponentCoords.hasChecker()) {
            const hasEmptySquare = emptyCoords.isEmptyBlack();
            const hasOpponentChecker =
              opponentCoords.getTurn() !== self.getTurn();

            return hasOpponentChecker && hasEmptySquare;
          }

          return false;
        })
        .map(([_, emptyCoords]) => emptyCoords)
        .map(createMoveShapshot(coords));
    },
  });

  return self;
};

function getForbiddenDirection(
  coords: Coords,
  board: BoardData,
): "top" | "bottom" | null {
  const coordsOnBoard = getCoordsMonitor(coords, board);

  if (!coordsOnBoard || coordsOnBoard.hasKing()) {
    return null;
  }

  return coordsOnBoard.hasWhiteChecker() ? "top" : "bottom";
}

function findCoordsOnDistance(
  distance: number,
  coords: Coords,
  board: BoardData,
): Coords[] {
  const forbiddenDirection = getForbiddenDirection(coords, board);
  const coordsOnDiagonals: Coords[] = [];

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
): Coords {
  const deltaX = signByDirection[dirX] * distance;
  const deltaY = signByDirection[dirY] * distance;

  const [x, y] = coords;
  return [x + deltaX, y + deltaY];
}

function createMoveShapshot(from: Coords) {
  return (to: Coords): MoveSnapshot => ({
    from,
    to,
  });
}
