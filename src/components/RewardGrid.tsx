import React, { useEffect, useState } from 'react';

interface RewardItem {
  id: number;
  value: number;
  collected: boolean;
}

interface RewardGridProps {
  rewards: RewardItem[];
  onRewardClick: (id: number, event?: React.MouseEvent) => void;
}

interface FallingReward {
  id: number;
  value: number;
  left: number; // in %
  duration: number;
}

const RewardGrid: React.FC<RewardGridProps> = ({  }) => {
  const [fallingRewards, setFallingRewards] = useState<FallingReward[]>([]);

  // ✨ Efek bintang ketika reward diklik
  const spawnStarFall = (element: HTMLElement) => {
    const star = document.createElement('div');
    star.className = 'absolute w-4 h-4 bg-yellow-400 rounded-full shadow-lg animate-fall';
    const rect = element.getBoundingClientRect();
    star.style.left = `${rect.left + rect.width / 2}px`;
    star.style.top = `${rect.top}px`;
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 3000);
  };

  // 💫 Fungsi memunculkan 1 reward jatuh
  const spawnFallingReward = () => {
    const rewardValues = [110, 330, 880, 385, 220, 352, 220, 275, 407, 110];
    const value = rewardValues[Math.floor(Math.random() * rewardValues.length)];
    const id = Date.now() + Math.random();
    const left = Math.random() * 90; // posisinya acak
    const duration = Math.random() * 5 + 5; // durasi 5–10 detik

    setFallingRewards((prev) => [...prev, { id, value, left, duration }]);

    // ⏱️ Hapus setelah selesai animasi
    setTimeout(() => {
      setFallingRewards((prev) => prev.filter((r) => r.id !== id));
    }, duration * 1000);
  };

  // ⏲️ Auto spawn tiap 1 detik
  useEffect(() => {
    const interval = setInterval(spawnFallingReward, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFallingRewardClick = (id: number, value: number) => {
    const center = document.createElement('div');
    center.style.position = 'absolute';
    center.style.left = '50%';
    center.style.top = '50%';
    center.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(center);
    spawnStarFall(center);
    center.remove();

    setFallingRewards((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="relative w-full h-screen bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url('/bg3.png')` }}>
      {/* Reward jatuh dari atas */}
      {fallingRewards.map((reward) => (
        <div
          key={reward.id}
          className="absolute w-8 h-8 cursor-pointer z-50"
          style={{
            left: `${reward.left}%`,
            animation: `fall linear ${reward.duration}s`,
          }}
          onClick={() => handleFallingRewardClick(reward.id, reward.value)}
        >
          <div className="diamond w-8 h-8 bg-yellow-400 rounded-full shadow-md border-2 border-white"></div>
        </div>
      ))}
    </div>
  );
};

export default RewardGrid;
