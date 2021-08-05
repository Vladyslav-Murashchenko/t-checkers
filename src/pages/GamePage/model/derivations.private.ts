import { TurnModel } from ".";
import zip from "../../../utils/zip";
import type { BoardModel, Coords, SquareModel } from "./board.model";
import {
  getSquareByCoords,
  hasChecker,
  hasWhiteChecker,
  isEmptyBlack,
} from "./derivations";

export function is<T extends SquareModel>(standard: T) {
  return (square: SquareModel | null): square is T => square === standard;
}

export const findSimpleMoves = (coords: Coords, board: BoardModel) => {
  const turnOfChecker = getTurnOfChecker(coords, board);

  const deltaY = turnOfChecker === TurnModel.white ? 1 : -1;

  const coordsOfNextBlackSquares: Coords[] = [
    applyMove(vector(-1, deltaY), coords),
    applyMove(vector(1, deltaY), coords),
  ];

  return coordsOfNextBlackSquares.filter((thisCoords) => {
    const thisSquare = getSquareByCoords(thisCoords, board);
    return isEmptyBlack(thisSquare);
  });
};

export const findJumps = (coords: Coords, board: BoardModel): Coords[] => {
  const turnOfChecker = getTurnOfChecker(coords, board);
  const maybeOpponentCoords = findCoordsOnDistance(1, coords);
  const maybeEmptyCoords = findCoordsOnDistance(2, coords);

  const pairs = zip(maybeOpponentCoords, maybeEmptyCoords);

  return pairs
    .filter(([shouldBeOpponent, shouldBeEmpty]) => {
      const opponentSquare = getSquareByCoords(shouldBeOpponent, board);
      const opponentHasChecker = hasChecker(opponentSquare);

      const turnOfOpponent = getTurnOfChecker(shouldBeOpponent, board);

      const isRealyOpponent =
        opponentHasChecker && turnOfOpponent !== turnOfChecker;

      const isRealyEmpty = isEmptyBlack(
        getSquareByCoords(shouldBeEmpty, board),
      );

      return isRealyOpponent && isRealyEmpty;
    })
    .map(([_, emptyCoords]) => emptyCoords);
};

export function applyMove(vectorOfMove: Vector, coords: Coords): Coords {
  const { directionX, directionY, magnitude } = vectorOfMove;
  const deltaX = directionX * magnitude;
  const deltaY = directionY * magnitude;

  const [x, y] = coords;
  return [x + deltaX, y + deltaY];
}

function findCoordsOnDistance(distance: number, coords: Coords) {
  const coordsOnDiagonals: Coords[] = [
    applyMove(vector(-1, -1, distance), coords),
    applyMove(vector(1, -1, distance), coords),
    applyMove(vector(1, 1, distance), coords),
    applyMove(vector(-1, 1, distance), coords),
  ];

  return coordsOnDiagonals;
}

type Vector = {
  directionX: number;
  directionY: number;
  magnitude: number;
};
export function vector(
  directionX: number,
  directionY: number,
  magnitude = 1,
): Vector {
  return {
    directionX,
    directionY,
    magnitude,
  };
}

function getTurnOfChecker(coords: Coords, board: BoardModel) {
  const square = getSquareByCoords(coords, board);

  return hasWhiteChecker(square) ? TurnModel.white : TurnModel.black;
}
