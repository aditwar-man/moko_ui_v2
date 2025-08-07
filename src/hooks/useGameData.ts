import { useState } from 'react';
import { RewardItem, BoosterType } from '@/types/game';

export const useGameData = () => {
  const [coins, setCoins] = useState(0);
  const [stars, setStars] = useState(0);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [collectedRewards, setCollectedRewards] = useState<RewardItem[]>([]);
  const [speedDrop, setSpeedDrop] = useState(1);
  const [autoCollect, setAutoCollect] = useState(false);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [boosters, setBoosters] = useState<Record<BoosterType, boolean>>({
    speed: false,
    auto: false
  });
  const [boosterCount, setBoosterCount] = useState<Record<BoosterType, number>>({
    speed: 3,
    auto: 3
  });
  const [hudRef, setHudRef] = useState<HTMLDivElement | null>(null);

  return {
    coins, setCoins,
    stars, setStars,
    rewards, setRewards,
    collectedRewards, setCollectedRewards,
    speedDrop, setSpeedDrop,
    autoCollect, setAutoCollect,
    level, setLevel,
    progress, setProgress,
    boosters, setBoosters,
    boosterCount, setBoosterCount,
    hudRef, setHudRef,
  };
};