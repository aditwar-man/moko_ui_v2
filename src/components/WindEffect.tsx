// components/WindSuctionEffect.tsx
import React from 'react';

const WindEffect: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {[...Array(30)].map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const duration = 0.6 + Math.random() * 0.5;
        const opacity = 0.05 + Math.random() * 0.1;

        return (
          <div
            key={i}
            className="absolute w-[1px] bg-white rounded-full animate-wind-line"
            style={{
              left: `${left}%`,
              top: `-${Math.random() * 100}px`,
              height: `${50 + Math.random() * 100}px`,
              opacity,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              filter: 'blur(1px)',
            }}
          />
        );
      })}
    </div>
  );
};

export default WindEffect;
