import { FC, memo } from "react";
import cx from "../../../utils/cx";
import type { RankModel } from "../model";
import { SquareModel } from "../model/board.model";
import { hasChecker, hasWhiteChecker, isWhite } from "../model/derivations";

import styles from "./Rank.module.css";

type RankProps = {
  rank: RankModel;
};

const Rank: FC<RankProps> = ({ rank }) => {
  return (
    <ul className={cx("resetList", styles.list)}>
      {rank.map((square, i) => (
        <li className={squareClassName(square)} key={i}>
          {hasChecker(square) && <div className={checkerClassName(square)} />}
        </li>
      ))}
    </ul>
  );
};

export default memo(Rank);

const whiteSquare = cx(styles.square, styles.white);
const blackSquare = cx(styles.square, styles.black);
const whiteChecker = cx(styles.checker, styles.white);
const blackChecker = cx(styles.checker, styles.black);

function squareClassName(square: SquareModel) {
  return isWhite(square) ? whiteSquare : blackSquare;
}

function checkerClassName(square: SquareModel) {
  return hasWhiteChecker(square) ? whiteChecker : blackChecker;
}
