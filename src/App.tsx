import {useRef} from 'react';
import Header from './components/Header';
import RewardGrid from './components/RewardGrid';
import BoosterCards from './components/BoosterCards';
import FloatingCoins from './components/FloatingCoins';
import { useGameState } from './hooks/useGameState';

function App() {
  const {
    totalCoins,
    totalStars,
    currentLevelStars,
    progressPercent,
    activeTab,
    setActiveTab,
    rewards,
    floatingCoins,
    boosterActive,
    autoCollectorActive,
    speedDropActive,
    speedDropTimeLeft,
    boosterTimeLeft,
    autoCollectorTimeLeft,
    showDropdown,
    speedDuration,
    setShowDropdown,
    collectReward,
    removeFloatingCoin,
    toggleBooster,
    toggleAutoCollector,
    toggleSpeedDrop,
    formatTimeRemaining
  } = useGameState();

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  const totalCoinRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/bg4.png')" }}
      />

      {/* Layer atas semua konten */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <Header
          totalCoins={totalCoins}
          totalCoinRef={totalCoinRef}
          totalStars={totalStars}
          currentLevelStars={currentLevelStars}
          progressPercent={progressPercent}
          showDropdown={showDropdown}
          onToggleDropdown={handleToggleDropdown}
          onNavigate={handleNavigate}
        />
        
        {/* Main Game Area */}
        <div className="flex-1 flex flex-col justify-between">
          {activeTab === 'earn' && (
            <div className='mt-4'>
              <RewardGrid
                rewards={rewards}
                speedDrop={speedDuration}
                onRewardClick={(id, event) => collectReward(id, event)}
              />
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="p-6 text-center text-white/70">
              <h2 className="text-2xl font-bold mb-4 text-white">Tasks</h2>
              Complete tasks to earn more rewards!
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="p-6 text-center text-white/70">
              <h2 className="text-2xl font-bold mb-4 text-white">Friends</h2>
              Invite friends to get bonus rewards!
            </div>
          )}

          {activeTab === 'upgrade' && (
            <div className="p-6 text-center text-white/70">
              <h2 className="text-2xl font-bold mb-4 text-white">Upgrade</h2>
              Upgrade your tools for better rewards!
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-6 text-center text-white/70">
              <h2 className="text-2xl font-bold mb-4 text-white">Profile</h2>
              View your stats and achievements!
            </div>
          )}
        </div>
        
        {/* Booster Cards */}
        {activeTab === 'earn' && (
          
          <div className="fixed bottom-4 left-0 w-full flex justify-center gap-4 z-50 px-4">
            <BoosterCards
              autoCollectorActive={autoCollectorActive}
              autoCollectorTimeLeft={autoCollectorTimeLeft}
              speedDropActive={speedDropActive}
              speedDropTimeLeft={speedDropTimeLeft}
              boosterActive={boosterActive}
              boosterTimeLeft={boosterTimeLeft}
              formatTime={formatTimeRemaining}
              onToggleAutoCollector={toggleAutoCollector}
              onToggleBooster={toggleBooster}
              onToggleConveyor={toggleSpeedDrop}
            />
          </div>
        )}

        {/* {speedDropActive && <WindEffect />} */}

        {/* Floating Coins Animation */}
        <FloatingCoins
          coins={floatingCoins}
          onAnimationComplete={(id) => {
            removeFloatingCoin(id);

            if (totalCoinRef.current) {
              const el = totalCoinRef.current;
              el.classList.add("blink-neon");

              // Hapus efek setelah selesai
              setTimeout(() => {
                el.classList.remove("blink-neon");
              }, 700); // sedikit lebih lama dari 0.6s animasi
            }
          }}
          targetRef={totalCoinRef}
        />
      </div>
    </div>
  );
}

export default App;
