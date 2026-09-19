import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Sun,
  Moon,
  Shield,
  ShieldCheck,
  MapPin,
  Bell,
  Crown,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Check,
  Sparkles,
  UserX,
  Eye,
  EyeOff,
  Radio,
  Volume2,
  Globe,
  MessageSquare,
  AlertTriangle,
  Lock,
  ExternalLink,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Smartphone,
  Navigation,
  Info,
  User,
  Edit3,
  Camera,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../ui/Logo';
import { FeatureComparisonTable } from '../premium/FeatureComparisonTable';

export type SettingsCategoryId =
  | 'theme_appearance'
  | 'privacy_safety'
  | 'account'
  | 'notifications'
  | 'location'
  | 'preferences'
  | 'premium'
  | 'help_support'
  | 'terms_privacy'
  | 'logout';

// Alias for backwards compatibility
export type SettingsTabId = SettingsCategoryId | string;

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab
}) => {
  const {
    currentUser,
    setCurrentUser,
    theme,
    setTheme,
    toggleTheme,
    userSubscription,
    isPremium,
    isTrial,
    setIsPremiumModalOpen,
    showPremiumBadgeOnProfile,
    setShowPremiumBadgeOnProfile,
    toggleAutoRenew,
    blockedUserIds,
    unblockUser,
    distanceFilter,
    setDistanceFilter,
    logoutUser,
    openAuthModal,
    authUser,
    isAuthenticated,
    setNotificationToast,
    triggerMatchCelebration,
    openReportModal,
    triggerLoadingScreen
  } = useApp();

  // Normalize initial tab
  const normalizeTabId = (tab?: string): SettingsCategoryId | null => {
    if (!tab) return null;
    if (tab === 'appearance' || tab === 'theme' || tab === 'theme_appearance') return 'theme_appearance';
    if (tab === 'privacy' || tab === 'safety' || tab === 'privacy_safety') return 'privacy_safety';
    if (tab === 'account') return 'account';
    if (tab === 'notifications') return 'notifications';
    if (tab === 'location') return 'location';
    if (tab === 'preferences') return 'preferences';
    if (tab === 'premium') return 'premium';
    if (tab === 'help' || tab === 'help_support') return 'help_support';
    if (tab === 'terms' || tab === 'terms_privacy') return 'terms_privacy';
    if (tab === 'logout') return 'logout';
    return null;
  };

  const [expandedCategory, setExpandedCategory] = useState<SettingsCategoryId | null>(() => normalizeTabId(initialTab));
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && initialTab) {
      setExpandedCategory(normalizeTabId(initialTab));
    }
  }, [isOpen, initialTab]);

  // Local settings toggles & state
  const [ghostMode, setGhostMode] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'verified' | 'contacts'>('public');
  const [whoCanMessageMe, setWhoCanMessageMe] = useState<'anyone' | 'accepted_only'>('anyone');
  const [autoDetectGps, setAutoDetectGps] = useState(true);
  const [approximateLocation, setApproximateLocation] = useState(false);
  const [currentLocationInput, setCurrentLocationInput] = useState(currentUser.location || 'Connaught Place, New Delhi');
  const [pushRequests, setPushRequests] = useState(true);
  const [pushMessages, setPushMessages] = useState(true);
  const [pushStories, setPushStories] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [compactFeed, setCompactFeed] = useState(false);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');

  // FAQ accordion state
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleToggleCategory = (id: SettingsCategoryId) => {
    setExpandedCategory(prev => (prev === id ? null : id));
    setShowLogoutConfirm(false);
  };

  const handleSaveLocation = () => {
    setCurrentUser(prev => ({
      ...prev,
      location: currentLocationInput.trim(),
      locationZone: currentLocationInput.trim()
    }));
    setNotificationToast({
      message: '📍 Location Saved',
      subtext: `Your activity search spot is set to ${currentLocationInput.trim()}`
    });
  };

  const faqs = [
    {
      q: 'How do I post a need for an activity or skill partner?',
      a: 'Tap the "+ Post Request" or "+ Post Need" button anywhere in the app. Select your category (Sports, Study, Music, Dance, Coding, etc.), specify your location spot, and write what you need.'
    },
    {
      q: 'Who can see my stories and full profile file?',
      a: 'Only peers you follow appear in your top story bar, and peers who follow you can view your stories. Anyone browsing nearby requests or Discover directory can inspect your full profile dossier and portfolio moodboards.'
    },
    {
      q: 'How does MEMA guarantee safe public meetups?',
      a: 'We emphasize public meeting spots (libraries, cafes, open sports grounds), verified badges, instant block/report features, and zero dating solicitation rules.'
    },
    {
      q: 'What is the difference between Bright and Dark theme?',
      a: 'Bright mode features our signature Light Dark Blue & Pure White aesthetic (#F0F5FF), while Dark mode switches to an Obsidian Midnight canvas with luminous Royal highlights.'
    },
    {
      q: 'Can I upload a custom photo from my personal device?',
      a: 'Yes! In the Profile screen or Account section below, tap the camera icon to pick and apply any photo directly from your phone or PC storage.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#0F172A] rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-[#DCE8F7] dark:border-slate-800 flex flex-col overflow-hidden text-[#172033] dark:text-slate-100 transition-colors">
        
        {/* =========================================================
            1. HEADER (Title, Subtitle & Close)
           ========================================================= */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#DCE8F7] dark:border-slate-800 bg-[#F8FBFF] dark:bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F0F6FF] dark:bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-[#172033] dark:text-white">
                Settings
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Manage your preferences, privacy, and account
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F0F6FF] dark:hover:bg-slate-800 text-[#64748B] hover:text-[#172033] dark:hover:text-slate-200 transition-colors"
            title="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =========================================================
            2. CLEAN VERTICAL SETTINGS LIST (One below another)
           ========================================================= */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#DCE8F7] dark:divide-slate-800/80">

          {/* ---------------------------------------------------------
              ITEM 1: THEME & APPEARANCE
             --------------------------------------------------------- */}
          <div className="transition-colors">
            <button
              type="button"
              onClick={() => handleToggleCategory('theme_appearance')}
              className={`w-full py-4 px-5 sm:px-6 flex items-center justify-between transition-colors text-left group min-h-[64px] ${
                expandedCategory === 'theme_appearance'
                  ? 'bg-[#F0F6FF] dark:bg-slate-900/80'
                  : 'hover:bg-[#F8FBFF] dark:hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-[#172033] dark:text-white block">
                    Theme & Appearance
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                    {theme === 'dark' ? 'Dark Obsidian Mode' : 'Bright Light Sky Blue Mode'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F0F6FF] dark:bg-slate-800 text-[#2563EB] dark:text-blue-300">
                  {theme === 'dark' ? 'Dark' : 'Bright'}
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${
                    expandedCategory === 'theme_appearance' ? 'rotate-90 text-[#2563EB]' : 'group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </button>

            {/* Expanded Detailed Content */}
            {expandedCategory === 'theme_appearance' && (
              <div className="px-5 sm:px-6 pb-6 pt-2 bg-[#F8FBFF] dark:bg-slate-900/40 space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* Bright Mode Card */}
                  <div
                    onClick={() => {
                      setTheme('light');
                      setNotificationToast({
                        message: '☀️ Bright Mode Enabled',
                        subtext: 'Light Blue Background & crisp white canvas activated.'
                      });
                    }}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all relative ${
                      theme === 'light'
                        ? 'border-[#2563EB] bg-white dark:bg-slate-900 shadow-md ring-2 ring-[#2563EB]/20'
                        : 'border-[#DCE8F7] dark:border-slate-800 hover:border-[#2563EB] bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-500" />
                        <span className="font-extrabold text-xs text-[#172033] dark:text-white">Bright Mode</span>
                      </div>
                      {theme === 'light' && (
                        <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div className="rounded-xl bg-[#F0F6FF] p-2.5 border border-[#DCE8F7] space-y-1.5">
                      <div className="h-1.5 w-12 bg-[#2563EB] rounded-full" />
                      <div className="h-2.5 w-full bg-white rounded-md shadow-2xs" />
                    </div>
                    <p className="text-[10px] text-[#64748B] mt-2">Light Blue (#F0F6FF) canvas with crisp indicators.</p>
                  </div>

                  {/* Dark Mode Card */}
                  <div
                    onClick={() => {
                      setTheme('dark');
                      setNotificationToast({
                        message: '🌙 Dark Mode Enabled',
                        subtext: 'Obsidian Midnight & Blue highlights activated.'
                      });
                    }}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all relative ${
                      theme === 'dark'
                        ? 'border-[#2563EB] bg-slate-900 shadow-md ring-2 ring-[#2563EB]/30'
                        : 'border-[#DCE8F7] dark:border-slate-800 hover:border-[#2563EB] bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-[#2563EB]" />
                        <span className="font-extrabold text-xs text-[#172033] dark:text-white">Dark Mode</span>
                      </div>
                      {theme === 'dark' && (
                        <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div className="rounded-xl bg-[#090D16] p-2.5 border border-slate-800 space-y-1.5">
                      <div className="h-1.5 w-12 bg-[#2563EB] rounded-full" />
                      <div className="h-2.5 w-full bg-slate-800 rounded-md shadow-2xs" />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">Obsidian Midnight (#090D16) canvas with white indicators.</p>
                  </div>
                </div>

                {/* Indicator Dot Status */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold block">Theme-Responsive Indicator Dot</span>
                    <span className="text-[10px] text-[#64748B]">Main Text (#172033) in Bright mode, White (#FFFFFF) in Dark mode</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-[#DCE8F7]"
                      style={{ backgroundColor: theme === 'dark' ? '#FFFFFF' : '#172033' }}
                    />
                    <span className="text-xs font-mono font-bold">{theme === 'dark' ? '#FFFFFF' : '#172033'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------
              ITEM 2: PRIVACY & SAFETY
             --------------------------------------------------------- */}
          <div className="transition-colors">
            <button
              type="button"
              onClick={() => handleToggleCategory('privacy_safety')}
              className={`w-full py-4 px-5 sm:px-6 flex items-center justify-between transition-colors text-left group min-h-[64px] ${
                expandedCategory === 'privacy_safety'
                  ? 'bg-[#F0F6FF] dark:bg-slate-900/80'
                  : 'hover:bg-[#F8FBFF] dark:hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-[#F0F6FF] dark:bg-blue-950/40 text-[#2563EB] flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-[#172033] dark:text-white block">
                    Privacy & Safety
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                    Who can see your profile, ghost mode, and blocked users
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {blockedUserIds.length > 0 && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                    {blockedUserIds.length} Blocked
                  </span>
                )}
                <ChevronRight
                  className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${
                    expandedCategory === 'privacy_safety' ? 'rotate-90 text-[#2563EB]' : 'group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </button>

            {/* Expanded Detailed Content */}
            {expandedCategory === 'privacy_safety' && (
              <div className="px-5 sm:px-6 pb-6 pt-2 bg-[#F8FBFF] dark:bg-slate-900/40 space-y-4 animate-in fade-in duration-200">
                {/* Who can see my profile */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-xs font-bold text-[#172033]">Who can see my profile</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'public', label: 'Public Nearby', desc: 'All nearby users' },
                      { id: 'verified', label: 'Verified Only', desc: 'Verified members' },
                      { id: 'contacts', label: 'Followers Only', desc: 'Peers you follow' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setProfileVisibility(opt.id as any);
                          setNotificationToast({
                            message: 'Privacy Updated',
                            subtext: `Profile visibility set to ${opt.label}`
                          });
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          profileVisibility === opt.id
                            ? 'border-[#2563EB] bg-[#F0F6FF] dark:bg-blue-950/40 text-[#2563EB] font-bold'
                            : 'border-[#DCE8F7] dark:border-slate-800 text-[#64748B] dark:text-slate-400'
                        }`}
                      >
                        <div className="text-xs font-bold">{opt.label}</div>
                        <div className="text-[10px] text-[#64748B] mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Approximate Location Privacy Guarantee */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#F0F6FF] dark:bg-blue-950/60 text-[#2563EB] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold block text-[#172033]">Live GPS Protection</span>
                        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full">
                          Enforced
                        </span>
                      </div>
                      <span className="text-[10px] text-[#64748B] block mt-0.5">
                        Exact live coordinates are never exposed. Only approximate area/radius is used for peer discovery.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ghost Mode */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                      {ghostMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-[#172033]">Ghost Mode</span>
                      <span className="text-[10px] text-[#64748B]">Hide your active status dot and story views</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setGhostMode(!ghostMode);
                      setNotificationToast({
                        message: !ghostMode ? '👻 Ghost Mode Activated' : 'Active Status Restored',
                        subtext: !ghostMode ? 'Your online presence is hidden.' : 'Members can see when you are online.'
                      });
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      ghostMode ? 'bg-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        ghostMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Who can message me */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold block text-[#172033]">Who can message me</span>
                    <span className="text-[10px] text-[#64748B]">Restrict direct chat requests to accepted activity partners</span>
                  </div>
                  <select
                    value={whoCanMessageMe}
                    onChange={e => setWhoCanMessageMe(e.target.value as any)}
                    className="bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs font-bold text-[#172033] dark:text-slate-200 focus:outline-none"
                  >
                    <option value="anyone">Anyone Nearby</option>
                    <option value="accepted_only">Accepted Needs Only</option>
                  </select>
                </div>

                {/* Blocked Users */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserX className="w-4 h-4 text-rose-500" />
                      <span className="text-xs font-bold text-[#172033]">Blocked users</span>
                    </div>
                    <span className="text-[11px] text-[#64748B] font-semibold">{blockedUserIds.length} Blocked</span>
                  </div>
                  {blockedUserIds.length === 0 ? (
                    <p className="text-xs text-[#64748B] italic">No blocked users. Your feed is open.</p>
                  ) : (
                    <div className="space-y-2">
                      {blockedUserIds.map(id => (
                        <div key={id} className="flex items-center justify-between p-2 rounded-xl bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700">
                          <span className="text-xs font-bold text-[#172033] dark:text-slate-300">ID: {id}</span>
                          <button
                            type="button"
                            onClick={() => unblockUser(id)}
                            className="px-2.5 py-0.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold"
                          >
                            Unblock
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------
              ITEM 3: ACCOUNT
             --------------------------------------------------------- */}
          <div className="transition-colors">
            <button
              type="button"
              onClick={() => handleToggleCategory('account')}
              className={`w-full py-4 px-5 sm:px-6 flex items-center justify-between transition-colors text-left group min-h-[64px] ${
                expandedCategory === 'account'
                  ? 'bg-[#F0F6FF] dark:bg-slate-900/80'
                  : 'hover:bg-[#F8FBFF] dark:hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-[#F0F6FF] dark:bg-blue-950/40 text-[#2563EB] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-[#172033] dark:text-white block">
                    Account
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                    Profile identity, occupation status, and avatar
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold text-[#64748B] dark:text-slate-300 truncate max-w-[120px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${
                    expandedCategory === 'account' ? 'rotate-90 text-[#2563EB]' : 'group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </button>

            {/* Expanded Detailed Content */}
            {expandedCategory === 'account' && (
              <div className="px-5 sm:px-6 pb-6 pt-2 bg-[#F8FBFF] dark:bg-slate-900/40 space-y-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#2563EB]"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-[#172033] dark:text-white flex items-center gap-1.5">
                        {currentUser.name}
                        {currentUser.verifiedCollege && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                        )}
                      </h4>
                      <p className="text-xs text-[#64748B]">{currentUser.location || 'Nearby Spot'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold block text-[#172033]">Occupation / Identity Status</span>
                  <div className="p-3 rounded-xl bg-[#F0F6FF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 text-xs font-bold text-[#172033] dark:text-slate-200">
                    {currentUser.occupationType === 'school_student' && '🏫 School Student'}
                    {currentUser.occupationType === 'creator_freelancer' && '✨ Creator / Freelance'}
                    {currentUser.occupationType !== 'school_student' && currentUser.occupationType !== 'creator_freelancer' && '💼 Working Professional'}
                    <span className="block text-[11px] font-normal text-[#64748B] mt-0.5">{currentUser.degree || currentUser.year || 'Member'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------
              ITEM 4: NOTIFICATIONS
             --------------------------------------------------------- */}
          <div className="transition-colors">
            <button
              type="button"
              onClick={() => handleToggleCategory('notifications')}
              className={`w-full py-4 px-5 sm:px-6 flex items-center justify-between transition-colors text-left group min-h-[64px] ${
                expandedCategory === 'notifications'
                  ? 'bg-[#F0F6FF] dark:bg-slate-900/80'
                  : 'hover:bg-[#F8FBFF] dark:hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-[#F0F6FF] dark:bg-indigo-950/40 text-[#2563EB] flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-[#172033] dark:text-white block">
                    Notifications
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                    Activity alerts, story updates, and sounds
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F0F6FF] text-[#2563EB] border border-[#DCE8F7]">
                  Active
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${
                    expandedCategory === 'notifications' ? 'rotate-90 text-[#2563EB]' : 'group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </button>

            {/* Expanded Detailed Content */}
            {expandedCategory === 'notifications' && (
              <div className="px-5 sm:px-6 pb-6 pt-2 bg-[#F8FBFF] dark:bg-slate-900/40 space-y-3 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 space-y-3">
                  {[
                    { state: pushRequests, setter: setPushRequests, label: 'Nearby Requests & Needs', desc: 'Alerts when someone needs a partner nearby' },
                    { state: pushMessages, setter: setPushMessages, label: 'Direct Messages & Story Replies', desc: 'Chat alerts and replies from peers' },
                    { state: pushStories, setter: setPushStories, label: 'Followed Stories', desc: 'New status updates from people you follow' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-[#DCE8F7] dark:border-slate-800 last:border-none">
                      <div>
                        <span className="text-xs font-bold block text-[#172033]">{item.label}</span>
                        <span className="text-[10px] text-[#64748B]">{item.desc}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => item.setter(!item.state)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${
                          item.state ? 'bg-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                            item.state ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Sound & Celebration */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-[#172033]">Celebration Confetti</span>
                      <span className="text-[10px] text-[#64748B]">Trigger celebration when creating requests and matching</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSoundEffects(!soundEffects);
                      if (!soundEffects) triggerMatchCelebration();
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      soundEffects ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        soundEffects ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------
              ITEM 5: LOCATION
             --------------------------------------------------------- */}
          <div className="transition-colors">
            <button
              type="button"
              onClick={() => handleToggleCategory('location')}
              className={`w-full py-4 px-5 sm:px-6 flex items-center justify-between transition-colors text-left group min-h-[64px] ${
                expandedCategory === 'location'
                  ? 'bg-[#F0F6FF] dark:bg-slate-900/80'
                  : 'hover:bg-[#F8FBFF] dark:hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-[#F0F6FF] dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-[#172033] dark:text-white block">
                    Location
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                    Area spot, landmark, and GPS detection
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold text-[#64748B] dark:text-slate-300 truncate max-w-[120px]">
                  {currentUser.location?.split(',')[0] || 'Nearby'}
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${
                    expandedCategory === 'location' ? 'rotate-90 text-[#2563EB]' : 'group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </button>

            {/* Expanded Detailed Content */}
            {expandedCategory === 'location' && (
              <div className="px-5 sm:px-6 pb-6 pt-2 bg-[#F8FBFF] dark:bg-slate-900/40 space-y-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 space-y-3">
                  <span className="text-xs font-bold block text-[#172033]">Current Location / Area Spot</span>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <MapPin className="w-4 h-4 text-[#2563EB] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={currentLocationInput}
                        onChange={e => setCurrentLocationInput(e.target.value)}
                        placeholder="Enter your area or neighborhood..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 text-xs font-bold text-[#172033] dark:text-white focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveLocation}
                      className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-black transition-colors shrink-0"
                    >
                      Save
                    </button>
                  </div>

                  {/* Quick presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-[#64748B] py-1">Quick Presets:</span>
                    {[
                      'Connaught Place, New Delhi',
                      'Indiranagar, Bangalore',
                      'Bandra West, Mumbai',
                      'Sector 62, Noida',
                      'Cyber City, Gurugram'
                    ].map(loc => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setCurrentLocationInput(loc);
                          setCurrentUser(prev => ({ ...prev, location: loc, locationZone: loc }));
                          setNotificationToast({
                            message: '📍 Location Saved',
                            subtext: `Spot set to ${loc}`
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#F0F6FF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 text-[10px] font-bold text-[#172033] dark:text-slate-300 hover:border-[#2563EB]"
                      >
                        {loc.split(',')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto GPS Detection */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-[#172033]">Auto-detect GPS Location</span>
                      <span className="text-[10px] text-[#64748B]">Automatically discovers requests when traveling</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoDetectGps(!autoDetectGps)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      autoDetectGps ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        autoDetectGps ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------
              ITEM 6: PREFERENCES
             --------------------------------------------------------- */}
          <div className="transition-colors">
            <button
              type="button"
              onClick={() => handleToggleCategory('preferences')}
              className={`w-full py-4 px-5 sm:px-6 flex items-center justify-between transition-colors text-left group min-h-[64px] ${
                expandedCategory === 'preferences'
                  ? 'bg-[#F0F6FF] dark:bg-slate-900/80'
                  : 'hover:bg-[#F8FBFF] dark:hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-[#172033] dark:text-white block">
                    Preferences
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                    Search radius and activity categories
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {distanceFilter === 'all' ? 'Anywhere' : distanceFilter}
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${
                    expandedCategory === 'preferences' ? 'rotate-90 text-[#2563EB]' : 'group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </button>

            {/* Expanded Detailed Content */}
            {expandedCategory === 'preferences' && (
              <div className="px-5 sm:px-6 pb-6 pt-2 bg-[#F8FBFF] dark:bg-slate-900/40 space-y-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 space-y-2.5">
                  <span className="text-xs font-bold block text-[#172033]">Default Radar Search Radius</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: '1km', label: '1 km' },
                      { id: '3km', label: '3 km' },
                      { id: '5km', label: '5 km (Recommended)' },
                      { id: '10km', label: '10 km' },
                      { id: 'all', label: 'Anywhere' }
                    ].map(dist => (
                      <button
                        key={dist.id}
                        type="button"
                        onClick={() => {
                          setDistanceFilter(dist.id as any);
                          setNotificationToast({
                            message: 'Radar Radius Updated',
                            subtext: `Discovery range set to ${dist.label}`
                          });
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          distanceFilter === dist.id
                            ? 'bg-[#2563EB] text-white shadow-xs'
                            : 'bg-[#F0F6FF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 text-[#172033] dark:text-slate-300'
                        }`}
                      >
                        {dist.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-[#64748B] dark:text-slate-400 flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span>Exact coordinates are never exposed; radar uses approximate area ranges.</span>
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold block text-[#172033]">Distance Unit</span>
                    <span className="text-[10px] text-[#64748B]">Display distance in kilometers or miles</span>
                  </div>
                  <div className="flex rounded-xl bg-[#F0F6FF] dark:bg-slate-800 p-1 border border-[#DCE8F7] dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setDistanceUnit('km')}
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                        distanceUnit === 'km' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] dark:text-slate-400'
                      }`}
                    >
                      KM
                    </button>
                    <button
                      type="button"
                      onClick={() => setDistanceUnit('miles')}
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                        distanceUnit === 'miles' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] dark:text-slate-400'
                      }`}
                    >
                      Miles
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------
              ITEM 7: PREMIUM
             --------------------------------------------------------- */}
          <div className="transition-colors">
            <button
              type="button"
              onClick={() => handleToggleCategory('premium')}
              className={`w-full py-4 px-5 sm:px-6 flex items-center justify-between transition-colors text-left group min-h-[64px] ${
                expandedCategory === 'premium'
                  ? 'bg-[#F0F6FF] dark:bg-slate-900/80'
                  : 'hover:bg-[#F8FBFF] dark:hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-[#172033] dark:text-white block">
                    Premium
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                    MEMA VIP status, radar boost, and perks
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300">
                  {isPremium ? (isTrial ? 'Free Trial' : 'VIP Member') : 'Upgrade'}
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${
                    expandedCategory === 'premium' ? 'rotate-90 text-[#2563EB]' : 'group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </button>

            {/* Expanded Detailed Content */}
            {expandedCategory === 'premium' && (
              <div className="px-5 sm:px-6 pb-6 pt-2 bg-[#F8FBFF] dark:bg-slate-900/40 space-y-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-blue-500/10 to-indigo-500/10 border border-amber-300/60 dark:border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-[#172033] dark:text-white">VIP Membership Privileges</h4>
                      <p className="text-[11px] text-[#64748B] mt-0.5">Priority radar pinning, unlimited requests, direct chat, and VIP badge</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setIsPremiumModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-black shadow-xs transition-colors shrink-0"
                    >
                      {isPremium ? 'Manage' : 'Upgrade ↗'}
                    </button>
                  </div>
                </div>

                {/* VIP Profile Badge Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold block text-[#172033]">Display VIP Gold Checkmark on Profile</span>
                    <span className="text-[10px] text-[#64748B]">Show verified gold badge to activity partners</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPremiumBadgeOnProfile(!showPremiumBadgeOnProfile)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      showPremiumBadgeOnProfile ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        showPremiumBadgeOnProfile ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Free vs Premium Full Comparison Table */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black text-[#172033] dark:text-white">
                      Free vs Premium Comparison (15 Perks)
                    </span>
                    <span className="text-[10px] text-[#2563EB] font-bold">Live Breakdown</span>
                  </div>
                  <FeatureComparisonTable
                    compact={true}
                    onUpgradeClick={() => {
                      onClose();
                      setIsPremiumModalOpen(true);
                    }}
                    showCategoryFilters={true}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------
              ITEM 8: HELP & SUPPORT
             --------------------------------------------------------- */}
          <div className="transition-colors">
            <button
              type="button"
              onClick={() => handleToggleCategory('help_support')}
              className={`w-full py-4 px-5 sm:px-6 flex items-center justify-between transition-colors text-left group min-h-[64px] ${
                expandedCategory === 'help_support'
                  ? 'bg-[#F0F6FF] dark:bg-slate-900/80'
                  : 'hover:bg-[#F8FBFF] dark:hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-[#F0F6FF] dark:bg-blue-950/40 text-[#2563EB] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-[#172033] dark:text-white block">
                    Help & Support
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                    FAQs, safety guidelines, and live chat support
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ChevronRight
                  className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${
                    expandedCategory === 'help_support' ? 'rotate-90 text-[#2563EB]' : 'group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </button>

            {/* Expanded Detailed Content */}
            {expandedCategory === 'help_support' && (
              <div className="px-5 sm:px-6 pb-6 pt-2 bg-[#F8FBFF] dark:bg-slate-900/40 space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => {
                      setNotificationToast({
                        message: '💬 Live Support Connected',
                        subtext: 'Our team will message you in MEMA Chat shortly.'
                      });
                    }}
                    className="cursor-pointer p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 hover:border-[#2563EB] transition-all space-y-1"
                  >
                    <div className="flex items-center gap-2 text-[#2563EB]">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-xs font-black">Live Support Chat</span>
                    </div>
                    <p className="text-[10px] text-[#64748B]">Direct message with safety moderators</p>
                  </div>

                  <div
                    onClick={() => {
                      setNotificationToast({
                        message: '🛡️ Safety Guide Active',
                        subtext: 'Always meet in open public spots and verify partner profiles.'
                      });
                    }}
                    className="cursor-pointer p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 hover:border-emerald-500 transition-all space-y-1"
                  >
                    <div className="flex items-center gap-2 text-emerald-600">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-xs font-black">Meetup Safety Guide</span>
                    </div>
                    <p className="text-[10px] text-[#64748B]">Best practices for sports and study meetups</p>
                  </div>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold block text-[#172033] dark:text-slate-300">Frequently Asked Questions</span>
                  {faqs.map((faq, idx) => {
                    const isExpanded = expandedFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-[#DCE8F7] dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                          className="w-full p-3 text-left flex items-center justify-between text-xs font-bold text-[#172033] dark:text-white"
                        >
                          <span>{faq.q}</span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 text-[#64748B] transition-transform ${
                              isExpanded ? 'rotate-90 text-[#2563EB]' : ''
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="px-3 pb-3 text-[11px] text-[#64748B] dark:text-slate-300 leading-relaxed border-t border-[#DCE8F7] dark:border-slate-800 pt-2">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------
              ITEM 9: TERMS & PRIVACY
             --------------------------------------------------------- */}
          <div className="transition-colors">
            <button
              type="button"
              onClick={() => handleToggleCategory('terms_privacy')}
              className={`w-full py-4 px-5 sm:px-6 flex items-center justify-between transition-colors text-left group min-h-[64px] ${
                expandedCategory === 'terms_privacy'
                  ? 'bg-[#F0F6FF] dark:bg-slate-900/80'
                  : 'hover:bg-[#F8FBFF] dark:hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-[#F0F6FF] dark:bg-slate-800 text-[#2563EB] dark:text-slate-300 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-[#172033] dark:text-white block">
                    Terms & Privacy
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                    Community code of conduct, terms of service, and licenses
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ChevronRight
                  className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${
                    expandedCategory === 'terms_privacy' ? 'rotate-90 text-[#2563EB]' : 'group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </button>

            {/* Expanded Detailed Content */}
            {expandedCategory === 'terms_privacy' && (
              <div className="px-5 sm:px-6 pb-6 pt-2 bg-[#F8FBFF] dark:bg-slate-900/40 space-y-3 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 flex items-center justify-center py-5">
                  <Logo size="lg" />
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-xs text-[#172033] dark:text-white">1. Community Code of Conduct</h4>
                  <p className="text-[11px] text-[#64748B] dark:text-slate-400 leading-relaxed">
                    MEMA is strictly a platform for activity partners, skills, study, and team collaborations. Dating solicitation or harassment results in immediate permanent ban.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-xs text-[#172033] dark:text-white">2. Privacy & Data Integrity</h4>
                  <p className="text-[11px] text-[#64748B] dark:text-slate-400 leading-relaxed">
                    Your profile moodboards and personal data are stored with end-to-end security. We never sell your personal information.
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#64748B] px-1 pt-1">
                  <span>MEMA App Version 2.4.0</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      triggerLoadingScreen();
                    }}
                    className="text-[#2563EB] dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Preview 2s Loading Screen ⚡</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------
              ITEM 10: LOGOUT
             --------------------------------------------------------- */}
          <div className="transition-colors">
            <button
              type="button"
              onClick={() => handleToggleCategory('logout')}
              className={`w-full py-4 px-5 sm:px-6 flex items-center justify-between transition-colors text-left group min-h-[64px] ${
                expandedCategory === 'logout'
                  ? 'bg-rose-50/70 dark:bg-rose-950/40'
                  : 'hover:bg-rose-50/40 dark:hover:bg-rose-950/20'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400 block">
                    Logout
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                    Sign out of your account on this device
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ChevronRight
                  className={`w-4 h-4 text-rose-400 transition-transform duration-200 ${
                    expandedCategory === 'logout' ? 'rotate-90 text-rose-600' : 'group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </button>

            {/* Expanded Detailed Content */}
            {expandedCategory === 'logout' && (
              <div className="px-5 sm:px-6 pb-6 pt-2 bg-rose-50/40 dark:bg-rose-950/20 space-y-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900 flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-rose-200"
                  />
                  <div>
                    <span className="text-xs font-black text-[#172033] dark:text-white block">{currentUser.name}</span>
                    <span className="text-[10px] text-[#64748B]">{currentUser.location || 'Active nearby'}</span>
                  </div>
                </div>

                {!showLogoutConfirm ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        openAuthModal('signin');
                      }}
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all active:scale-98"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Switch / Sign In with Student Account</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-rose-50 text-rose-600 font-extrabold text-xs flex items-center justify-center gap-2 border border-rose-200 transition-all active:scale-98"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out of Current Session</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 space-y-3">
                    <p className="text-xs font-bold text-rose-700 dark:text-rose-300 text-center">
                      Are you sure you want to sign out? You will need to sign back in to see your messages and activity feed.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowLogoutConfirm(false)}
                        className="flex-1 py-2.5 rounded-xl bg-[#F0F6FF] dark:bg-slate-800 text-[#172033] dark:text-slate-300 text-xs font-bold border border-[#DCE8F7]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          logoutUser();
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black"
                      >
                        Confirm Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
