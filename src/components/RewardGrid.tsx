import React, { useEffect, useRef, useState } from 'react';

interface RewardItem {
  id: number;
  value: number;
  collected: boolean;
}

interface RewardGridProps {
  rewards?: RewardItem[];
  onRewardClick?: (id: number, event?: React.MouseEvent) => void;
}

interface FallingReward {
  id: number;
  value: number;
  left: number; // in %
  duration: number;
}

const RewardGrid: React.FC<RewardGridProps> = () => {
  const [fallingRewards, setFallingRewards] = useState<FallingReward[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  // Bintang jatuh ke tengah
  const spawnStarFall = (element: HTMLElement) => {
    if (!gridRef.current) return;

    const grid = gridRef.current;
    const gridRect = grid.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const star = document.createElement('div');
    star.className = 'absolute w-4 h-4 bg-yellow-400 rounded-full animate-fall pointer-events-none';
    star.style.left = `${elementRect.left - gridRect.left + elementRect.width / 2}px`;
    star.style.top = `${elementRect.top - gridRect.top}px`;

    grid.appendChild(star);
    setTimeout(() => star.remove(), 3000);
  };

  const spawnFallingReward = () => {
    const rewardValues = [110, 330, 880, 385, 220, 352, 275, 407];
    const value = rewardValues[Math.floor(Math.random() * rewardValues.length)];
    const id = Date.now() + Math.random();
    const left = Math.random() * 90;
    const duration = Math.random() * 5 + 5;

    setFallingRewards((prev) => [...prev, { id, value, left, duration }]);

    setTimeout(() => {
      setFallingRewards((prev) => prev.filter((r) => r.id !== id));
    }, duration * 1000);
  };

  useEffect(() => {
    const interval = setInterval(spawnFallingReward, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFallingRewardClick = (id: number, value: number) => {
    if (!gridRef.current) return;

    const dummyCenter = document.createElement('div');
    dummyCenter.style.position = 'absolute';
    dummyCenter.style.left = '50%';
    dummyCenter.style.top = '50%';
    dummyCenter.style.transform = 'translate(-50%, -50%)';

    gridRef.current.appendChild(dummyCenter);
    spawnStarFall(dummyCenter);
    dummyCenter.remove();

    setFallingRewards((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="relative w-full h-full flex justify-center px-4">
      <div
        ref={gridRef}
        className="relative w-full max-w-[700px] h-[65vh] p-4 rounded-xl overflow-hidden"
      >
        {/* Bintang-bintang jatuh */}
        {fallingRewards.map((reward) => (
          <div
            key={reward.id}
            className="absolute w-8 h-8 z-50"
            style={{
              left: `${reward.left}%`,
              animation: `fall ${reward.duration}s linear`,
            }}
            onClick={() => handleFallingRewardClick(reward.id, reward.value)}
          >
            <div className="diamond w-8 h-8" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardGrid;
