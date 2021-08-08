import { SquareModel } from "./square.model";

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
