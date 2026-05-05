import { useEffect, useReducer } from "react";

import { initialGameModel } from "./model";
import GameView from "./view";
import gameReducer from "./update";
import { GameDispatchContent } from "./hooks/useGameDispatch";
import useComputerAI from "./hooks/useComputerAI";
import gamePersistService from "./services/gamePersistService";

const Game = () => {
  const [game, dispatch] = useReducer(
    gameReducer,
    initialGameModel,
    gamePersistService.initReducer,
  );

  useComputerAI(game, dispatch);

  useEffect(() => {
    gamePersistService.persist(game);
  }, [game]);

  return (
    <GameDispatchContent.Provider value={dispatch}>
      <GameView game={game} />
    </GameDispatchContent.Provider>
  );
};

export default Game;
