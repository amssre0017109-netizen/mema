import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-sm', sub: 'text-[7px]' },
    md: { icon: 'w-8 h-8 sm:w-9 sm:h-9', text: 'text-base sm:text-lg', sub: 'text-[7.5px] sm:text-[8.5px]' },
    lg: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-[9.5px]' },
    xl: { icon: 'w-14 h-14', text: 'text-2xl', sub: 'text-[11px]' }
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none transition-all ${
        onClick ? 'cursor-pointer group hover:opacity-95 active:scale-95' : ''
      } ${className}`}
    >
      {/* Clean Boundary-Free Stylized Gradient "M" Logo Mark */}
      <div className={`relative shrink-0 ${currentSize.icon} flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="memaGradBrand1" x1="10" y1="38" x2="38" y2="10" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1D4ED8" />
              <stop offset="0.5" stopColor="#2563EB" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="memaGradBrand2" x1="16" y1="14" x2="32" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop offset="1" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>

          {/* Left Pillar */}
          <path
            d="M10 38V14C10 11.7909 11.7909 10 14 10C16.2091 10 18 11.7909 18 14V34C18 36.2091 16.2091 38 14 38C11.7909 38 10 38 10 38Z"
            fill="url(#memaGradBrand1)"
          />

          {/* Central Chevron Bridge (Stylized V) */}
          <path
            d="M16 16L24 28L32 16"
            stroke="url(#memaGradBrand2)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Pillar */}
          <path
            d="M38 38V14C38 11.7909 36.2091 10 34 10C31.7909 10 30 11.7909 30 14V34C30 36.2091 31.7909 38 34 38C36.2091 38 38 38 38 38Z"
            fill="url(#memaGradBrand1)"
          />

          {/* Top Activity Beacon Dot */}
          <circle cx="24" cy="11" r="3" fill="#2563EB" />
        </svg>
      </div>

      {/* Wordmark Typography */}
      {showText && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1">
            <span
              className={`font-black tracking-tight font-display bg-gradient-to-r from-slate-900 via-[#1D4ED8] to-blue-600 dark:from-white dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent ${currentSize.text}`}
            >
              MEMA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] dark:bg-blue-400 animate-pulse" />
          </div>
          <span
            className={`font-mono font-extrabold uppercase tracking-[0.14em] text-[#1D4ED8] dark:text-blue-400 opacity-90 mt-0.5 whitespace-nowrap ${currentSize.sub}`}
          >
            FIND YOUR MOOD
          </span>
        </div>
      )}
    </div>
  );
};
