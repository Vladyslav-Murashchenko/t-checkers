import type { FC } from "react";
import cx from "../../../utils/cx";
import { derivePossibleMoveTargets, GameModel } from "../model";
import Rank from "./Rank";

import styles from "./GameView.module.css";
import { useMemo } from "react";

type GameViewProps = {
  game: GameModel;
};

const GameView: FC<GameViewProps> = ({ game }) => {
  const { activeCheckerCoords, board } = game;

  const possibleMoves = useMemo(() => {
    return derivePossibleMoveTargets(activeCheckerCoords, board);
  }, [activeCheckerCoords, board]);

  return (
    <main className={styles.main}>
      <ul className={cx("resetList", styles.list)}>
        {board.map((rank, index) => {
          return (
            <li key={index}>
              <Rank
                rank={rank}
                rankIndex={index}
                possibleMoves={possibleMoves}
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
