import { FC } from "react";
import cx from "utils/cx";
import useGameDispatch from "../hooks/useGameDispatch";
import {
  RankModel,
  SquareModel,
  Coords,
  checkSquare,
  checkCoords,
  createCoords,
} from "../model";
import { checkerTouchedByPlayer, checkerMoved, checkerJumped } from "../update";

import styles from "./Rank.module.css";

type RankProps = {
  rank: RankModel;
  rankIndex: number;
  possibleMoveTargets: Coords[];
  possibleJumpTargets: Coords[];
  activeCheckerCoords: Coords;
};

const Rank: FC<RankProps> = ({
  rank,
  rankIndex,
  possibleMoveTargets,
  possibleJumpTargets,
  activeCheckerCoords,
}) => {
  const dispatch = useGameDispatch();

  const handleCheckerMouseOver = (squareIndex: number) => () => {
    const coords = createCoords(squareIndex, rankIndex);

    dispatch(checkerTouchedByPlayer(coords));
  };

  const handleSquareMouseUp = (squareIndex: number) => () => {
    const coords = createCoords(squareIndex, rankIndex);

    if (checkCoords(coords).toBeIn(possibleMoveTargets)) {
      dispatch(checkerMoved(coords));
    }

    if (checkCoords(coords).toBeIn(possibleJumpTargets)) {
      dispatch(checkerJumped(coords));
    }
  };

  return (
    <ul className={cx("resetList", styles.list)}>
      {rank.map((square, squareIndex) => {
        const squareClassName = deriveSquareClassName({
          square,
          squareIndex,
          rankIndex,
          possibleMoveTargets,
          possibleJumpTargets,
          activeCheckerCoords,
        });

        return (
          <li
            key={squareIndex}
            className={squareClassName}
            onMouseUp={handleSquareMouseUp(squareIndex)}
          >
            {checkSquare(square).hasChecker() && (
              <div
                className={checkerClassName(square)}
                onMouseOver={handleCheckerMouseOver(squareIndex)}
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
  possibleMoveTargets: Coords[];
  possibleJumpTargets: Coords[];
  activeCheckerCoords: Coords;
};
function deriveSquareClassName({
  square,
  squareIndex,
  rankIndex,
  possibleMoveTargets,
  possibleJumpTargets,
  activeCheckerCoords,
}: DeriveSquareClassNameParams): string {
  const coords = createCoords(squareIndex, rankIndex);

  const isPossibleTarget = checkCoords(coords).toBeIn(possibleMoveTargets);
  const isPossibleJump = checkCoords(coords).toBeIn(possibleJumpTargets);
  const isActive = checkCoords(coords).areEquals(activeCheckerCoords);

  return cx(
    checkSquare(square).isWhite() ? whiteSquare : blackSquare,
    isPossibleTarget && styles.moveIsPossible,
    isPossibleJump && styles.jumpIsPossible,
    isActive && styles.squareActive,
  );
}

function checkerClassName(square: SquareModel) {
  return checkSquare(square).hasWhiteChecker() ? whiteChecker : blackChecker;
}
