import { getCoordsMonitor } from "./coords.model";
import { BoardData, initialBoardData } from "./board.model";
import {
  checkCoords,
  Coords,
  createCoords,
  MoveSnapshot,
  nullCoords,
} from "./coords.model";
import { Turn } from "./turn.model";
import { Status } from "./status.model";

export const initialGameModel = {
  status: Status.playing,
  turn: Turn.black,
  jumpingCheckerCoords: nullCoords,
  activeCheckerCoords: nullCoords,
  board: initialBoardData,
};

export type GameModel = typeof initialGameModel;

type MovingsParams = {
  jumpingCheckerCoords: Coords;
  turn: Turn;
  board: BoardData;
};

export function findAllPossibleMovingsForTurn(params: MovingsParams) {
  const { turn, board } = params;
  const possibleJumps = findAllPossibleJumpsForTurn(params);

  if (possibleJumps?.length) {
    return {
      possibleJumps,
      possibleMoves: [] as MoveSnapshot[],
    };
  }

  return {
    possibleJumps: [] as MoveSnapshot[],
    possibleMoves: findAllPossibleMovesForTurn(turn, board),
  };
}

function findAllPossibleMovesForTurn(turn: Turn, board: BoardData) {
  return findAllTurnCheckers(turn, board).flatMap(
    (coords) => getCoordsMonitor(coords, board)?.findMoves() ?? [],
  );
}

function findAllPossibleJumpsForTurn({
  jumpingCheckerCoords,
  turn,
  board,
}: MovingsParams) {
  if (checkCoords(jumpingCheckerCoords).areEquals(nullCoords)) {
    return findAllTurnCheckers(turn, board).flatMap(
      (coords) => getCoordsMonitor(coords, board)?.findJumps() ?? [],
    );
  }

  return getCoordsMonitor(jumpingCheckerCoords, board)?.findJumps() ?? [];
}

function findAllTurnCheckers(turn: Turn, board: BoardData) {
  return board
    .flatMap((rank, rankIndex) => {
      return rank.map((_, squareIndex) => {
        return createCoords(rankIndex, squareIndex);
      });
    })
    .filter((coords) => getCoordsMonitor(coords, board)?.isOwnedBy(turn));
}
