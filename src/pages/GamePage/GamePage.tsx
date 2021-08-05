import { useReducer } from "react";

import { initialGameModel } from "./model";
import GameView from "./view";
import gameReducer from "./update";
import { GameDispatchContent } from "./hooks/useGameDispatch";
import useComputerAI from "./hooks/useComputerAI";

const Game = () => {
  const [game, dispatch] = useReducer(gameReducer, initialGameModel);

  useComputerAI(game, dispatch);

  return (
    <GameDispatchContent.Provider value={dispatch}>
      <GameView game={game} />
    </GameDispatchContent.Provider>
  );
};

export default Game;
