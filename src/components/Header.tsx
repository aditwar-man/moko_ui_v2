import React from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  totalCoins: number;
  totalStars: number;
  currentLevelStars: number;
  progressPercent: number;
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onNavigate: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  totalCoins,
  totalStars,
  currentLevelStars,
  progressPercent,
  showDropdown,
  onToggleDropdown,
  onNavigate
}) => {
  const navItems = [
    { id: 'tasks', label: '📝 Tasks', description: 'Complete daily tasks' },
    { id: 'friends', label: '👥 Friends', description: 'Invite friends for rewards' },
    { id: 'upgrade', label: '📈 Upgrade', description: 'Upgrade your tools' },
    { id: 'profile', label: '👤 Profile', description: 'View your stats' },
  ];

  return (
    <div className="bg-[#272932] p-4 shadow-lg relative z-50">
      {/* Top Header: Stats & Menu */}
      <div className="flex justify-between items-center">
        
        {/* Coins */}
        <div className="flex items-center gap-2 bg-stone-950 rounded-full px-2 py-1">
          <img
              src="../../public/bintang.png"
              alt="Moko"
              className="w-6 h-6 object-contain"
            />
          <span className="text-white font-bold text-sm leading-none">
            {totalCoins.toLocaleString()}
          </span>
          <span className="text-white font-bold text-sm leading-none">/ 100,000</span>
        </div>

        {/* Stars + Menu */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-stone-950 rounded-full px-2 py-1">
            <img
              src="../../public/icon_moko.png"
              alt="Moko"
              className="w-6 h-6 object-contain"
            />
            <span className="text-white font-bold text-sm text-base">
              {/* {totalStars.toLocaleString()} */}
              1M
            </span>
          </div>

          <button
            onClick={onToggleDropdown}
            className="bg-blue-950 rounded-full p-2 hover:bg-black/30 transition-colors"
          >
            {showDropdown ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Dropdown Navigation */}
      {showDropdown && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 z-50">
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onToggleDropdown();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-left"
              >
                <span className="text-2xl">{item.label.split(' ')[0]}</span>
                <div>
                  <div className="text-white font-medium">
                    {item.label.substring(2)}
                  </div>
                  <div className="text-gray-400 text-sm">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
