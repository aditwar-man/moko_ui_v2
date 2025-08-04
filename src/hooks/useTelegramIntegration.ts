import { useState, useEffect, useCallback } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  showAlert: (message: string) => void;
  showConfirm: (message: string, callback: (result: boolean) => void) => void;
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
  };
  MainButton: {
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    color: string;
    textColor: string;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  CloudStorage?: {
    setItem: (key: string, value: string, callback?: (error: any, success: boolean) => void) => void;
    getItem: (key: string, callback: (error: any, value: string | null) => void) => void;
    removeItem: (key: string, callback?: (error: any, success: boolean) => void) => void;
  };
  initData: string;
  initDataUnsafe?: {
    user?: TelegramUser;
  };
  version: string;
  platform: string;
  themeParams: Record<string, string>;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const useTelegramIntegration = () => {
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [userData, setUserData] = useState<TelegramUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    const initTelegram = async () => {
      if (tg) {
        console.log('🚀 Initializing Telegram Mini App...');
        
        setIsInTelegram(true);
        setUserData(tg.initDataUnsafe?.user || null);
        
        console.log('📱 Telegram WebApp Info:');
        console.log('- Version:', tg.version);
        console.log('- Platform:', tg.platform);
        console.log('- User:', tg.initDataUnsafe?.user);
        
        // Initialize Telegram WebApp
        tg.ready();
        
        // Configure the app
        tg.expand();
        tg.setHeaderColor('#1e1b4b');
        tg.setBackgroundColor('#1e1b4b');
        tg.BackButton.hide();
        tg.enableClosingConfirmation();
        
        console.log('✅ Telegram Mini App initialized successfully!');
      } else {
        console.log('⚠️ Not running in Telegram - Demo mode');
        // Setup demo user
        setUserData({
          id: 123456789,
          first_name: 'Demo User',
          username: 'demo_user',
          language_code: 'en'
        });
      }
      
      setIsInitialized(true);
    };

    initTelegram();
  }, [tg]);

  const showAlert = useCallback((message: string) => {
    if (tg) {
      tg.showAlert(message);
    } else {
      alert(message);
    }
  }, [tg]);

  const showConfirm = useCallback((message: string, callback: (result: boolean) => void) => {
    if (tg) {
      tg.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      callback(result);
    }
  }, [tg]);

  const hapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' = 'medium') => {
    if (tg?.HapticFeedback) {
      try {
        switch (type) {
          case 'light':
          case 'medium':
          case 'heavy':
            tg.HapticFeedback.impactOccurred(type);
            break;
          case 'success':
          case 'error':
          case 'warning':
            tg.HapticFeedback.notificationOccurred(type);
            break;
        }
      } catch (error) {
        console.log('Haptic feedback not available:', error);
      }
    }
  }, [tg]);

  const saveGameProgress = useCallback((gameData: any) => {
    const data = {
      ...gameData,
      user_id: userData?.id,
      timestamp: Date.now()
    };
    
    if (tg?.CloudStorage && tg.version && parseFloat(tg.version) >= 6.1) {
      tg.CloudStorage.setItem('game_progress', JSON.stringify(data), (error, success) => {
        if (error) {
          console.error('Failed to save game progress:', error);
        } else {
          console.log('✅ Game progress saved to cloud');
        }
      });
    } else {
      // Fallback to localStorage
      try {
        localStorage.setItem('tg_game_progress', JSON.stringify(data));
        console.log('✅ Game progress saved to localStorage');
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }
  }, [tg, userData]);

  const loadGameProgress = useCallback((callback: (data: any) => void) => {
    if (tg?.CloudStorage && tg.version && parseFloat(tg.version) >= 6.1) {
      tg.CloudStorage.getItem('game_progress', (error, data) => {
        if (error) {
          console.error('Failed to load game progress:', error);
          callback(null);
        } else {
          try {
            const gameData = data ? JSON.parse(data) : null;
            console.log('📥 Game progress loaded from cloud:', gameData);
            callback(gameData);
          } catch (parseError) {
            console.error('Failed to parse game progress:', parseError);
            callback(null);
          }
        }
      });
    } else {
      // Fallback to localStorage
      try {
        const data = localStorage.getItem('tg_game_progress');
        const gameData = data ? JSON.parse(data) : null;
        console.log('📥 Game progress loaded from localStorage:', gameData);
        callback(gameData);
      } catch (error) {
        console.error('Failed to load from localStorage:', error);
        callback(null);
      }
    }
  }, [tg]);

  const shareProgress = useCallback((gameStats: any) => {
    const userName = userData?.first_name || 'Player';
    const message = `🌟 ${userName} is collecting stars!\n\n` +
                   `💰 Coins: ${gameStats.totalCoins.toLocaleString()}\n` +
                   `⭐ Stars: ${gameStats.totalStars}\n` +
                   `🎯 Level: ${gameStats.level}\n` +
                   `📊 Progress: ${gameStats.progressPercent}%\n\n` +
                   `🚀 Join the Star Collector game!`;
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(message + '\n\n' + window.location.href);
      showAlert('📋 Progress copied to clipboard!\nShare it in any chat.');
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = message + '\n\n' + window.location.href;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      showAlert('📋 Progress copied to clipboard!');
    }
    
    hapticFeedback('success');
  }, [userData, showAlert, hapticFeedback]);

  return {
    isInTelegram,
    userData,
    isInitialized,
    showAlert,
    showConfirm,
    hapticFeedback,
    saveGameProgress,
    loadGameProgress,
    shareProgress
  };
};