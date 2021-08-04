export const WHITE_SQUARE = "_";
export const EMPTY_BLACK_SQUARE = "e";
export const SQUARE_WITH_WHITE_CHECKER = "w";
export const SQUARE_WITH_BLACK_CHECKER = "b";

type WhiteChecker = typeof SQUARE_WITH_WHITE_CHECKER;
type BlackChecker = typeof SQUARE_WITH_BLACK_CHECKER;

type BlackSquare = typeof EMPTY_BLACK_SQUARE | BlackChecker | WhiteChecker;
type WhiteSquare = typeof WHITE_SQUARE;
export type SquareModel = BlackSquare | WhiteSquare;

export type BoardModel<X = BlackSquare, O = WhiteSquare> = [
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

const _ = WHITE_SQUARE;
const W = SQUARE_WITH_WHITE_CHECKER;
const B = SQUARE_WITH_BLACK_CHECKER;
const E = EMPTY_BLACK_SQUARE;

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
