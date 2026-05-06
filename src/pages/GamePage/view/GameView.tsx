import type { FC } from "react";

import cx from "../../../utils/cx";
import { Coords, GameModel, MoveSnapshot, checkCoords } from "../model";
import { findAllMovesForSide } from "../model";
import styles from "./GameView.module.css";
import Header from "./Header";
import Rank from "./Rank";

type GameViewProps = {
  game: GameModel;
};

const GameView: FC<GameViewProps> = ({ game }) => {
  const { turn, status, board, activeCheckerCoords, jumpingCheckerCoords } =
    game;

  const { possibleJumps, possibleSlides } = findAllMovesForSide({
    side: turn,
    board,
    jumpingCheckerCoords,
  });

  const possibleSlideTargets = possibleSlides
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
                  possibleSlideTargets={possibleSlideTargets}
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
