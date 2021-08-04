import type { FC } from "react";
import cx from "../../../utils/cx";
import type { BoardModel } from "../model";
import Rank from "./Rank";

import styles from "./GameView.module.css";

type GameViewProps = {
  boardModel: BoardModel;
};

const GameView: FC<GameViewProps> = ({ boardModel }) => {
  return (
    <main className={styles.main}>
      <ul className={cx("resetList", styles.list)}>
        {boardModel.map((rank, i) => {
          return (
            <li key={i}>
              <Rank rank={rank} />
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default GameView;
