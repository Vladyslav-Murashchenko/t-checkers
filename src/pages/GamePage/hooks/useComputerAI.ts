import { useEffect } from "react";
import {
  deriveTurnOfComputerAI,
  findAllPossibleMoves,
  GameModel,
} from "../model";
import { makeMove } from "../update";
import { Dispatch } from "./useGameDispatch";

const useComputerAI = (game: GameModel, dispatch: Dispatch) => {
  useEffect(() => {
    const { moveTurn, turnOfPlayer, board } = game;

    const turnOfComputer = deriveTurnOfComputerAI(turnOfPlayer);

    if (moveTurn === turnOfComputer) {
      const allPossibleMoves = findAllPossibleMoves(turnOfComputer, board);

      const randomMove = getRandomItem(allPossibleMoves);

      let timer = setTimeout(() => {
        dispatch(makeMove(randomMove));
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  });
};

export default useComputerAI;

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(arr.length * Math.random())];
}
