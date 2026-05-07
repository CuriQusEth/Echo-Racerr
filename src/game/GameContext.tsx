import React, { createContext, useContext, useState, ReactNode } from 'react';

type ScreenState = 'title' | 'playing' | 'gameover' | 'garage' | 'leaderboard';

interface GameState {
  screen: ScreenState;
  setScreen: (screen: ScreenState) => void;
  lastScore: number;
  setLastScore: (score: number) => void;
  lastCombo: number;
  setLastCombo: (combo: number) => void;
  orbs: number;
  setOrbs: (orbs: number | ((prev: number) => number)) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<ScreenState>('title');
  const [lastScore, setLastScore] = useState(0);
  const [lastCombo, setLastCombo] = useState(0);
  const [orbs, setOrbs] = useState(0);

  return (
    <GameContext.Provider value={{ screen, setScreen, lastScore, setLastScore, lastCombo, setLastCombo, orbs, setOrbs }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameStore() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGameStore must be used within GameProvider');
  return context;
}
