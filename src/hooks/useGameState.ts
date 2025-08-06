import { useState, useCallback, useEffect, useRef } from 'react';
import { useTelegramIntegration } from './useTelegramIntegration';

interface RewardItem {
  id: number;
  value: number;
  collected: boolean;
}

interface FloatingCoin {
  id: number;
  x: number;
  y: number;
  value: number;
}

export const useGameState = () => {
  const telegram = useTelegramIntegration();
  
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [speedDuration, setSpeedDuration] = useState(1);
  const [currentLevelStars, setCurrentLevelStars] = useState(11855);
  const [targetLevelStars, setTargetLevelStars] = useState(100000);
  const [level, setLevel] = useState(1);
  const [clickPower, setClickPower] = useState(1);
  const [activeTab, setActiveTab] = useState('earn');
  const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([]);
  const [boosterActive, setBoosterActive] = useState(false);
  const [autoCollectorActive, setAutoCollectorActive] = useState(false);
  const [speedDropActive, setSpeedDropActive] = useState(false);
  const [boosterTimeLeft, setBoosterTimeLeft] = useState(0);
  const [autoCollectorTimeLeft, setAutoCollectorTimeLeft] = useState(600); // 10 minutes
  const [speedDropTimeLeft, setSpeedDropTimeLeft] = useState(600); // 10 minutes
  const [boosterMultiplier, setBoosterMultiplier] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const lastUpdateRef = useRef(Date.now());
  const autoCollectRate = 10; // coins per second
  
  // Initialize rewards with the same values as original
  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    const rewardValues = [110, 330, 880, 385, 220, 352, 220, 275, 407, 110];
    return rewardValues.map((value, index) => ({
      id: index,
      value,
      collected: false,
    }));
  });

  // Calculate progress percentage
  const progressPercent = Math.floor((currentLevelStars / targetLevelStars) * 100);

  // Load game progress on initialization
  useEffect(() => {
    if (telegram.isInitialized && !isInitialized) {
      telegram.loadGameProgress((savedData) => {
        if (savedData && savedData.user_id === telegram.userData?.id) {
          console.log('📥 Restoring saved game progress...');
          
          setTotalCoins(savedData.totalCoins || 0);
          setTotalStars(savedData.totalStars || 0);
          setCurrentLevelStars(savedData.currentLevelStars || 11855);
          setLevel(savedData.level || 1);
          setClickPower(savedData.clickPower || 1);
          setTargetLevelStars(savedData.targetLevelStars || 100000);
          
          console.log('✅ Game progress restored!');
          telegram.showAlert('🎮 Welcome back! Your progress has been restored.');
        } else {
          console.log('🆕 Starting new game...');
        }
        setIsInitialized(true);
      });
    }
  }, [telegram.isInitialized, telegram.userData, isInitialized]);

  // Auto-save game progress
  const saveGameProgress = useCallback(() => {
    if (!isInitialized) return;
    
    const gameData = {
      totalCoins,
      totalStars,
      currentLevelStars,
      level,
      clickPower,
      targetLevelStars
    };
    
    telegram.saveGameProgress(gameData);
  }, [totalCoins, totalStars, currentLevelStars, level, clickPower, targetLevelStars, isInitialized, telegram]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(saveGameProgress, 300000);
    
    const handleBeforeUnload = () => saveGameProgress();
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveGameProgress]);

  // Game loop for auto collector and booster timers
  useEffect(() => {
    const gameLoop = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      // Auto collector logic
      if (autoCollectorActive && autoCollectorTimeLeft > 0) {
        setAutoCollectorTimeLeft(prev => {
          const newTime = Math.max(0, prev - deltaTime);
          if (newTime <= 0) {
            setAutoCollectorActive(false);
          }
          return newTime;
        });
        
        const coinsToAdd = Math.floor(autoCollectRate * deltaTime);
        if (coinsToAdd > 0) {
          setTotalCoins(prev => prev + coinsToAdd);
        }
      }

      if (speedDropActive && speedDropTimeLeft > 0) {
        setSpeedDuration(2)
        setSpeedDropTimeLeft(prev => {
          const newTime = Math.max(0, prev - deltaTime);
          if (newTime <= 0) {
            setSpeedDropActive(false);
          }
          return newTime;
        });
      } else {
        setSpeedDuration(1); // <- reset kembali ke normal
      }

      // Booster timer
      if (boosterTimeLeft > 0) {
        setBoosterTimeLeft(prev => {
          const newTime = Math.max(0, prev - deltaTime);
          if (newTime <= 0) {
            setBoosterMultiplier(1);
          }
          return newTime;
        });
      }
    }, 1000);

    return () => clearInterval(gameLoop);
  }, [autoCollectorActive, autoCollectorTimeLeft, boosterTimeLeft, speedDropActive]);

  // Level up logic
  const checkLevelUp = useCallback(() => {
    if (currentLevelStars >= targetLevelStars) {
      setLevel(prev => prev + 1);
      setTotalStars(prev => prev + 10);
      setCurrentLevelStars(0);
      setTargetLevelStars(prev => Math.floor(prev * 1.5));
      
      telegram.hapticFeedback('success');
      telegram.showAlert(`🎉 Level Up! You reached level ${level + 1}!`);
    }
  }, [currentLevelStars, targetLevelStars, level, telegram]);

  useEffect(() => {
    checkLevelUp();
  }, [checkLevelUp]);

  const collectReward = useCallback((id: number, event?: React.MouseEvent) => {
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    
    const actualValue = Math.floor(randomReward.value * boosterMultiplier);

    // Update reward as collected
    setRewards(prev => prev.map(r => 
      r.id === id ? { ...r, collected: true } : r
    ));

    // Add coins and stars
    setTotalCoins(prev => prev + actualValue);
    setCurrentLevelStars(prev => prev + Math.floor(actualValue / 10));

    // Haptic feedback
    telegram.hapticFeedback('success');

    // Create floating coin animation
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const newCoin: FloatingCoin = {
        id: Date.now(),
        x: rect.left + rect.width / 2,
        y: rect.top,
        value: actualValue
      };
      setFloatingCoins(prev => [...prev, newCoin]);
    }

    // Save progress after significant actions
    setTimeout(saveGameProgress, 100);
  }, [rewards, boosterMultiplier, telegram, saveGameProgress]);

  const removeFloatingCoin = useCallback((id: number) => {
    setFloatingCoins(prev => prev.filter(coin => coin.id !== id));
  }, []);

  const toggleBooster = useCallback(() => {
    if (!boosterActive) {
      setBoosterActive(true);
      setBoosterMultiplier(2.5);
      setBoosterTimeLeft(300); // 5 minutes
      telegram.hapticFeedback('success');
      console.log("🚀 Booster started!");
    }
  }, [boosterActive, telegram]);

  const toggleAutoCollector = useCallback(() => {
    if (!autoCollectorActive) {
      setAutoCollectorActive(true);
      setAutoCollectorTimeLeft(600); // 10 minutes
      telegram.hapticFeedback('success');
      console.log("🚀 Auto Collector started!");
    }
  }, [autoCollectorActive, telegram]);

  const toggleSpeedDrop = useCallback(() => {
    console.log(speedDropActive)
    console.log(speedDropTimeLeft)
    if (!speedDropActive) {
      setSpeedDropActive(true);
      setSpeedDropTimeLeft(600); // 10 minutes
      telegram.hapticFeedback('success');
      console.log("🚀 Speed Falling started!");
    }
  }, [speedDropActive, telegram])

  const showTasksMenu = useCallback(() => {
    const tasks = [
      '📱 Share the game with 3 friends',
      '⭐ Collect 1000 stars',
      '💰 Earn 50,000 coins',
      '🎯 Reach level 5',
      '🚀 Use booster 10 times'
    ];
    
    const message = '📋 Daily Tasks:\n\n' + tasks.map((task, i) => `${i + 1}. ${task}`).join('\n');
    telegram.showAlert(message);
  }, [telegram]);

  const showUpgradeMenu = useCallback(() => {
    const upgrades = [
      '⚡ Click Power +1 (Cost: 10,000 coins)',
      '🤖 Auto Collector Speed +50% (Cost: 25,000 coins)',
      '🌟 Star Multiplier x2 (Cost: 50,000 coins)',
      '💎 Premium Rewards (Cost: 100,000 coins)'
    ];
    
    const message = '💼 Available Upgrades:\n\n' + upgrades.join('\n\n') + '\n\n💰 Your coins: ' + totalCoins.toLocaleString();
    telegram.showAlert(message);
  }, [totalCoins, telegram]);

  const showProfile = useCallback(() => {
    const userData = telegram.userData;
    
    const message = `👤 Profile\n\n` +
                   `💰 Total Coins: ${totalCoins.toLocaleString()}\n` +
                   `⭐ Total Stars: ${totalStars}\n` +
                   `🎯 Level: ${level}\n` +
                   `⚡ Click Power: ${clickPower}\n\n` +
                   (userData ? `👋 Hello ${userData.first_name}!\n` : '👋 Welcome!\n') +
                   (userData?.username ? `📱 @${userData.username}\n` : '') +
                   `🌐 Language: ${userData?.language_code || 'en'}\n` +
                   `📱 Platform: ${telegram.isInTelegram ? 'Telegram' : 'Web'}\n`;
  
    telegram.showAlert(message);
    
    // Share progress
    telegram.shareProgress({
      totalCoins,
      totalStars,
      level,
      progressPercent
    });
  }, [telegram, totalCoins, totalStars, level, clickPower, progressPercent]);

  const handleNavigation = useCallback((tab: string) => {
    setActiveTab(tab);
    telegram.hapticFeedback('light');
    
    switch(tab) {
      case 'tasks':
        showTasksMenu();
        break;
      case 'upgrade':
        showUpgradeMenu();
        break;
      case 'profile':
        showProfile();
        break;
    }
  }, [telegram, showTasksMenu, showUpgradeMenu, showProfile]);

  // Format time remaining
  const formatTimeRemaining = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    totalCoins,
    totalStars,
    currentLevelStars,
    speedDuration,
    progressPercent,
    level,
    activeTab,
    setActiveTab: handleNavigation,
    rewards,
    floatingCoins,
    boosterActive,
    autoCollectorActive,
    speedDropActive,
    speedDropTimeLeft,
    boosterTimeLeft,
    autoCollectorTimeLeft,
    showDropdown,
    setShowDropdown,
    collectReward,
    removeFloatingCoin,
    toggleBooster,
    toggleAutoCollector,
    formatTimeRemaining,
    toggleSpeedDrop,
    telegram
  };
};