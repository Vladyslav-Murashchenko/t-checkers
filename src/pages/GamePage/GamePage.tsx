import { useReducer } from "react";

import { initialBoardModel } from "./model";
import GameView from "./view";
import gameReducer from "./update";

const Game = () => {
  const [boardModel] = useReducer(gameReducer, initialBoardModel);

  return <GameView boardModel={boardModel} />;
};

export default Game;
