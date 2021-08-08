import { createNextState, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  BoardData,
  initialGameModel,
  SquareModel,
  Turn,
  getCoordsMonitor,
  Coords,
  nullCoords,
} from "../model";
import { getSquareMonitor } from "../model/square.model";

const nextTurnByCurrent = {
  [Turn.black]: Turn.white,
  [Turn.white]: Turn.black,
};

const gameSlice = createSlice({
  name: "game",
  initialState: initialGameModel,
  reducers: {
    checkerTouchedByComputer: (state, action) => {
      state.activeCheckerCoords = action.payload;
    },
    checkerTouchedByPlayer: (state, action: PayloadAction<Coords>) => {
      const coords = action.payload;
      const { turn, board } = state;

      const squareMonitor = getCoordsMonitor(coords, board);

      if (turn === Turn.black && squareMonitor?.hasBlackChecker()) {
        state.activeCheckerCoords = coords;
      }
    },
    checkerMoved: (state, action: PayloadAction<Coords>) => {
      const from = state.activeCheckerCoords;
      const to = action.payload;

      state.board = makeMoveAndMaybeBecomeKing(from, to, state.board);
      state.turn = nextTurnByCurrent[state.turn];
      state.activeCheckerCoords = nullCoords;
    },
    checkerJumped: (state, action: PayloadAction<Coords>) => {
      const from = state.activeCheckerCoords;
      const to = action.payload;

      const [capturedX, capturedY] = getCoordsOfCapturedPiece(from, to);
      state.board[capturedY][capturedX] = SquareModel.emptyBlack;

      const updatedBoard = makeMoveAndMaybeBecomeKing(from, to, state.board);
      state.board = updatedBoard;

      const monitor = getCoordsMonitor(to, updatedBoard);

      const hasJumps = !!monitor?.findJumps().length;

      if (hasJumps) {
        state.activeCheckerCoords = to;
        state.jumpingCheckerCoords = to;
        return;
      }

      state.turn = nextTurnByCurrent[state.turn];
      state.activeCheckerCoords = nullCoords;
      state.jumpingCheckerCoords = nullCoords;
    },
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

  const kingRowByTurn = {
    [Turn.black]: 0,
    [Turn.white]: 7,
  };

  const kingByTurn = {
    [Turn.black]: SquareModel.withBlackKing,
    [Turn.white]: SquareModel.withWhiteKing,
  };

  let square = board[fromY][fromX];
  const squareTurn = getSquareMonitor(square).getTurn();

  if (squareTurn && kingRowByTurn[squareTurn] === toY) {
    square = kingByTurn[squareTurn];
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
