import { Turn } from "./turn.model";

export enum SquareModel {
  white = "_",
  emptyBlack = "e",
  withWhiteMan = "w",
  withBlackMan = "b",
  withWhiteKing = "W",
  withBlackKing = "B",
}

export const checkSquare = (square: SquareModel) => {
  const is = (standard: SquareModel) => square === standard;

  const self = {
    isWhite: () => is(SquareModel.white),
    isEmptyBlack: () => is(SquareModel.emptyBlack),
    hasWhiteKing: () => is(SquareModel.withWhiteKing),
    hasBlackKing: () => is(SquareModel.withBlackKing),
    hasKing: () => self.hasWhiteKing() || self.hasBlackKing(),
    hasWhiteChecker: () => is(SquareModel.withWhiteMan) || self.hasWhiteKing(),
    hasBlackChecker: () => is(SquareModel.withBlackMan) || self.hasBlackKing(),
    hasChecker: () => self.hasWhiteChecker() || self.hasBlackChecker(),
    isOwnedBy: (turn: Turn) => {
      const isOwnedByTurn = {
        [Turn.white]: self.hasWhiteChecker,
        [Turn.black]: self.hasBlackChecker,
      };

      return isOwnedByTurn[turn]();
    },
  };

  return self;
};

export const getSquareMonitor = (square: SquareModel) => {
  return Object.assign(checkSquare(square), {
    getTurn(): Turn | null {
      const turnBySquare = {
        [SquareModel.withBlackMan]: Turn.black,
        [SquareModel.withBlackKing]: Turn.black,
        [SquareModel.withWhiteMan]: Turn.white,
        [SquareModel.withWhiteKing]: Turn.white,
        [SquareModel.white]: null,
        [SquareModel.emptyBlack]: null,
      };

      return turnBySquare[square];
    },
  });
};
