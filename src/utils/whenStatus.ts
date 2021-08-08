interface ST {
  status: string;
}

interface CR<S, A, R> {
  (state: S, action: A): R;
}

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
