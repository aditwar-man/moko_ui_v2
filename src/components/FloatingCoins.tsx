import React, { useEffect, useRef } from 'react';

interface FloatingCoin {
  id: number;
  x: number;
  y: number;
  value: number;
}

interface FloatingCoinsProps {
  coins: FloatingCoin[];
  onAnimationComplete: (id: number) => void;
  targetRef: React.RefObject<HTMLDivElement>;
}

const FloatingCoins: React.FC<FloatingCoinsProps> = ({ coins, onAnimationComplete, targetRef }) => {
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {coins.map((coin) => (
        <AnimatedCoin
          key={coin.id}
          coin={coin}
          targetRef={targetRef}
          onAnimationComplete={onAnimationComplete}
        />
      ))}
    </div>
  );
};

const AnimatedCoin: React.FC<{
  coin: FloatingCoin;
  targetRef: React.RefObject<HTMLDivElement>;
  onAnimationComplete: (id: number) => void;
}> = ({ coin, targetRef, onAnimationComplete }) => {
  const coinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const coinEl = coinRef.current;
    const targetEl = targetRef.current;

    if (!coinEl || !targetEl) return;

    const coinRect = coinEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const dx =
      targetRect.left + targetRect.width / 2 -
      (coinRect.left + coinRect.width / 2);
    const dy =
      targetRect.top + targetRect.height / 2 -
      (coinRect.top + coinRect.height / 2);

    // Tunggu 2 frame untuk memastikan elemen muncul dulu
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        coinEl.style.transform = `translate(${dx}px, ${dy}px) scale(0.5)`;
        coinEl.style.opacity = '0';
      });
    });

    const timeout = setTimeout(() => {
      onAnimationComplete(coin.id);
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={coinRef}
      className="absolute text-yellow-400 font-bold text-lg transition-all duration-700 ease-in-out"
      style={{
        left: coin.x,
        top: coin.y,
        transform: 'translate(0, 0)',
        opacity: 1,
      }}
    >
      +{coin.value}
    </div>
  );
};

export default FloatingCoins;
