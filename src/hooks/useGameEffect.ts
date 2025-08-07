// File: hooks/useGameEffects.ts
import { useEffect } from 'react';

export const useGameEffects = (gameData: ReturnType<typeof import('./useGameData').useGameData>) => {
  const { speedDrop, autoCollect, boosters, setSpeedDrop, setAutoCollect, setBoosters } = gameData;

  useEffect(() => {
    if (boosters.speed) setSpeedDrop(4);
    else setSpeedDrop(1);
  }, [boosters.speed]);

  useEffect(() => {
    if (boosters.auto) setAutoCollect(true);
    else setAutoCollect(false);
  }, [boosters.auto]);

  useEffect(() => {
    const saved = localStorage.getItem('game-state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        Object.entries(state).forEach(([key, value]) => {
          const setter = (gameData as any)[`set${key.charAt(0).toUpperCase() + key.slice(1)}`];
          if (typeof setter === 'function') setter(value);
        });
      } catch (err) {
        console.error('Failed to restore game state', err);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const toSave: Record<string, any> = {};
      Object.entries(gameData).forEach(([key, value]) => {
        if (!key.startsWith('set')) toSave[key] = value;
      });
      localStorage.setItem('game-state', JSON.stringify(toSave));
    }, 2000);
    return () => clearInterval(interval);
  }, [gameData]);
};