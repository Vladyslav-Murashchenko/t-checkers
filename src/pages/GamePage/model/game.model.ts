import { BoardModel, initialBoard } from "./board.model";
import { CoordsMonitor, tryCreateCoords } from "./coords.model";
import { Coords } from "./coords.model";
import { Side } from "./side.model";
import { Status } from "./status.model";

export type GameModel = {
  status: Status;
  turn: Side;
  jumpingCheckerCoords: Coords | null;
  activeCheckerCoords: Coords | null;
  board: BoardModel;
};

export const initialGameModel: GameModel = {
  status: Status.playing,
  turn: Side.black,
  jumpingCheckerCoords: null,
  activeCheckerCoords: null,
  board: initialBoard,
};

type MoveParams = {
  jumpingCheckerCoords: Coords | null;
  side: Side;
  board: BoardModel;
};

export function hasSideMoves(params: MoveParams) {
  const { possibleJumps, possibleSlides } = findAllMovesForSide(params);

  return !![...possibleJumps, ...possibleSlides].length;
}

export function findAllMovesForSide(params: MoveParams) {
  const { side, board } = params;
  const possibleJumps = findAllJumpsForSide(params);

  if (possibleJumps.length) {
    return {
      possibleJumps,
      possibleSlides: [],
    };
  }

  return {
    possibleJumps: [],
    possibleSlides: findAllSlidesForSide(side, board),
  };
}

function findAllSlidesForSide(side: Side, board: BoardModel) {
  return findAllSideCheckers(side, board).flatMap((coords) =>
    CoordsMonitor(coords, board).findSlides(),
  );
}

function findAllJumpsForSide({
  jumpingCheckerCoords,
  side,
  board,
}: MoveParams) {
  if (jumpingCheckerCoords === null) {
    return findAllSideCheckers(side, board).flatMap((coords) =>
      CoordsMonitor(coords, board).findJumps(),
    );
  }

  return CoordsMonitor(jumpingCheckerCoords, board).findJumps();
}

function findAllSideCheckers(side: Side, board: BoardModel) {
  return board
    .flatMap((rank, rankIndex) => {
      return rank.map((_, squareIndex) => {
        return tryCreateCoords(rankIndex, squareIndex);
      });
    })
    .filter((coords): coords is Coords => coords !== null)
    .filter((coords) => CoordsMonitor(coords, board).isOwnedBy(side));
}
