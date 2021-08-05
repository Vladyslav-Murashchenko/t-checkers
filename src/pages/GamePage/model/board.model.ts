export enum SquareModel {
  white = "_",
  emptyBlack = "e",
  withWhiteChecker = "w",
  withBlackChecker = "b",
}

type BlackSquare =
  | SquareModel.emptyBlack
  | SquareModel.withWhiteChecker
  | SquareModel.withBlackChecker;

export type BoardModel<X = BlackSquare, O = SquareModel.white> = [
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
const W = SquareModel.withWhiteChecker;
const B = SquareModel.withBlackChecker;
const E = SquareModel.emptyBlack;

export const initialBoardModel: BoardModel = [
  [_, W, _, W, _, W, _, W],
  [W, _, W, _, W, _, W, _],
  [_, W, _, W, _, W, _, W],
  [E, _, E, _, E, _, E, _],
  [_, E, _, E, _, E, _, E],
  [B, _, B, _, B, _, B, _],
  [_, B, _, B, _, B, _, B],
  [B, _, B, _, B, _, B, _],
];

export type Coords<X = number, Y = number> = [X, Y];
export const initialCoords: Coords = [-1, -1];

export type CoordsOfMove = {
  from: Coords;
  to: Coords;
};
