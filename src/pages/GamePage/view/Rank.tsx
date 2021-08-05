import { FC } from "react";
import cx from "../../../utils/cx";
import useGameDispatch from "../hooks/useGameDispatch";
import type { RankModel, SquareModel, Coords } from "../model";
import {
  deriveIsPossibleMoveTarget,
  hasChecker,
  hasWhiteChecker,
  isEqualCoords,
  isWhite,
} from "../model/derivations";
import { checkerTouchedByPlayer, makeMove } from "../update";

import styles from "./Rank.module.css";

type RankProps = {
  rank: RankModel;
  rankIndex: number;
  possibleMoves: Coords[];
  activeCheckerCoords: Coords;
};

const Rank: FC<RankProps> = ({
  rank,
  rankIndex,
  possibleMoves,
  activeCheckerCoords,
}) => {
  const dispatch = useGameDispatch();

  const handleCheckerMouseDown = (squareIndex: number) => () => {
    const coords: Coords = [squareIndex, rankIndex];

    dispatch(checkerTouchedByPlayer(coords));
  };

  const handleSquareMouseUp = (squareIndex: number) => () => {
    const coords: Coords = [squareIndex, rankIndex];
    const isOkDropTarget = deriveIsPossibleMoveTarget(coords, possibleMoves);

    if (isOkDropTarget) {
      dispatch(
        makeMove({
          from: activeCheckerCoords,
          to: coords,
        }),
      );
    }
  };

  return (
    <ul className={cx("resetList", styles.list)}>
      {rank.map((square, squareIndex) => {
        const squareClassName = deriveSquareClassName({
          square,
          squareIndex,
          rankIndex,
          possibleMoves,
          activeCheckerCoords,
        });

        return (
          <li
            key={squareIndex}
            className={squareClassName}
            onMouseUp={handleSquareMouseUp(squareIndex)}
          >
            {hasChecker(square) && (
              <div
                className={checkerClassName(square)}
                onMouseDown={handleCheckerMouseDown(squareIndex)}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default Rank;

const whiteSquare = cx(styles.square, styles.white);
const blackSquare = cx(styles.square, styles.black);
const whiteChecker = cx(styles.checker, styles.white);
const blackChecker = cx(styles.checker, styles.black);

type DeriveSquareClassNameParams = {
  square: SquareModel;
  squareIndex: number;
  rankIndex: number;
  possibleMoves: Coords[];
  activeCheckerCoords: Coords;
};
function deriveSquareClassName({
  square,
  squareIndex,
  rankIndex,
  possibleMoves,
  activeCheckerCoords,
}: DeriveSquareClassNameParams): string {
  const coords: Coords = [squareIndex, rankIndex];
  const isPossibleTarget = deriveIsPossibleMoveTarget(coords, possibleMoves);
  const isActive = isEqualCoords(activeCheckerCoords, coords);

  return cx(
    isWhite(square) ? whiteSquare : blackSquare,
    isPossibleTarget && styles.moveIsPossible,
    isActive && styles.squareActive,
  );
}

function checkerClassName(square: SquareModel) {
  return hasWhiteChecker(square) ? whiteChecker : blackChecker;
}
