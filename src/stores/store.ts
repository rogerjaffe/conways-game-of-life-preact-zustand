import { ALIVE_PROBABILITY, COLS, ROWS } from "../utilities/constants";
import { initUniverse, nextUniverse, TUniverse } from "./universe";
import { create, StateCreator, StoreMutatorIdentifier } from "zustand";
import { devtools } from "zustand/middleware";

export type TState = {
  universe: TUniverse;
  lastUniverse: TUniverse | null;
  isRunning: boolean;
  inSetup: boolean;
  isStable: boolean;
  generation: number;
  setIsRunning: (isRunning: boolean) => void;
  setIsStable: (isStable: boolean) => void;
  setInSetup: (inSetup: boolean) => void;
  setNewUniverse: () => void;
  generateNextState: () => void;
  toggleCell: (row: number, col: number) => void;
};

const store = (set: any) => ({
  universe: initUniverse(ALIVE_PROBABILITY, ROWS, COLS),
  lastUniverse: null,
  isRunning: false,
  inSetup: false,
  isStable: false,
  generation: 0,

  setIsRunning: (isRunning: boolean) => set({ isRunning }, false, "isRunning"),
  setIsStable: (isStable: boolean) => {
    console.log("setIsStable");
    set({ isStable }, false, "isStable");
  },
  setInSetup: (inSetup: boolean) => set({ inSetup }, false, "inSetup"),
  setNewUniverse: () =>
    set(
      { universe: initUniverse(ALIVE_PROBABILITY, ROWS, COLS) },
      false,
      "newUniverse"
    ),
  toggleCell: (row: number, col: number) =>
    set(
      ({ universe }: { universe: any }) => {
        const u = JSON.parse(JSON.stringify(universe));
        u[row][col] = !u[row][col];
        return { universe: u };
      },
      false,
      "toggleCell"
    ),
  generateNextState: () =>
    set(
      (state: TState) => {
        return !state.isRunning || state.inSetup || state.isStable
          ? state
          : {
              lastUniverse: state.universe,
              universe: nextUniverse(state.universe),
              generation: state.generation + 1,
            };
      },
      false,
      "generateNextState"
    ),
});

export const useStore = create<TState>()(devtools<TState>(store));
