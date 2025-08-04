import React from 'react';
import { RotateCcw, Zap, TrendingUp } from 'lucide-react';

interface BoosterCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  timeRemaining: string;
  isActive: boolean;
  bgColor: string;
  iconBg: string;
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
      icon: <RotateCcw className="w-6 h-6 text-white" />,
      timeRemaining: autoCollectorActive ? `${formatTime(autoCollectorTimeLeft)} remaining` : '',
      isActive: autoCollectorActive,
      bgColor: 'bg-sky-700',
      // bgColor: 'from-teal-600 to-teal-700',
      iconBg: 'bg-[#272932]'
    },
    {
      id: 'shard-multiplier',
      title: 'Star Multiplier',
      description: '2.5x point values',
      icon: <Zap className="w-6 h-6 text-white" />,
      timeRemaining: boosterActive ? `${formatTime(boosterTimeLeft)} remaining` : '',
      isActive: boosterActive,
      bgColor: 'bg-pink-500',
      iconBg: 'bg-[#272932]'
    },
    {
      id: 'conveyor-booster',
      title: 'Speed',
      description: '',
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      timeRemaining: '6m 46s remaining',
      isActive: false,
      bgColor: 'bg-sky-600',
      iconBg: 'bg-[#272932]'
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
    <div className="p-6">
      
      <div className="grid grid-cols-3 gap-3">
        {boosters.map((booster) => (
          <button
            key={booster.id}
            onClick={() => handleBoosterClick(booster.id)}
            disabled={booster.isActive}
            className={`
              p-3 rounded-xl bg-gradient-to-r ${booster.bgColor} 
              hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200
              ${booster.isActive ? 'opacity-75 cursor-not-allowed' : 'hover:brightness-110'}
            `}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={`p-2 rounded-lg ${booster.iconBg}`}>
                {booster.icon}
              </div>
              
              <div className="text-center">
                <h3 className="text-white font-bold text-sm mb-1">{booster.title}</h3>
                <p className="text-white/80 text-xs mb-2">{booster.description}</p>
                <div className="flex flex-col items-center">
                  <span className={`text-xs font-medium ${
                    booster.isActive ? 'text-yellow-300' : 'text-white/90'
                  }`}>
                    {booster.timeRemaining}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BoosterCards;