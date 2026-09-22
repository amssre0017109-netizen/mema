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
    sm: { box: 'w-7 h-7', text: 'text-sm', sub: 'text-[7px]', icon: 'w-4 h-4' },
    md: { box: 'w-9 h-9 sm:w-10 sm:h-10', text: 'text-base sm:text-lg', sub: 'text-[7.5px] sm:text-[8.5px]', icon: 'w-5 h-5 sm:w-6 sm:h-6' },
    lg: { box: 'w-12 h-12', text: 'text-xl', sub: 'text-[9.5px]', icon: 'w-7 h-7' },
    xl: { box: 'w-16 h-16', text: 'text-2xl', sub: 'text-[11px]', icon: 'w-9 h-9' }
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none transition-all ${
        onClick ? 'cursor-pointer group hover:opacity-95 active:scale-95' : ''
      } ${className}`}
    >
      {/* Modern Stylized Gradient "M" Emblem */}
      <div className="relative shrink-0">
        <div
          className={`${currentSize.box} rounded-2xl bg-gradient-to-tr from-[#1E40AF] via-[#2563EB] to-[#609AFA] p-0.5 shadow-md shadow-blue-600/25 flex items-center justify-center relative overflow-hidden group-hover:shadow-blue-600/40 group-hover:scale-105 transition-all duration-300`}
        >
          {/* Subtle inner glass shimmer */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10 pointer-events-none" />

          {/* SVG Stylized "M" with Pulse Beacon */}
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full p-1 drop-shadow-xs"
          >
            <defs>
              <linearGradient id="memaGrad1" x1="6" y1="42" x2="42" y2="6" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#E0EAFF" />
              </linearGradient>
              <linearGradient id="memaGrad2" x1="16" y1="12" x2="32" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#C7D7FE" />
                <stop offset="1" stopColor="#FFFFFF" />
              </linearGradient>
              <filter id="memaGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Left Pillar */}
            <path
              d="M10 38V14C10 11.7909 11.7909 10 14 10C16.2091 10 18 11.7909 18 14V34C18 36.2091 16.2091 38 14 38C11.7909 38 10 38 10 38Z"
              fill="url(#memaGrad1)"
            />

            {/* Central Chevron Bridge (Stylized V) */}
            <path
              d="M16 16L24 28L32 16"
              stroke="url(#memaGrad2)"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Right Pillar */}
            <path
              d="M38 38V14C38 11.7909 36.2091 10 34 10C31.7909 10 30 11.7909 30 14V34C30 36.2091 31.7909 38 34 38C36.2091 38 38 38 38 38Z"
              fill="url(#memaGrad1)"
            />

            {/* Top Pulse Activity Beacon */}
            <circle cx="24" cy="11" r="3.5" fill="#FFFFFF" filter="url(#memaGlow)" />
            <circle cx="24" cy="11" r="2" fill="#1D4ED8" />
          </svg>
        </div>

        {/* Outer Activity Radar Ring Animation */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1D4ED8] ring-2 ring-white" />
        </span>
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
