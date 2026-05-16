import { FC } from "react";

import cx from "../../../utils/cx";
import useGameDispatch from "../hooks/useGameDispatch";
import {
  Coords,
  RankModel,
  SquareModel,
  checkCoords,
  checkSquare,
} from "../model";
import { tryCreateCoords } from "../model/coords.model";
import { checkerJumped, checkerSlid, checkerTouchedByPlayer } from "../update";
import styles from "./Rank.module.css";

type RankProps = {
  rank: RankModel;
  rankIndex: number;
  possibleSlideTargets: Coords[];
  possibleJumpTargets: Coords[];
  activeCheckerCoords: Coords | null;
};

const Rank: FC<RankProps> = ({
  rank,
  rankIndex,
  possibleSlideTargets,
  possibleJumpTargets,
  activeCheckerCoords,
}) => {
  const dispatch = useGameDispatch();

  const handleCheckerMouseDown = (squareIndex: number) => () => {
    const coords = tryCreateCoords(squareIndex, rankIndex);

    if (!coords) {
      return;
    }

    dispatch(checkerTouchedByPlayer(coords));
  };

  const handleSquareMouseUp = (squareIndex: number) => () => {
    const coords = tryCreateCoords(squareIndex, rankIndex);

    if (!coords) {
      return;
    }

    if (checkCoords(coords).toBeIn(possibleSlideTargets)) {
      dispatch(checkerSlid(coords));
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
          possibleSlideTargets,
          possibleJumpTargets,
          activeCheckerCoords,
        });

        return (
          <li
            key={squareIndex}
            className={squareClassName}
            onMouseUp={handleSquareMouseUp(squareIndex)}
            onTouchEnd={handleSquareMouseUp(squareIndex)}
          >
            {checkSquare(square).hasChecker() && (
              <div
                className={checkerClassName(square)}
                onMouseDown={handleCheckerMouseDown(squareIndex)}
                onMouseOver={handleCheckerMouseDown(squareIndex)}
                onTouchStart={handleCheckerMouseDown(squareIndex)}
              >
                {checkSquare(square).hasKing() && (
                  <div className={styles.crown} />
                )}
              </div>
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
  possibleSlideTargets: Coords[];
  possibleJumpTargets: Coords[];
  activeCheckerCoords: Coords | null;
};
function deriveSquareClassName({
  square,
  squareIndex,
  rankIndex,
  possibleSlideTargets,
  possibleJumpTargets,
  activeCheckerCoords,
}: DeriveSquareClassNameParams): string {
  const coords = tryCreateCoords(squareIndex, rankIndex);

  if (!coords) {
    return whiteSquare;
  }

  const isPossibleSlide = checkCoords(coords).toBeIn(possibleSlideTargets);
  const isPossibleJump = checkCoords(coords).toBeIn(possibleJumpTargets);
  const isActive =
    activeCheckerCoords !== null &&
    checkCoords(coords).areEquals(activeCheckerCoords);

  return cx(
    checkSquare(square).isWhite() ? whiteSquare : blackSquare,
    isPossibleSlide && styles.slideIsPossible,
    isPossibleJump && styles.jumpIsPossible,
    isActive && styles.squareActive,
  );
}

function checkerClassName(square: SquareModel) {
  return checkSquare(square).hasWhiteChecker() ? whiteChecker : blackChecker;
}
