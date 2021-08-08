import { Side } from "./side.model";

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
    isOwnedBy: (side: Side) => {
      const isOwnedBySide = {
        [Side.white]: self.hasWhiteChecker,
        [Side.black]: self.hasBlackChecker,
      };

      return isOwnedBySide[side]();
    },
  };

  return self;
};

export const getSquareMonitor = (square: SquareModel) => {
  return Object.assign(checkSquare(square), {
    getSide(): Side | null {
      const turnBySquare = {
        [SquareModel.withBlackMan]: Side.black,
        [SquareModel.withBlackKing]: Side.black,
        [SquareModel.withWhiteMan]: Side.white,
        [SquareModel.withWhiteKing]: Side.white,
        [SquareModel.white]: null,
        [SquareModel.emptyBlack]: null,
      };

      return turnBySquare[square];
    },
  });
};
