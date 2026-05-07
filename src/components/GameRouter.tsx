import React from 'react';
import { useGameStore } from '../game/GameContext';
import TitleScreen from './screens/TitleScreen';
import GarageScreen from './screens/GarageScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import GameOverScreen from './screens/GameOverScreen';
import GameplayScreen from './screens/GameplayScreen';

export default function GameRouter() {
  const { screen } = useGameStore();

  switch (screen) {
    case 'title':
      return <TitleScreen />;
    case 'playing':
      return <GameplayScreen />;
    case 'gameover':
      return <GameOverScreen />;
    case 'garage':
      return <GarageScreen />;
    case 'leaderboard':
      return <LeaderboardScreen />;
    default:
      return <TitleScreen />;
  }
}
