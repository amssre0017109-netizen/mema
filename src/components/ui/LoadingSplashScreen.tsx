import React, { useState, useEffect } from 'react';

interface LoadingSplashScreenProps {
  durationMs?: number;
  onFinish?: () => void;
}

export const LoadingSplashScreen: React.FC<LoadingSplashScreenProps> = ({
  durationMs = 2000,
  onFinish
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        if (onFinish) onFinish();
      }, 350);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center p-6 select-none bg-gradient-to-b from-[#F0F5FF] via-[#E0EAFF] to-[#DBEAFE] dark:from-[#090D16] dark:via-[#0F172A] dark:to-[#020617] transition-all duration-300 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Radial Atmosphere Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] rounded-full bg-gradient-to-tr from-[#1D4ED8]/25 via-[#2563EB]/20 to-[#609AFA]/25 blur-3xl animate-pulse" />
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[280px] h-[180px] rounded-full bg-[#1D4ED8]/10 blur-2xl" />
      </div>

      {/* Center Hero: MEMA Logo & Tagline only */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-700">
        {/* Clean Boundary-Free Stylized Gradient "M" Emblem */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-md"
          >
            <defs>
              <linearGradient id="splashMemaGrad1" x1="10" y1="38" x2="38" y2="10" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1D4ED8" />
                <stop offset="0.5" stopColor="#2563EB" />
                <stop offset="1" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="splashMemaGrad2" x1="16" y1="14" x2="32" y2="34" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563EB" />
                <stop offset="1" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>

            {/* Left Pillar */}
            <path
              d="M10 38V14C10 11.7909 11.7909 10 14 10C16.2091 10 18 11.7909 18 14V34C18 36.2091 16.2091 38 14 38C11.7909 38 10 38 10 38Z"
              fill="url(#splashMemaGrad1)"
            />

            {/* Central Chevron Bridge */}
            <path
              d="M16 16L24 28L32 16"
              stroke="url(#splashMemaGrad2)"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Right Pillar */}
            <path
              d="M38 38V14C38 11.7909 36.2091 10 34 10C31.7909 10 30 11.7909 30 14V34C30 36.2091 31.7909 38 34 38C36.2091 38 38 38 38 38Z"
              fill="url(#splashMemaGrad1)"
            />

            {/* Top Pulse Activity Beacon */}
            <circle cx="24" cy="11" r="3.5" fill="#2563EB" />
          </svg>
        </div>

        {/* Wordmark & Tagline: MEMA - find your mood */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight bg-gradient-to-r from-slate-900 via-[#1D4ED8] to-blue-600 dark:from-white dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
              MEMA
            </h1>
            <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8] dark:bg-blue-400 animate-pulse mt-1" />
          </div>

          <p className="font-mono font-extrabold uppercase tracking-[0.22em] text-xs sm:text-sm text-[#1D4ED8] dark:text-blue-400">
            - find your mood
          </p>
        </div>
      </div>
    </div>
  );
};
