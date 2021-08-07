import { initialBoardData, TurnModel } from "./board.model";
import { nullCoords } from "./coords.model";

export const initialGameModel = {
  turn: TurnModel.black,
  jumpingCheckerCoords: nullCoords,
  activeCheckerCoords: nullCoords,
  board: initialBoardData,
};

export type GameModel = typeof initialGameModel;
