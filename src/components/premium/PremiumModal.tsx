import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  Zap,
  ArrowRight,
  Crown,
  ShieldCheck,
  Flame,
  Star,
  Layers,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUBSCRIPTION_PLANS } from '../../services/subscriptionService';
import { FeatureComparisonTable } from './FeatureComparisonTable';

export const PremiumModal: React.FC = () => {
  const {
    isPremiumModalOpen,
    setIsPremiumModalOpen,
    openCheckoutForPlan,
    isPremium,
    isTrial
  } = useApp();

  const [activeTab, setActiveTab] = useState<'plans' | 'comparison'>('plans');

  if (!isPremiumModalOpen) return null;

  const defaultMonthlyPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'monthly_89') || SUBSCRIPTION_PLANS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-[2.5rem] max-w-2xl w-full p-5 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-5 text-[#172033] dark:text-slate-100">
        <button
          onClick={() => setIsPremiumModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#F8FBFF] dark:bg-slate-800 text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white border border-[#DCE8F7] dark:border-slate-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2 sm:pt-0">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>MEMA VIP PREMIUM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-[#172033] dark:text-white leading-tight">
            Unlock Unlimited Campus Superpowers
          </h2>
          <p className="text-xs text-[#64748B] dark:text-slate-400 max-w-md mx-auto">
            Unlimited activity posts, direct chat & contact, VIP star badge, 10x visibility, and instant activity reservations.
          </p>
        </div>

        {/* View Switcher Segmented Control */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F8FBFF] dark:bg-slate-850 rounded-2xl border border-[#DCE8F7] dark:border-slate-800 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('plans')}
            className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'plans'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Membership Plans</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'comparison'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Free vs Premium (15 Perks)</span>
          </button>
        </div>

        {/* TAB 1: MEMBERSHIP PLANS */}
        {activeTab === 'plans' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SUBSCRIPTION_PLANS.map(plan => {
                const isMonthly = plan.id === 'monthly_89';

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-3xl p-5 border flex flex-col justify-between space-y-4 transition-all ${
                      isMonthly
                        ? 'border-[#2563EB] dark:border-blue-500 bg-[#F0F6FF] dark:bg-blue-950/40 text-[#172033] dark:text-white shadow-md ring-2 ring-[#2563EB]/20'
                        : 'border-[#DCE8F7] dark:border-slate-800 bg-white dark:bg-slate-850 text-[#172033] dark:text-white shadow-xs'
                    }`}
                  >
                    {plan.badge && (
                      <span className={`absolute -top-2.5 right-4 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs ${
                        isMonthly ? 'bg-[#2563EB] text-white' : 'bg-amber-500 text-slate-950 font-black'
                      }`}>
                        {plan.badge}
                      </span>
                    )}

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-black text-base text-[#172033] dark:text-white">{plan.name}</h3>
                        {isMonthly && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#2563EB] dark:text-blue-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-[#DCE8F7] dark:border-slate-700">
                            Most Popular
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-[#172033] dark:text-white">₹{plan.priceInr}</span>
                        <span className="text-xs text-[#64748B] dark:text-slate-400">{plan.tagline}</span>
                      </div>

                      {plan.hasFreeTrial && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                          <Check className="w-3.5 h-3.5" />
                          <span>1 Month 100% Free Trial</span>
                        </div>
                      )}

                      {/* Key highlights matching screenshot */}
                      <ul className="space-y-1.5 pt-1 text-xs">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400 shrink-0" />
                          <span className="text-[#172033] dark:text-slate-200 font-semibold">Unlimited activity & post creation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400 shrink-0" />
                          <span className="text-[#172033] dark:text-slate-200 font-semibold">Direct Chat & instant contact</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400 shrink-0" />
                          <span className="text-[#172033] dark:text-slate-200 font-semibold">Activity booking & reservations</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400 shrink-0" />
                          <span className="text-[#172033] dark:text-slate-200 font-semibold">⭐ VIP Star Badge on profile</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => openCheckoutForPlan(plan)}
                      className={`w-full py-3 rounded-full font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${
                        isMonthly
                          ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md shadow-blue-500/20'
                          : 'bg-[#172033] dark:bg-slate-800 hover:bg-[#1D4ED8] dark:hover:bg-blue-600 text-white'
                      }`}
                    >
                      <span>{plan.hasFreeTrial ? 'Start 1 Month Free' : 'Choose 3-Month Plan'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick Preview of the 15-Feature Matrix */}
            <div className="p-4 rounded-3xl bg-[#F8FBFF] dark:bg-slate-850 border border-[#DCE8F7] dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                  <span className="text-xs font-black text-[#172033] dark:text-white">
                    Complete 15-Perk Feature Comparison
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('comparison')}
                  className="text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  <span>View All 15 Perks</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-[#DCE8F7] dark:border-slate-800">
                  <div className="text-[#64748B] dark:text-slate-400 text-[10px]">Nearby Activities</div>
                  <div className="font-extrabold text-[#2563EB] dark:text-blue-400">1/day ➔ Unlimited</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-[#DCE8F7] dark:border-slate-800">
                  <div className="text-[#64748B] dark:text-slate-400 text-[10px]">Direct Chat & Contact</div>
                  <div className="font-extrabold text-emerald-600 dark:text-emerald-400">❌ ➔ ✅ Full Access</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-[#DCE8F7] dark:border-slate-800">
                  <div className="text-[#64748B] dark:text-slate-400 text-[10px]">Radar Visibility</div>
                  <div className="font-extrabold text-[#2563EB] dark:text-blue-400">Basic ➔ 🔥 Boosted</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPLETE 15-FEATURE COMPARISON TABLE */}
        {activeTab === 'comparison' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <FeatureComparisonTable
              onUpgradeClick={() => openCheckoutForPlan(defaultMonthlyPlan)}
              showCategoryFilters={true}
            />
          </div>
        )}

        {/* Trust & Guarantee Footer */}
        <div className="pt-2 border-t border-[#DCE8F7] dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B] dark:text-slate-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>100% Safe Student Guarantee • Cancel Anytime</span>
          </div>
          <span>Basic connections & joining remain free</span>
        </div>
      </div>
    </div>
  );
};

