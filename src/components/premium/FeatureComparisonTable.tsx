import React, { useState } from 'react';
import {
  Check,
  X,
  Sparkles,
  Crown,
  Search,
  Zap,
  Filter
} from 'lucide-react';
import {
  PREMIUM_FEATURE_COMPARISON,
  FeatureComparisonItem
} from '../../services/subscriptionService';

interface FeatureComparisonTableProps {
  compact?: boolean;
  onUpgradeClick?: () => void;
  showCategoryFilters?: boolean;
}

export const FeatureComparisonTable: React.FC<FeatureComparisonTableProps> = ({
  compact = false,
  onUpgradeClick,
  showCategoryFilters = true
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFeatures = PREMIUM_FEATURE_COMPARISON.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.englishLabel.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories = [
    { id: 'all', label: 'All Perks', count: PREMIUM_FEATURE_COMPARISON.length },
    { id: 'activities', label: 'Activities (5)', count: 5 },
    { id: 'connections', label: 'Chat & Contact (4)', count: 4 },
    { id: 'profile', label: 'Profile & VIP (4)', count: 4 },
    { id: 'filters', label: 'Filters (2)', count: 2 }
  ];

  const renderFreeCell = (item: FeatureComparisonItem) => {
    if (item.freeValue.includes('✅')) {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
          <Check className="w-3 h-3" />
          <span>Included</span>
        </span>
      );
    }
    if (item.freeValue.includes('❌')) {
      return (
        <span className="inline-flex items-center gap-1 text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
          <X className="w-3 h-3" />
          <span>{item.freeValue.replace('❌', '').trim() || 'Locked'}</span>
        </span>
      );
    }
    return (
      <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold">
        {item.freeValue}
      </span>
    );
  };

  const renderPremiumCell = (item: FeatureComparisonItem) => {
    if (item.premiumValue.includes('⭐')) {
      return (
        <span className="inline-flex items-center gap-1 text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-xs">
          <span>⭐</span>
          <span>VIP Badge</span>
        </span>
      );
    }
    if (item.premiumValue.includes('🔥')) {
      return (
        <span className="inline-flex items-center gap-1 text-[#2563EB] dark:text-blue-400 bg-[#F0F6FF] dark:bg-blue-950/60 border border-[#DCE8F7] dark:border-blue-900 px-2.5 py-0.5 rounded-full text-[11px] font-black">
          <span>🔥</span>
          <span>10x Boosted</span>
        </span>
      );
    }
    if (item.premiumValue.includes('✅')) {
      return (
        <span className="inline-flex items-center gap-1 text-[#2563EB] dark:text-blue-400 bg-[#F0F6FF] dark:bg-blue-950/60 border border-[#DCE8F7] dark:border-blue-900 px-2.5 py-0.5 rounded-full text-[11px] font-black">
          <Check className="w-3 h-3 text-[#2563EB] dark:text-blue-400" />
          <span>{item.premiumValue.replace('✅', '').trim() || 'Included'}</span>
        </span>
      );
    }
    return (
      <span className="inline-block bg-[#2563EB] text-white px-2.5 py-0.5 rounded-lg text-[11px] font-black shadow-2xs">
        {item.premiumValue}
      </span>
    );
  };

  return (
    <div className="space-y-3.5">
      {/* Search & Category Filter Pills */}
      {showCategoryFilters && (
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1 min-w-0">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-[#F8FBFF] dark:hover:bg-slate-700 border border-[#DCE8F7] dark:border-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-44 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] dark:text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search perk..."
                className="w-full bg-white dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 rounded-full pl-8 pr-3 py-1.5 text-xs text-[#172033] dark:text-white placeholder-[#64748B] dark:placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table Box */}
      <div className="rounded-2xl border border-[#DCE8F7] dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FBFF] dark:bg-slate-850 border-b border-[#DCE8F7] dark:border-slate-800 text-[#172033] dark:text-white">
                <th className="py-3 px-4 text-xs font-black uppercase tracking-wider">
                  Feature & Capability
                </th>
                <th className="py-3 px-3 text-center text-xs font-bold text-[#64748B] dark:text-slate-400 w-28 sm:w-36 bg-slate-50/50 dark:bg-slate-800/40">
                  Free Plan
                </th>
                <th className="py-3 px-3 text-center text-xs font-black text-[#2563EB] dark:text-blue-400 w-36 sm:w-44 bg-[#F0F6FF] dark:bg-blue-950/30">
                  <div className="flex items-center justify-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>Premium ⭐</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE8F7] dark:divide-slate-800">
              {filteredFeatures.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`transition-colors hover:bg-[#F8FBFF] dark:hover:bg-slate-800/60 ${
                    idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-[#F8FBFF]/50 dark:bg-slate-850/50'
                  }`}
                >
                  {/* Feature Name & English Subtitle */}
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-[#172033] dark:text-white leading-tight">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-[#64748B] dark:text-slate-400 truncate">
                          {item.englishLabel}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Free Plan Value */}
                  <td className="py-2.5 px-3 text-center bg-slate-50/30 dark:bg-slate-800/20">
                    {renderFreeCell(item)}
                  </td>

                  {/* Premium Plan Value */}
                  <td className="py-2.5 px-3 text-center bg-[#F0F6FF]/60 dark:bg-blue-950/20">
                    {renderPremiumCell(item)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredFeatures.length === 0 && (
          <div className="p-6 text-center text-xs text-[#64748B] dark:text-slate-400">
            No features found matching "{searchQuery}".
          </div>
        )}
      </div>

      {/* Upgrade CTA footer if provided */}
      {onUpgradeClick && (
        <div className="p-4 rounded-2xl bg-[#F0F6FF] dark:bg-slate-850 border border-[#DCE8F7] dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#172033] dark:text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Ready to unlock all 15 Premium Superpowers?</span>
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-slate-400">
              Start your 1-Month 100% Free Trial today. Cancel anytime with 1 tap.
            </p>
          </div>

          <button
            type="button"
            onClick={onUpgradeClick}
            className="px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-95"
          >
            <span>Upgrade to Premium</span>
            <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          </button>
        </div>
      )}
    </div>
  );
};
