export type { GameModel } from "./game.model";
export { initialGameModel } from "./game.model";

export type { RankModel, BoardData } from "./board.model";
export { TurnModel, findAllPossibleMovingsForTurn } from "./board.model";

export { checkSquare, SquareModel } from "./square.model";

export type { Coords, MoveSnapshot } from "./coords.model";
export {
  nullCoords,
  checkCoords,
  getCoordsMonitor,
  createCoords,
  createMoveShapshot,
} from "./coords.model";
