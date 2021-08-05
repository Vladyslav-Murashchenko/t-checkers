import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  deriveCoordsOfCaptured,
  getSquareByCoords,
  hasChecker,
  hasCheckerByTurn,
  hasJumps,
  initialGameModel,
  SquareModel,
  TurnModel,
} from "../model";
import type { Coords } from "../model";
import { CoordsOfMove, initialCoords } from "../model/board.model";

const gameSlice = createSlice({
  name: "game",
  initialState: initialGameModel,
  reducers: {
    checkerTouchedByPlayer: (state, action: PayloadAction<Coords>) => {
      const coords = action.payload;
      const { turnOfPlayer, moveTurn, board } = state;

      if (turnOfPlayer !== moveTurn) {
        return;
      }

      const square = getSquareByCoords(coords, board);

      if (square && hasCheckerByTurn(square, turnOfPlayer)) {
        state.activeCheckerCoords = coords;
      }
    },
    makeMove: (state, action: PayloadAction<CoordsOfMove>) => {
      const { from, to } = action.payload;
      const [fromX, fromY] = from;
      const [toX, toY] = to;

      state.board[toY][toX] = state.board[fromY][fromX];
      state.board[fromY][fromX] = SquareModel.emptyBlack;

      const [capturedX, capturedY] = deriveCoordsOfCaptured(action.payload);
      const wasCaptured = hasChecker(state.board[capturedY][capturedX]);
      state.board[capturedY][capturedX] = SquareModel.emptyBlack;

      if (wasCaptured && hasJumps(to, current(state.board))) {
        state.activeCheckerCoords = to;
        return;
      }

      const nextTurnByCurrent = {
        [TurnModel.black]: TurnModel.white,
        [TurnModel.white]: TurnModel.black,
      };
      state.moveTurn = nextTurnByCurrent[state.moveTurn];

      state.activeCheckerCoords = initialCoords;
    },
  },
});

export default gameSlice.reducer;
export const { checkerTouchedByPlayer, makeMove } = gameSlice.actions;
