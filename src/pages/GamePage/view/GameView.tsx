import type { FC } from "react";
import cx from "utils/cx";
import { checkCoords, Coords, GameModel, MoveSnapshot } from "../model";
import Rank from "./Rank";

import styles from "./GameView.module.css";
import { findAllPossibleMovingsForTurn } from "../model";

type GameViewProps = {
  game: GameModel;
};

const GameView: FC<GameViewProps> = ({ game }) => {
  const { board, activeCheckerCoords } = game;

  const { possibleJumps, possibleMoves } = findAllPossibleMovingsForTurn(game);

  const possibleMoveTargets = possibleMoves
    .filter(currentCoordsEquals(activeCheckerCoords))
    .map(getTarget);

  const possibleJumpTargets = possibleJumps
    .filter(currentCoordsEquals(activeCheckerCoords))
    .map(getTarget);

  return (
    <main className={styles.main}>
      <ul className={cx("resetList", styles.list)}>
        {board.map((rank, index) => {
          return (
            <li key={index}>
              <Rank
                rank={rank}
                rankIndex={index}
                possibleMoveTargets={possibleMoveTargets}
                possibleJumpTargets={possibleJumpTargets}
                activeCheckerCoords={activeCheckerCoords}
              />
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default GameView;

function getTarget({ to }: MoveSnapshot) {
  return to;
}

function currentCoordsEquals(activeCheckerCoords: Coords) {
  return ({ from }: MoveSnapshot) => {
    return checkCoords(activeCheckerCoords).areEquals(from);
  };
}
