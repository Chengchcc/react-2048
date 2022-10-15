import { createContext } from "react";
import { GameState } from "../composables/gameState";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GameContext = createContext<GameState>(null as any)
