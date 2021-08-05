import { AnyAction } from "@reduxjs/toolkit";
import React, { createContext, useContext } from "react";

export type Dispatch = React.Dispatch<AnyAction>;
export const GameDispatchContent = createContext<Dispatch>(() => {});

const useGameDispatch = () => {
  return useContext(GameDispatchContent);
};

export default useGameDispatch;
