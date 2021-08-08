interface ST {
  status: string;
}

interface CR<S, A, R> {
  (state: S, action: A): R;
}

/**
 * @description
 * simplify creating state machines with reduxjs/toolkit.
 * @example
 *   checkerMoved: (state, action: PayloadAction<Coords>) => {
 *     if (state.status === Status.playing) {
 *        // ...
 *     }
 *   },
 *   checkerJumped: (state, action: PayloadAction<Coords>) => {
 *     if (state.status === Status.playing) {
 *        // ...
 *    }
 *   },
 *
 *   // is equal to:
 *   const whenPlaying = whenStatus((status) => status === Status.playing);
 *   // ...
 *   checkerMoved: whenPlaying((state, action: PayloadAction<Coords>) => {
 *     // ...
 *   }),
 *   checkerJumped: whenPlaying((state, action: PayloadAction<Coords>) => {
 *     // ...
 *   }),
 * @more
 * You can take a look at my proposal for reduxjs/toolkit here:
 * https://github.com/reduxjs/redux-toolkit/issues/1065
 */
const whenStatus = (checkStatus: (status: string) => boolean) => {
  return <S extends ST, A, R>(caseReducer: CR<S, A, R>) => {
    return (state: S, action: A) => {
      if (!checkStatus(state.status)) {
        return state;
      }

      return caseReducer(state, action);
    };
  };
};

export default whenStatus;
