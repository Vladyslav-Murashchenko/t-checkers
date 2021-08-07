import { TurnModel } from "./board.model";

export enum SquareModel {
  white = "_",
  emptyBlack = "e",
  withWhiteChecker = "w",
  withBlackChecker = "b",
}

export const checkSquare = (square: SquareModel) => {
  const is = (standard: SquareModel) => square === standard;

  const self = {
    isWhite: () => is(SquareModel.white),
    isEmptyBlack: () => is(SquareModel.emptyBlack),
    hasWhiteChecker: () => is(SquareModel.withWhiteChecker),
    hasBlackChecker: () => is(SquareModel.withBlackChecker),
    hasChecker: () => self.hasWhiteChecker() || self.hasBlackChecker(),
    hasPlayerChecker: () => self.hasBlackChecker(),
    hasComputerChecker: () => self.hasWhiteChecker(),
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
