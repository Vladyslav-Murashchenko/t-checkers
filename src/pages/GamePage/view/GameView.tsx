import type { FC } from "react";
import cx from "utils/cx";
import { checkCoords, Coords, GameModel, MoveSnapshot } from "../model";
import Rank from "./Rank";

import styles from "./GameView.module.css";
import { findAllMovingsForSide } from "../model";
import Header from "./Header";

type GameViewProps = {
  game: GameModel;
};

const GameView: FC<GameViewProps> = ({ game }) => {
  const { turn, status, board, activeCheckerCoords, jumpingCheckerCoords } =
    game;

  const { possibleJumps, possibleMoves } = findAllMovingsForSide({
    side: turn,
    board,
    jumpingCheckerCoords,
  });

  const possibleMoveTargets = possibleMoves
    .filter(currentCoordsEquals(activeCheckerCoords))
    .map(getTarget);

  const possibleJumpTargets = possibleJumps
    .filter(currentCoordsEquals(activeCheckerCoords))
    .map(getTarget);

  return (
    <div className={styles.wrapper}>
      <Header status={status} turn={turn} />
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
    </div>
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
