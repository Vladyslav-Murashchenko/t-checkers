import { useEffect } from "react";
import { GameModel, findAllPossibleMovingsForTurn, TurnModel } from "../model";
import {
  checkerJumped,
  checkerMoved,
  checkerTouchedByComputer,
} from "../update";
import { Dispatch } from "./useGameDispatch";

const useComputerAI = (game: GameModel, dispatch: Dispatch) => {
  useEffect(() => {
    if (game.turn === TurnModel.white) {
      const { possibleJumps, possibleMoves } =
        findAllPossibleMovingsForTurn(game);

      const randomMove = getRandomItem([...possibleJumps, ...possibleMoves]);

      dispatch(checkerTouchedByComputer(randomMove.from));

      let timer = setTimeout(() => {
        const isJump = possibleJumps.includes(randomMove);
        const finalAction = isJump ? checkerJumped : checkerMoved;
        dispatch(finalAction(randomMove.to));
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [game.turn, game.jumpingCheckerCoords]);
};

export default useComputerAI;

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(arr.length * Math.random())];
}
