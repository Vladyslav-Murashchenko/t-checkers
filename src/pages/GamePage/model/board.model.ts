import { SquareModel } from "./square.model";

type BlackSquare =
  | SquareModel.emptyBlack
  | SquareModel.withWhiteMan
  | SquareModel.withWhiteKing
  | SquareModel.withBlackMan
  | SquareModel.withBlackKing;

export type BoardModel<B = BlackSquare, W = SquareModel.white> = [
  [W, B, W, B, W, B, W, B],
  [B, W, B, W, B, W, B, W],
  [W, B, W, B, W, B, W, B],
  [B, W, B, W, B, W, B, W],
  [W, B, W, B, W, B, W, B],
  [B, W, B, W, B, W, B, W],
  [W, B, W, B, W, B, W, B],
  [B, W, B, W, B, W, B, W],
];

export type RankModel<S = SquareModel> = [S, S, S, S, S, S, S, S];

const _ = SquareModel.white;
const W = SquareModel.withWhiteMan;
const B = SquareModel.withBlackMan;
const E = SquareModel.emptyBlack;

export const initialBoard: BoardModel = [
  [_, W, _, W, _, W, _, W],
  [W, _, W, _, W, _, W, _],
  [_, W, _, W, _, W, _, W],
  [E, _, E, _, E, _, E, _],
  [_, E, _, E, _, E, _, E],
  [B, _, B, _, B, _, B, _],
  [_, B, _, B, _, B, _, B],
  [B, _, B, _, B, _, B, _],
];
