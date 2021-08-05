import { initialBoardModel, initialCoords } from "./board.model";

export enum TurnModel {
  white = "white",
  black = "black",
}

export const initialGameModel = {
  turnOfPlayer: TurnModel.black,
  moveTurn: TurnModel.black,
  activeCheckerCoords: initialCoords,
  board: initialBoardModel,
};

export type GameModel = typeof initialGameModel;

export { SquareModel } from "./board.model";
export type { RankModel, BoardModel, Coords } from "./board.model";
export * from "./derivations";
