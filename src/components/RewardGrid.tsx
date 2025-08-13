import React, { useEffect, useRef, useState, useCallback } from 'react';

interface RewardItem {
  id: number;
  value: number;
  collected: boolean;
}

interface RewardGridProps {
  coinTargetRef: React.RefObject<HTMLDivElement>;
  rewards?: RewardItem[];
  speedDrop: number;
  onRewardClick: (id: number, event: React.MouseEvent<HTMLDivElement> | null) => void;
  autoCollect: boolean;
}

interface FallingReward {
  visualId: string;
  rewardId: number;
  value: number;
  left: number;
  duration: number;
}

const RewardGrid: React.FC<RewardGridProps> = ({
  coinTargetRef,
  rewards = [],
  speedDrop,
  onRewardClick,
  autoCollect,
}) => {
  const [fallingRewards, setFallingRewards] = useState<FallingReward[]>([]);
  const [autoCollectingIds, setAutoCollectingIds] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  const removeReward = useCallback((visualId: string) => {
    setFallingRewards(prev => prev.filter(r => r.visualId !== visualId));
    setAutoCollectingIds(prev => {
      const copy = new Set(prev);
      copy.delete(visualId);
      return copy;
    });
  }, []);

  const flyToTarget = (startEl: HTMLDivElement) => {
    const startRect = startEl.getBoundingClientRect();
    const targetRect = coinTargetRef.current?.getBoundingClientRect();
    if (!targetRect) return;

    const floating = document.createElement('div');
    floating.className = 'diamond fixed w-6 h-6 pointer-events-none';
    floating.style.left = `${startRect.left}px`;
    floating.style.top = `${startRect.top}px`;
    floating.style.zIndex = '9999';
    document.body.appendChild(floating);

    const deltaX = targetRect.left - startRect.left;
    const deltaY = targetRect.top - startRect.top;

    floating.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${deltaX}px, ${deltaY}px) scale(0.5)`, opacity: 0.2 },
    ], {
      duration: 600,
      easing: 'ease-in-out',
    });

    setTimeout(() => {
      floating.remove();

      if (coinTargetRef.current) {
        const targetEl = coinTargetRef.current;
        targetEl.classList.add("blink-neon");
        setTimeout(() => targetEl.classList.remove("blink-neon"), 600);
      }
    }, 600);
  };

  const spawnFallingReward = useCallback(() => {
    if (rewards.length === 0) return;

    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    const left = Math.random() * 90;
    const baseDuration = 7 / speedDrop;
    const duration = baseDuration * (0.8 + Math.random() * 0.4);
    const visualId = `${reward.id}-${Date.now()}-${Math.random()}`;

    const newReward: FallingReward = {
      visualId,
      rewardId: reward.id,
      value: reward.value,
      left,
      duration,
    };

    setFallingRewards(prev => [...prev, newReward]);

    if (autoCollect) {
      // const collectDelay = Math.min(800, 1000);
      setAutoCollectingIds(prev => new Set(prev).add(visualId));

      setTimeout(() => {
        const el = document.getElementById(visualId);
        if (el instanceof HTMLDivElement) flyToTarget(el);

        onRewardClick(reward.id, null);
        removeReward(visualId);
      }, 1860);
    }

    setTimeout(() => removeReward(visualId), duration * 1000);
  }, [rewards, speedDrop, autoCollect, onRewardClick, removeReward, coinTargetRef]);

  const handleRewardClick = useCallback((visualId: string, rewardId: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (autoCollectingIds.has(visualId)) return;
    removeReward(visualId);
    onRewardClick(rewardId, e);
  }, [autoCollectingIds, removeReward, onRewardClick]);

  useEffect(() => {
     let interval: ReturnType<typeof setInterval>;

    // if (speedDrop > 1) {
    //   interval = setInterval(() => {
    //     const spawnCount = Math.floor(Math.random() * 3) + 3; // 3–5 bintang
    //     for (let i = 0; i < spawnCount; i++) {
    //       setTimeout(() => {
    //         spawnFallingReward();
    //       }, i * 300);
    //     }
    //   }, 500); // spawn batch setiap 600ms
    // } else {
    // }
    interval = setInterval(spawnFallingReward, 1000 / speedDrop);

    return () => clearInterval(interval);
  }, [spawnFallingReward, speedDrop]);

  return (
    <div className="relative w-full h-full flex justify-center px-4">
      <div
        ref={gridRef}
        className="relative w-full max-w-[700px] h-[65vh] p-4 overflow-hidden"
      >
        {fallingRewards.map(reward => (
          <div
            id={reward.visualId}
            key={reward.visualId}
            className="absolute w-8 h-8"
            style={{
              left: `${reward.left}%`,
              animation: `fall ${reward.duration}s linear`,
            }}
            onClick={(e) => handleRewardClick(reward.visualId, reward.rewardId, e)}
          >
            <div className="diamond" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardGrid;
