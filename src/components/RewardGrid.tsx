import React, { useEffect, useRef, useState } from 'react';
import { useGameState } from '../hooks/useGameState';

interface RewardItem {
  id: number;
  value: number;
  collected: boolean;
}

interface RewardGridProps {
  rewards?: RewardItem[];
  speedDrop: number;
  onRewardClick: (id: number, event: React.MouseEvent<HTMLDivElement>) => void;
}

interface FallingReward {
  visualId: string;   // unik untuk React rendering
  rewardId: number;   // id asli untuk logic reward
  value: number;
  left: number;       // dalam persen
  duration: number;
}

const RewardGrid: React.FC<RewardGridProps> = ({ rewards = [], speedDrop, onRewardClick }) => {
  const [fallingRewards, setFallingRewards] = useState<FallingReward[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  const spawnFallingReward = () => {
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    const left = Math.random() * 90;

    const baseDuration = 7 / speedDrop;
    const duration = baseDuration * (0.8 + Math.random() * 0.4); // ±20%

    const visualId = `${reward.id}-${Date.now()}-${Math.random()}`;

    setFallingRewards(prev => [
      ...prev,
      {
        visualId,
        rewardId: reward.id,
        value: reward.value,
        left,
        duration
      }
    ]);

    setTimeout(() => {
      setFallingRewards(prev => prev.filter(r => r.visualId !== visualId));
    }, duration * 1000);
  };

  const handleFallingRewardClick = (visualId: string, rewardId: number, e: React.MouseEvent<HTMLDivElement>) => {
    setFallingRewards(prev => prev.filter(r => r.visualId !== visualId));
    onRewardClick(rewardId, e);
  };

  useEffect(() => {
    const interval = setInterval(spawnFallingReward, 1000 / speedDrop);
    return () => clearInterval(interval);
  }, [rewards, speedDrop]);

  return (
    <div className="relative w-full h-full flex justify-center px-4">
      <div
        ref={gridRef}
        className="relative w-full max-w-[700px] h-[65vh] p-4 overflow-hidden"
      >
        {fallingRewards.map((reward) => (
          <div
            key={reward.visualId}
            className="absolute w-8 h-8 z-50"
            style={{
              left: `${reward.left}%`,
              animation: `fall ${reward.duration}s linear`,
            }}
            onClick={(e) => handleFallingRewardClick(reward.visualId, reward.rewardId, e)}
          >
            <div className="diamond " />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardGrid;
