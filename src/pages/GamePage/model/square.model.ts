import { TurnModel } from "./board.model";

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
    isOwnedBy: (turn: TurnModel) => {
      const isOwnedByTurn = {
        [TurnModel.white]: self.hasWhiteChecker,
        [TurnModel.black]: self.hasBlackChecker,
      };

      return isOwnedByTurn[turn]();
    },
  };

  return self;
};

export const getSquareMonitor = (square: SquareModel) => {
  return Object.assign(checkSquare(square), {
    getTurn(): TurnModel | null {
      const turnBySquare = {
        [SquareModel.withBlackMan]: TurnModel.black,
        [SquareModel.withBlackKing]: TurnModel.black,
        [SquareModel.withWhiteMan]: TurnModel.white,
        [SquareModel.withWhiteKing]: TurnModel.white,
        [SquareModel.white]: null,
        [SquareModel.emptyBlack]: null,
      };

      return turnBySquare[square];
    },
  });
};
