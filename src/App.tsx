import React from 'react';
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
    boosterTimeLeft,
    autoCollectorTimeLeft,
    showDropdown,
    setShowDropdown,
    collectReward,
    removeFloatingCoin,
    toggleBooster,
    toggleAutoCollector,
    formatTimeRemaining
  } = useGameState();

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  const handleToggleConveyor = () => {
    console.log('Conveyor booster activated!');
    // Implement conveyor booster logic here
  };

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col">
      {/* Header */}
      <Header
        totalCoins={totalCoins}
        totalStars={totalStars}
        currentLevelStars={currentLevelStars}
        progressPercent={progressPercent}
        showDropdown={showDropdown}
        onToggleDropdown={handleToggleDropdown}
        onNavigate={handleNavigate}
      />

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-between bg-[#272932] overflow-hidden">
        {activeTab === 'earn' && (
          <>
            <RewardGrid
              rewards={rewards}
              onRewardClick={(id) => collectReward(id)}
            />
            <BoosterCards
              autoCollectorActive={autoCollectorActive}
              autoCollectorTimeLeft={autoCollectorTimeLeft}
              boosterActive={boosterActive}
              boosterTimeLeft={boosterTimeLeft}
              formatTime={formatTimeRemaining}
              onToggleAutoCollector={toggleAutoCollector}
              onToggleBooster={toggleBooster}
              onToggleConveyor={handleToggleConveyor}
            />
          </>
        )}

        {activeTab === 'tasks' && (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Tasks</h2>
            <p className="text-white/70">Complete tasks to earn more rewards!</p>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Friends</h2>
            <p className="text-white/70">Invite friends to get bonus rewards!</p>
          </div>
        )}

        {activeTab === 'upgrade' && (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Upgrade</h2>
            <p className="text-white/70">Upgrade your tools for better rewards!</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p className="text-white/70">View your stats and achievements!</p>
          </div>
        )}
      </div>

      {/* Floating Coins Animation */}
      <FloatingCoins
        coins={floatingCoins}
        onAnimationComplete={removeFloatingCoin}
      />
    </div>
  );
}

export default App;
