import { GameModel } from "../model";

const gamePersistService = {
  initReducer: (state: GameModel) => {
    const persistedState = localStorage.getItem("game");

    if (persistedState) {
      return JSON.parse(persistedState);
    }

    return state;
  },
  persist: (state: GameModel) => {
    localStorage.setItem("game", JSON.stringify(state));
  },
};

export default gamePersistService;
