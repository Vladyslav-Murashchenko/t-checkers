import { TurnModel } from ".";
import { BoardModel, Coords, CoordsOfMove, SquareModel } from "./board.model";
import {
  applyMove,
  findJumps,
  findSimpleMoves,
  is,
  vector,
} from "./derivations.private";

export const isWhite = is(SquareModel.white);
export const isEmptyBlack = is(SquareModel.emptyBlack);
export const hasWhiteChecker = is(SquareModel.withWhiteChecker);
export const hasBlackChecker = is(SquareModel.withBlackChecker);

export function hasChecker(square: SquareModel | null) {
  return hasWhiteChecker(square) || hasBlackChecker(square);
}

export function hasCheckerByTurn(square: SquareModel, turn: TurnModel) {
  const hasCheckerByTurn = {
    [TurnModel.white]: hasWhiteChecker,
    [TurnModel.black]: hasBlackChecker,
  };

  const hasCheckerOfKnownColor = hasCheckerByTurn[turn];
  return hasCheckerOfKnownColor(square);
}

export function getSquareByCoords(
  coords: Coords,
  board: BoardModel,
): SquareModel | null {
  const [x, y] = coords;

  return board[y]?.[x] ?? null;
}

export function derivePossibleMoveTargets(
  coords: Coords,
  board: BoardModel,
): Coords[] {
  const jumps = findJumps(coords, board);

  if (jumps.length) {
    return jumps;
  }

  return findSimpleMoves(coords, board);
}

export function hasJumps(coords: Coords, board: BoardModel): boolean {
  return !!findJumps(coords, board).length;
}

export function deriveIsPossibleMoveTarget(
  coords: Coords,
  possibleCoords: Coords[],
): boolean {
  return possibleCoords.some((possible) => {
    return isEqualCoords(possible, coords);
  });
}

export function deriveCoordsOfCaptured({ from, to }: CoordsOfMove): Coords {
  const [toX, toY] = to;
  const [fromX, fromY] = from;
  const deltaX = toX - fromX;
  const deltaY = toY - fromY;

  const backDirectionX = -Math.sign(deltaX);
  const backDirectionY = -Math.sign(deltaY);

  return applyMove(vector(backDirectionX, backDirectionY), to);
}

export function isEqualCoords(coords: Coords, anotherCoords: Coords) {
  const [x, y] = coords;
  const [x1, y1] = anotherCoords;

  return x === x1 && y === y1;
}

export function deriveTurnOfComputerAI(turnOfPlayer: TurnModel): TurnModel {
  const turnOfComputerByTurnOfPlayer = {
    [TurnModel.black]: TurnModel.white,
    [TurnModel.white]: TurnModel.black,
  };

  return turnOfComputerByTurnOfPlayer[turnOfPlayer];
}

export function findAllPossibleMoves(
  turn: TurnModel,
  board: BoardModel,
): CoordsOfMove[] {
  return board
    .flatMap((rank, rankIndex) => {
      return rank.map((_, squareIndex) => [rankIndex, squareIndex] as Coords);
    })
    .filter(([x, y]) => hasCheckerByTurn(board[y][x], turn))
    .flatMap((from) => {
      return derivePossibleMoveTargets(from, board).map((to) => ({
        from,
        to,
      }));
    });
}
