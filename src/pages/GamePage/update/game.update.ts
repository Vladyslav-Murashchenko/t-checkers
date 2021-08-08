import { createNextState, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  BoardData,
  initialGameModel,
  SquareModel,
  Side,
  getCoordsMonitor,
  Coords,
  nullCoords,
  getSquareMonitor,
  Status,
} from "../model";
import whenStatus from "utils/whenStatus";
import { hasSideMovings } from "../model/game.model";

const opponentFor = {
  [Side.black]: Side.white,
  [Side.white]: Side.black,
};

const whenPlaying = whenStatus((status) => status === Status.playing);

const gameSlice = createSlice({
  name: "game",
  initialState: initialGameModel,
  reducers: {
    checkerTouchedByComputer: whenPlaying((state, action) => {
      state.activeCheckerCoords = action.payload;
    }),
    checkerTouchedByPlayer: whenPlaying(
      (state, action: PayloadAction<Coords>) => {
        const coords = action.payload;
        const { turn, board } = state;

        const squareMonitor = getCoordsMonitor(coords, board);

        if (turn === Side.black && squareMonitor?.hasBlackChecker()) {
          state.activeCheckerCoords = coords;
        }
      },
    ),
    checkerMoved: whenPlaying((state, action: PayloadAction<Coords>) => {
      const from = state.activeCheckerCoords;
      const to = action.payload;

      state.board = makeMoveAndMaybeBecomeKing(from, to, state.board);
      state.turn = opponentFor[state.turn];
      state.activeCheckerCoords = nullCoords;
    }),
    checkerJumped: whenPlaying((state, action: PayloadAction<Coords>) => {
      const from = state.activeCheckerCoords;
      const to = action.payload;

      const [capturedX, capturedY] = getCoordsOfCapturedPiece(from, to);
      state.board[capturedY][capturedX] = SquareModel.emptyBlack;

      const updatedBoard = makeMoveAndMaybeBecomeKing(from, to, state.board);
      state.board = updatedBoard;

      const monitor = getCoordsMonitor(to, updatedBoard);
      const hasJumps = !!monitor?.findJumps().length;

      const sideOfOpponent = opponentFor[state.turn];
      const hasOpponentMovings = hasSideMovings({
        side: sideOfOpponent,
        board: updatedBoard,
        jumpingCheckerCoords: state.activeCheckerCoords,
      });

      if (!hasOpponentMovings && !hasJumps) {
        state.status = Status.finished;
        state.activeCheckerCoords = nullCoords;
        return;
      }

      if (hasJumps) {
        state.activeCheckerCoords = to;
        state.jumpingCheckerCoords = to;
        return;
      }

      state.turn = opponentFor[state.turn];
      state.activeCheckerCoords = nullCoords;
      state.jumpingCheckerCoords = nullCoords;
    }),
  },
});

export default gameSlice.reducer;
export const {
  checkerTouchedByPlayer,
  checkerTouchedByComputer,
  checkerMoved,
  checkerJumped,
} = gameSlice.actions;

function makeMoveAndMaybeBecomeKing(
  from: Coords,
  to: Coords,
  board: BoardData,
): BoardData {
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
  const squareSide = getSquareMonitor(square).getSide();

  if (squareSide && kingRowBySide[squareSide] === toY) {
    square = kingBySide[squareSide];
  }

  return createNextState(board, (draftBoard) => {
    draftBoard[toY][toX] = square;
    draftBoard[fromY][fromX] = SquareModel.emptyBlack;
  });
}

export function getCoordsOfCapturedPiece(from: Coords, to: Coords): Coords {
  const [toX, toY] = to;
  const [fromX, fromY] = from;
  const deltaX = toX - fromX;
  const deltaY = toY - fromY;

  const stepBackX = toX - Math.sign(deltaX);
  const stepBackY = toY - Math.sign(deltaY);

  return [stepBackX, stepBackY];
}
