import {
  checkCoords,
  createCoords,
  getCoordsMonitor,
  MoveSnapshot,
  nullCoords,
} from "./coords.model";
import { GameModel } from "./game.model";
import { SquareModel } from "./square.model";

export enum TurnModel {
  white = "white",
  black = "black",
}

type BlackSquare =
  | SquareModel.emptyBlack
  | SquareModel.withWhiteMan
  | SquareModel.withWhiteKing
  | SquareModel.withBlackMan
  | SquareModel.withBlackKing;

export type BoardData<X = BlackSquare, O = SquareModel.white> = [
  [O, X, O, X, O, X, O, X],
  [X, O, X, O, X, O, X, O],
  [O, X, O, X, O, X, O, X],
  [X, O, X, O, X, O, X, O],
  [O, X, O, X, O, X, O, X],
  [X, O, X, O, X, O, X, O],
  [O, X, O, X, O, X, O, X],
  [X, O, X, O, X, O, X, O],
];

export type RankModel<S = SquareModel> = [S, S, S, S, S, S, S, S];

const _ = SquareModel.white;
const W = SquareModel.withWhiteMan;
const B = SquareModel.withBlackMan;
const E = SquareModel.emptyBlack;

export const initialBoardData: BoardData = [
  [_, W, _, W, _, W, _, W],
  [W, _, W, _, W, _, W, _],
  [_, W, _, W, _, W, _, W],
  [E, _, E, _, E, _, E, _],
  [_, E, _, E, _, E, _, E],
  [B, _, B, _, B, _, B, _],
  [_, B, _, B, _, B, _, B],
  [B, _, B, _, B, _, B, _],
];

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
