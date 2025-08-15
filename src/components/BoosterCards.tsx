import React from 'react';
import { cn } from '../lib/utils';
import {
  MousePointerClick,
  Percent,
  FastForward,
} from 'lucide-react';

interface BoosterCardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  time: string;
  isActive: boolean;
  gradient: string;
  onClick: () => void;
}

const BoosterCard: React.FC<BoosterCardProps> = ({
  title,
  icon,
  time,
  isActive,
  gradient,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isActive}
      className={cn(
        'relative rounded-2xl h-32 w-full p-2 flex flex-col items-center justify-center text-center transition-all duration-200 overflow-hidden',
        gradient,
        isActive ? 'cursor-not-allowed grayscale opacity-70' : 'hover:scale-[1.05] active:scale-95'
      )}
    >
      {/* Icon */}
      <div className="w-10 h-10 mb-2">
        {icon}
      </div>

      {/* Title */}
      <div className="text-xs  text-quick font-bold text-black bg-white/80 rounded-full px-3 py-[2px] shadow-inner">
        {title}
      </div>

      {/* Time */}
      {time && (
        <div className="text-[11px] mt-1 font-semibold text-gray-700 bg-white/60 px-2 py-[1px] rounded-full shadow-sm">
          {time}
        </div>
      )}
    </button>
  );
};

interface BoosterCardsProps {
  autoCollectorActive: boolean;
  speedDropActive: boolean;
  autoCollectorTimeLeft: number;
  speedDropTimeLeft: number;
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
  speedDropActive,
  speedDropTimeLeft,
  boosterActive,
  boosterTimeLeft,
  formatTime,
  onToggleAutoCollector,
  onToggleBooster,
  onToggleConveyor,
}) => {
  const multiplierValue = 2.5; // bisa dari props/state

  const boosters = [
    {
      id: 'auto-collector',
      title: 'AUTO',
      icon: <MousePointerClick className="w-full h-full" color="#facc15" strokeWidth={2.5} />,
      time: autoCollectorActive ? formatTime(autoCollectorTimeLeft) : '',
      isActive: autoCollectorActive,
      gradient: 'bg-gradient-to-br from-yellow-100 via-yellow-200 to-amber-200',
      onClick: onToggleAutoCollector,
    },
    {
      id: 'shard-multiplier',
      title: 'MULTIPLIER',
      icon: (
        <div className="text-xl font-black text-purple-600 drop-shadow-md">
          {multiplierValue}x
        </div>
      ),
      time: boosterActive ? formatTime(boosterTimeLeft) : '',
      isActive: boosterActive,
      gradient: 'bg-gradient-to-br from-pink-100 via-fuchsia-200 to-violet-200',
      onClick: onToggleBooster,
    },
    {
      id: 'conveyor-booster',
      title: 'FASTER',
      icon: <FastForward className="w-full h-full" color="#38bdf8" strokeWidth={2.5} />,
      time: speedDropActive ? formatTime(speedDropTimeLeft) : '',
      isActive: speedDropActive,
      gradient: 'bg-gradient-to-br from-blue-100 via-sky-200 to-indigo-200',
      onClick: onToggleConveyor,
    },
  ];

  return (
    <div className="px-3 pb-6 mt-2">
      <div className="grid grid-cols-3 gap-4">
        {boosters.map((booster) => (
          <BoosterCard key={booster.id} {...booster} />
        ))}
      </div>
    </div>
  );
};

export default BoosterCards;
