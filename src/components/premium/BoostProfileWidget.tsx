import React from 'react';
import { Sparkles, Zap, Clock, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BoostProfileWidget: React.FC = () => {
  const {
    isProfileBoostActive,
    profileBoostSecondsLeft,
    triggerProfileBoost,
    isPremium,
    setIsPremiumModalOpen
  } = useApp();

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  if (isProfileBoostActive) {
    return (
      <div className="bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-3xl p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs animate-bounce">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 dark:text-amber-300">
                ⚡ Priority Boost Active
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-amber-100">
              Your requests & profile are pinned at the top of the feed!
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 text-xs font-black text-amber-900 dark:text-amber-300 shrink-0">
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>{formatTime(profileBoostSecondsLeft)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#F8FBFF] dark:bg-slate-800 text-[#172033] dark:text-white border border-[#DCE8F7] dark:border-slate-700 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h4 className="font-extrabold text-sm text-[#172033] dark:text-white">Boost Profile & Need Visibility</h4>
          <p className="text-xs text-[#64748B] dark:text-slate-400">
            Pin your sports, creative, or project requests to the top of the feed.
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          if (isPremium) {
            triggerProfileBoost();
          } else {
            setIsPremiumModalOpen(true);
          }
        }}
        className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-full shadow-xs flex items-center justify-center gap-1.5 shrink-0 transition-all"
      >
        <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
        <span>{isPremium ? 'Boost Now' : 'Unlock Boost'}</span>
      </button>
    </div>
  );
};
