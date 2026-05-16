import { createNextState, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import whenStatus from "../../../utils/whenStatus";
import {
  BoardModel,
  Coords,
  CoordsMonitor,
  GameModel,
  Side,
  SquareModel,
  SquareMonitor,
  Status,
  hasSideMoves,
  initialGameModel,
} from "../model";

const opponentFor = {
  [Side.black]: Side.white,
  [Side.white]: Side.black,
};

// TODO: get rid of whenStatus
// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
const whenPlaying = whenStatus((status) => status === Status.playing);

const gameSlice = createSlice({
  name: "game",
  initialState: initialGameModel,
  reducers: {
    restart: () => initialGameModel,
    checkerTouchedByComputer: whenPlaying(
      (state, action: PayloadAction<Coords>) => {
        state.activeCheckerCoords = action.payload;
      },
    ),
    checkerTouchedByPlayer: whenPlaying(
      (state, action: PayloadAction<Coords>) => {
        const coords = action.payload;
        const { turn, board } = state;

        const squareMonitor = CoordsMonitor(coords, board);

        if (turn === Side.black && squareMonitor.hasBlackChecker()) {
          state.activeCheckerCoords = coords;
        }
      },
    ),
    checkerSlid: whenPlaying((state, action: PayloadAction<Coords>) => {
      const from = state.activeCheckerCoords;
      const to = action.payload;

      if (!from) {
        return;
      }

      state.board = makeMoveAndMaybeBecomeKing(from, to, state.board);

      const shouldFinish = shouldFinishGame(state);

      if (shouldFinish) {
        state.status = Status.finished;
        state.activeCheckerCoords = null;
        return;
      }

      state.turn = opponentFor[state.turn];
      state.activeCheckerCoords = null;
    }),
    checkerJumped: whenPlaying((state, action: PayloadAction<Coords>) => {
      const from = state.activeCheckerCoords;
      const to = action.payload;

      if (!from) {
        return;
      }

      const [capturedX, capturedY] = getCoordsOfCapturedPiece(from, to);
      state.board[capturedY][capturedX] = SquareModel.emptyBlack;

      const updatedBoard = makeMoveAndMaybeBecomeKing(from, to, state.board);
      state.board = updatedBoard;

      const monitor = CoordsMonitor(to, updatedBoard);
      const hasJumps = !!monitor.findJumps().length;

      if (hasJumps) {
        state.activeCheckerCoords = to;
        state.jumpingCheckerCoords = to;
        return;
      }

      const shouldFinish = shouldFinishGame(state);

      if (shouldFinish) {
        state.status = Status.finished;
        state.activeCheckerCoords = null;
        return;
      }

      state.turn = opponentFor[state.turn];
      state.activeCheckerCoords = null;
      state.jumpingCheckerCoords = null;
    }),
  },
});

export default gameSlice.reducer;
export const {
  restart,
  checkerTouchedByPlayer,
  checkerTouchedByComputer,
  checkerSlid,
  checkerJumped,
} = gameSlice.actions;

function makeMoveAndMaybeBecomeKing(
  from: Coords,
  to: Coords,
  board: BoardModel,
): BoardModel {
  const [fromX, fromY] = from;
  const [toX, toY] = to;

  const kingRowBySide = {
    [Side.black]: 0,
    [Side.white]: 7,
  };

  const kingBySide = {
    [Side.black]: SquareModel.withBlackKing,
    [Side.white]: SquareModel.withWhiteKing,
  };

  let square = board[fromY][fromX];
  const squareSide = SquareMonitor(square).getSide();

  if (squareSide && kingRowBySide[squareSide] === toY) {
    square = kingBySide[squareSide];
  }

  return createNextState(board, (draftBoard) => {
    draftBoard[toY][toX] = square;
    draftBoard[fromY][fromX] = SquareModel.emptyBlack;
  });
}

function getCoordsOfCapturedPiece(from: Coords, to: Coords): Coords {
  const [toX, toY] = to;
  const [fromX, fromY] = from;
  const deltaX = toX - fromX;
  const deltaY = toY - fromY;

  const stepBackX = toX - Math.sign(deltaX);
  const stepBackY = toY - Math.sign(deltaY);

  return [stepBackX, stepBackY] as Coords;
}

function shouldFinishGame(game: GameModel) {
  const sideOfOpponent = opponentFor[game.turn];

  const hasOpponentMoves = hasSideMoves({
    side: sideOfOpponent,
    board: game.board,
    jumpingCheckerCoords: null,
  });

  return !hasOpponentMoves;
}
