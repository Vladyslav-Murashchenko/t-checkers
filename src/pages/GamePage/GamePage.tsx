import { useEffect, useReducer } from "react";

import useComputerAI from "./hooks/useComputerAI";
import { GameDispatchContent } from "./hooks/useGameDispatch";
import { initialGameModel } from "./model";
import gamePersistService from "./services/gamePersistService";
import gameReducer from "./update";
import GameView from "./view";

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
