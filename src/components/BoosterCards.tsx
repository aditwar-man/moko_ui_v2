import React from 'react';
import { RotateCcw, Zap, TrendingUp } from 'lucide-react';

interface BoosterCard {
  id: string;
  title: string;
  description: string;
  Icon: React.FC<{ className?: string }>;
  timeRemaining: string;
  isActive: boolean;
  bgColor: string;
}

interface BoosterCardsProps {
  autoCollectorActive: boolean;
  autoCollectorTimeLeft: number;
  boosterActive: boolean;
  boosterTimeLeft: number;
  formatTime: (seconds: number) => string;
  onToggleAutoCollector: () => void;
  onToggleBooster: () => void;
  onToggleConveyor: () => void;
}

const BoosterCards: React.FC<BoosterCardsProps> = ({
  autoCollectorActive,
  autoCollectorTimeLeft,
  boosterActive,
  boosterTimeLeft,
  formatTime,
  onToggleAutoCollector,
  onToggleBooster,
  onToggleConveyor
}) => {
  const boosters: BoosterCard[] = [
    {
      id: 'auto-collector',
      title: 'Auto-Collector',
      description: '',
      Icon: RotateCcw,
      timeRemaining: autoCollectorActive ? `${formatTime(autoCollectorTimeLeft)} remaining` : '',
      isActive: autoCollectorActive,
      bgColor: 'bg-sky-700'
    },
    {
      id: 'shard-multiplier',
      title: 'Multiplier',
      description: '',
      Icon: Zap,
      timeRemaining: boosterActive ? `${formatTime(boosterTimeLeft)} remaining` : '',
      isActive: boosterActive,
      bgColor: 'bg-pink-500'
    },
    {
      id: 'conveyor-booster',
      title: 'Speed',
      description: '',
      Icon: TrendingUp,
      timeRemaining: '6m 46s remaining',
      isActive: false,
      bgColor: 'bg-sky-600'
    }
  ];

  const handleBoosterClick = (id: string) => {
    switch (id) {
      case 'auto-collector':
        onToggleAutoCollector();
        break;
      case 'shard-multiplier':
        onToggleBooster();
        break;
      case 'conveyor-booster':
        onToggleConveyor();
        break;
    }
  };

  return (
    <div className="px-6 pb-4">
      <div className="grid grid-cols-3 gap-3">
        {boosters.map((booster) => (
          <button
            key={booster.id}
            onClick={() => handleBoosterClick(booster.id)}
            disabled={booster.isActive}
            className={`
              relative overflow-hidden
              h-32 w-full
              p-4 rounded-xl ${booster.bgColor}
              hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200
              ${booster.isActive ? 'opacity-75 cursor-not-allowed' : 'hover:brightness-110'}
            `}
          >
            {/* Icon as background */}
            <booster.Icon className="absolute opacity-20 w-20 h-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />

            {/* Content layer */}
            <div className="relative z-10 text-center flex flex-col items-center">
              <h3 className="text-white font-bold text-sm mb-1">{booster.title}</h3>
              <p className="text-white/80 text-xs mb-1">{booster.description}</p>
              <span className={`text-xs font-medium ${
                booster.isActive ? 'text-yellow-300' : 'text-white/90'
              }`}>
                {booster.timeRemaining}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BoosterCards;
