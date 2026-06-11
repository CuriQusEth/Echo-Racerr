'use client';

import { useState, useEffect } from 'react';
import TitleScreen from '@/components/TitleScreen';
import RacingScreen from '@/components/RacingScreen';
import GameOverScreen from '@/components/GameOverScreen';
import LeaderboardScreen from '@/components/LeaderboardScreen';
import GarageScreen from '@/components/GarageScreen';
import Web3Header from '@/components/Web3Header';

export type GameState = 'title' | 'racing' | 'gameover' | 'leaderboard' | 'garage';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('title');
  const [lastScore, setLastScore] = useState<number>(0);
  const [lastDistance, setLastDistance] = useState<number>(0);

  const handleStartRace = () => setGameState('racing');
  const handleGameOver = (score: number, distance: number) => {
    setLastScore(score);
    setLastDistance(distance);
    setGameState('gameover');
  };
  const handleGoToTitle = () => setGameState('title');
  const handleGoToLeaderboard = () => setGameState('leaderboard');
  const handleGoToGarage = () => setGameState('garage');

  // Prevent scrolling on touch
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => document.removeEventListener('touchmove', preventDefault);
  }, []);

  return (
    <main className="relative w-full h-screen bg-black flex flex-col items-center justify-center">
      <div className="absolute top-0 w-full z-50">
        <Web3Header />
      </div>

      <div className="relative w-full h-full max-w-2xl mx-auto flex flex-col shadow-[0_0_50px_rgba(0,255,204,0.1)] border-x border-[#111] overflow-hidden">
        {gameState === 'title' && (
          <TitleScreen 
            onStartRace={handleStartRace} 
            onViewLeaderboard={handleGoToLeaderboard}
            onViewGarage={handleGoToGarage}
          />
        )}
        
        {gameState === 'racing' && (
          <RacingScreen onGameOver={handleGameOver} />
        )}

        {gameState === 'gameover' && (
          <GameOverScreen 
            score={lastScore} 
            distance={lastDistance} 
            onRetry={handleStartRace} 
            onHome={handleGoToTitle} 
          />
        )}

        {gameState === 'leaderboard' && (
          <LeaderboardScreen onBack={handleGoToTitle} />
        )}

        {gameState === 'garage' && (
          <GarageScreen onBack={handleGoToTitle} />
        )}
      </div>
    </main>
  );
}
