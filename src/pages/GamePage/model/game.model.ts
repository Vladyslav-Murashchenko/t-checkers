import { getCoordsMonitor } from "./coordsOnBoard.model";
import { BoardData, initialBoardData } from "./board.model";
import {
  checkCoords,
  createCoords,
  MoveSnapshot,
  nullCoords,
} from "./coords.model";
import { TurnModel } from "./turn.model";

export const initialGameModel = {
  turn: TurnModel.black,
  jumpingCheckerCoords: nullCoords,
  activeCheckerCoords: nullCoords,
  board: initialBoardData,
};

export type GameModel = typeof initialGameModel;

export function findAllPossibleMovingsForTurn(game: GameModel) {
  const { turn, board } = game;
  const possibleJumps = findAllPossibleJumpsForTurn(game);

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

function findAllPossibleMovesForTurn(turn: TurnModel, board: BoardData) {
  return findAllTurnCheckers(turn, board).flatMap(
    (coords) => getCoordsMonitor(coords, board)?.findMoves() ?? [],
  );
}

function findAllPossibleJumpsForTurn(game: GameModel) {
  const { jumpingCheckerCoords, activeCheckerCoords, turn, board } = game;

  if (checkCoords(jumpingCheckerCoords).areEquals(nullCoords)) {
    return findAllTurnCheckers(turn, board).flatMap(
      (coords) => getCoordsMonitor(coords, board)?.findJumps() ?? [],
    );
  }

  return getCoordsMonitor(activeCheckerCoords, board)?.findJumps() ?? [];
}

function findAllTurnCheckers(turn: TurnModel, board: BoardData) {
  return board
    .flatMap((rank, rankIndex) => {
      return rank.map((_, squareIndex) => {
        return createCoords(rankIndex, squareIndex);
      });
    })
    .filter((coords) => getCoordsMonitor(coords, board)?.isOwnedBy(turn));
}
