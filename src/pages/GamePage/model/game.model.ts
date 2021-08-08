import { getCoordsMonitor } from "./coords.model";
import { BoardData, initialBoardData } from "./board.model";
import {
  checkCoords,
  Coords,
  createCoords,
  MoveSnapshot,
  nullCoords,
} from "./coords.model";
import { Side } from "./side.model";
import { Status } from "./status.model";

export const initialGameModel = {
  status: Status.playing,
  turn: Side.black,
  jumpingCheckerCoords: nullCoords,
  activeCheckerCoords: nullCoords,
  board: initialBoardData,
};

export type GameModel = typeof initialGameModel;

type MovingsParams = {
  jumpingCheckerCoords: Coords;
  side: Side;
  board: BoardData;
};

export function hasSideMovings(params: MovingsParams) {
  const { possibleJumps, possibleMoves } = findAllMovingsForSide(params);

  return !![...possibleJumps, ...possibleMoves].length;
}

export function findAllMovingsForSide(params: MovingsParams) {
  const { side, board } = params;
  const possibleJumps = findAllJumpsForSide(params);

  if (possibleJumps?.length) {
    return {
      possibleJumps,
      possibleMoves: [] as MoveSnapshot[],
    };
  }

  return {
    possibleJumps: [] as MoveSnapshot[],
    possibleMoves: findAllMovesForSide(side, board),
  };
}

function findAllMovesForSide(side: Side, board: BoardData) {
  return findAllSideCheckers(side, board).flatMap(
    (coords) => getCoordsMonitor(coords, board)?.findMoves() ?? [],
  );
}

function findAllJumpsForSide({
  jumpingCheckerCoords,
  side,
  board,
}: MovingsParams) {
  if (checkCoords(jumpingCheckerCoords).areEquals(nullCoords)) {
    return findAllSideCheckers(side, board).flatMap(
      (coords) => getCoordsMonitor(coords, board)?.findJumps() ?? [],
    );
  }

  return getCoordsMonitor(jumpingCheckerCoords, board)?.findJumps() ?? [];
}

function findAllSideCheckers(side: Side, board: BoardData) {
  return board
    .flatMap((rank, rankIndex) => {
      return rank.map((_, squareIndex) => {
        return createCoords(rankIndex, squareIndex);
      });
    })
    .filter((coords) => getCoordsMonitor(coords, board)?.isOwnedBy(side));
}
