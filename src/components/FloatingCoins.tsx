import React, { useEffect, useState } from 'react';

interface FloatingCoin {
  id: number;
  x: number;
  y: number;
  value: number;
}

interface FloatingCoinsProps {
  coins: FloatingCoin[];
  onAnimationComplete: (id: number) => void;
}

const FloatingCoins: React.FC<FloatingCoinsProps> = ({ coins, onAnimationComplete }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute animate-bounce-up-fade text-yellow-400 font-bold text-lg"
          style={{
            left: coin.x,
            top: coin.y,
          }}
          onAnimationEnd={() => onAnimationComplete(coin.id)}
        >
          +{coin.value}
        </div>
      ))}
    </div>
  );
};

export default FloatingCoins;