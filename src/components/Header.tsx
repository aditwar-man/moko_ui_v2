import React, { useRef, useLayoutEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  totalCoins: number;
  totalCoinRef: React.RefObject<HTMLDivElement>;
  totalStars: number;
  currentLevelStars: number;
  progressPercent: number;
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onNavigate: (tab: string) => void;
  footerRef: React.RefObject<HTMLDivElement>; // ⬅ tambahan
}

const Header: React.FC<HeaderProps> = ({
  totalCoins,
  totalCoinRef,
  totalStars,
  showDropdown,
  onToggleDropdown,
  onNavigate,
  footerRef
}) => {
  const navItems = [
    { id: 'leaderboard', label: 'LEADERBOARD', icon: '/icons/leaderboard.svg' },
    { id: 'upgrade', label: 'UPGRADE', icon: '/icons/upgrade.svg' },
    { id: 'tg_news', label: 'TC NEWS', icon: '/icons/tg_news.svg' },
    { id: 'friends', label: 'FRIENDS', icon: '/icons/friends.svg' },
  ];

  const [dropdownHeight, setDropdownHeight] = useState<number>(0);

  useLayoutEffect(() => {
    if (footerRef.current) {
      const footerTop = footerRef.current.getBoundingClientRect().top;
      console.log(footerRef)
      setDropdownHeight(footerTop - 70); // padding 20px
    }
  }, [showDropdown, footerRef]);

  return (
    <div className="bg-shadow p-4 shadow-lg relative z-50">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        {/* Coins */}
        <div className="flex items-center gap-2 bg-[#ce8539] rounded-full px-2 py-1">
          <img src="/bintang.png" alt="Star" className="w-6 h-6 object-contain" />
          <span ref={totalCoinRef} className="text-white font-bold text-sm leading-none">
            {totalCoins.toLocaleString()}
          </span>
          <span className="text-white font-bold text-sm leading-none">/ 100,000</span>
        </div>

        {/* Stars + Menu */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#ce8539] rounded-full px-2 py-1">
            <img src="/icon_moko.png" alt="Moko" className="w-6 h-6 object-contain" />
            <span className="text-white font-bold text-sm">1M</span>
          </div>
          <button
            onClick={onToggleDropdown}
            className="bg-[#ce8539] rounded-full p-2 hover:bg-black/30 transition-colors"
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
        <div
          className="fixed left-4 right-4 top-[70px] bg-gradient-to-b from-[#243d69] to-[#305ea8] rounded-2xl shadow-2xl z-[100] animate-slideDown p-4"
          style={{ height: dropdownHeight }}
        >
          {/* Moko Image + Username */}
          {/* <div className="flex flex-col items-center -mt-10 mb-4 relative z-10">
            <img
              src="/icon_moko.png"
              alt="Moko"
              className="w-24 h-24 object-contain drop-shadow-lg"
            />
            <span className="text-[14px] font-bold text-color-[#305ea8] mt-1">
              @Lalapopo
            </span>
          </div> */}

          {/* Grid Menu + Wallet */}
          <div className="grid grid-cols-2 gap-2">
            {navItems.slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onToggleDropdown();
                }}
                className="flex flex-col items-center justify-center p-5 m-1 rounded-xl bg-white shadow hover:scale-105 transition-transform border-4 border-[#c4cef2]"
              >
                <img src={item.icon} alt={item.label} className="w-10 h-10 object-contain mb-2" />
                <span className="text-[13px] font-bold text-gray-800">{item.label}</span>
              </button>
            ))}

            {/* Wallet Connected */}
            <button
              className="col-span-2 flex items-center justify-center p-2 rounded-xl bg-green-100 border-4 border-[#305ea8] shadow hover:scale-105 transition-transform"
            >
              <img src="/icons/wallet.svg" alt="" className="w-10 h-10 object-contain mr-2" />
              <span className="text-[14px] font-bold text-green-800">
                Wallet Connected
              </span>
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default Header;
