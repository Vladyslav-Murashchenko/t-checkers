import {
  SquareModel,
  WHITE_SQUARE,
  EMPTY_BLACK_SQUARE,
  SQUARE_WITH_BLACK_CHECKER,
  SQUARE_WITH_WHITE_CHECKER,
} from "./board.model";

export const isWhite = (square: SquareModel) => {
  return square === WHITE_SQUARE;
};

export const isEmptyBlack = (square: SquareModel) => {
  return square === EMPTY_BLACK_SQUARE;
};

export const hasWhiteChecker = (square: SquareModel) => {
  return square === SQUARE_WITH_WHITE_CHECKER;
};

export const hasBlackChecker = (square: SquareModel) => {
  return square === SQUARE_WITH_BLACK_CHECKER;
};

export const hasChecker = (square: SquareModel) => {
  return hasWhiteChecker(square) || hasBlackChecker(square);
};
