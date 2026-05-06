import { BoardModel, initialBoard } from "./board.model";
import { getCoordsMonitor } from "./coords.model";
import {
  Coords,
  MoveSnapshot,
  checkCoords,
  createCoords,
  nullCoords,
} from "./coords.model";
import { Side } from "./side.model";
import { Status } from "./status.model";

export const initialGameModel = {
  status: Status.playing,
  turn: Side.black,
  jumpingCheckerCoords: nullCoords,
  activeCheckerCoords: nullCoords,
  board: initialBoard,
};

export type GameModel = typeof initialGameModel;

type MoveParams = {
  jumpingCheckerCoords: Coords;
  side: Side;
  board: BoardModel;
};

export function hasSideMoves(params: MoveParams) {
  const { possibleJumps, possibleSlides } = findAllMovesForSide(params);

  return !![...possibleJumps, ...possibleSlides].length;
}

export function findAllMovesForSide(params: MoveParams) {
  const { side, board } = params;
  const possibleJumps = findAllJumpsForSide(params);

  if (possibleJumps?.length) {
    return {
      possibleJumps,
      possibleSlides: [] as MoveSnapshot[],
    };
  }

  return {
    possibleJumps: [] as MoveSnapshot[],
    possibleSlides: findAllSlidesForSide(side, board),
  };
}

function findAllSlidesForSide(side: Side, board: BoardModel) {
  return findAllSideCheckers(side, board).flatMap(
    (coords) => getCoordsMonitor(coords, board)?.findSlides() ?? [],
  );
}

function findAllJumpsForSide({
  jumpingCheckerCoords,
  side,
  board,
}: MoveParams) {
  if (checkCoords(jumpingCheckerCoords).areEquals(nullCoords)) {
    return findAllSideCheckers(side, board).flatMap(
      (coords) => getCoordsMonitor(coords, board)?.findJumps() ?? [],
    );
  }

  return getCoordsMonitor(jumpingCheckerCoords, board)?.findJumps() ?? [];
}

function findAllSideCheckers(side: Side, board: BoardModel) {
  return board
    .flatMap((rank, rankIndex) => {
      return rank.map((_, squareIndex) => {
        return createCoords(rankIndex, squareIndex);
      });
    })
    .filter((coords) => getCoordsMonitor(coords, board)?.isOwnedBy(side));
}
