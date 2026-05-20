import { UnknownAction } from "@reduxjs/toolkit";
import { createContext, useContext } from "react";

export type Dispatch = React.Dispatch<UnknownAction>;
export const GameDispatchContent = createContext<Dispatch>(() => {});

const useGameDispatch = () => {
  return useContext(GameDispatchContent);
};

export default useGameDispatch;
