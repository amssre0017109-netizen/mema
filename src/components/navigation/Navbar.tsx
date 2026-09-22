import React from 'react';
import {
  ShieldCheck,
  Plus,
  Sparkles,
  Zap,
  Home,
  Users,
  Calendar,
  MessageSquare,
  User,
  Bell,
  MapPin,
  Sun,
  Moon,
  Settings,
  KeyRound
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';
import { Logo } from '../ui/Logo';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setIsSafetyModalOpen,
    setIsCreateRequestModalOpen,
    setIsNotificationDrawerOpen,
    unreadNotificationsCount,
    currentUser,
    isPremium,
    isTrial,
    setIsPremiumModalOpen,
    theme,
    toggleTheme,
    openSettingsModal,
    openAuthModal,
    isAuthenticated
  } = useApp();

  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Feed', icon: <Home className="w-4 h-4" /> },
    { id: 'discover', label: 'People', icon: <Users className="w-4 h-4" /> },
    { id: 'activities', label: 'My Plans', icon: <Calendar className="w-4 h-4" /> },
    { id: 'messages', label: 'Chat', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-2xl border-b border-[#DCE8F7] text-[#172033] shadow-xs transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Brand Logo + User Greeting */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* MEMA Logo */}
            <Logo onClick={() => setCurrentView('home')} size="md" />

            {/* Vertical separator */}
            <div className="h-7 w-[1px] bg-[#DCE8F7] hidden sm:block" />

            {/* User Avatar & Greeting */}
            <div className="hidden sm:flex items-center gap-2.5">
              <button
                onClick={() => setCurrentView('profile')}
                className="relative shrink-0 group"
                title="View Profile"
              >
                <div className="story-ring-light group-hover:scale-105 transition-transform p-0.5">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
                  />
                </div>
              </button>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-xs text-[#172033] tracking-tight">
                    Hi, {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-[#64748B]">
                  <MapPin className="w-2.5 h-2.5 text-[#2563EB]" />
                  <span className="max-w-[120px] truncate">
                    {currentUser.location?.split(',')[0] || 'Nearby'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F8FBFF] p-1.5 rounded-full border border-[#DCE8F7]">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md shadow-blue-500/20'
                      : 'text-[#64748B] hover:text-[#172033] hover:bg-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons (Clean Boundary-Free Icons) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle Button (Bright / Dark) */}
            <button
              onClick={toggleTheme}
              className="p-2 text-[#64748B] hover:text-[#2563EB] transition-colors flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-500 animate-in spin-in-180 duration-200" />
              ) : (
                <Moon className="w-5 h-5 text-[#2563EB] animate-in spin-in-180 duration-200" />
              )}
            </button>

            {/* Auth / Account Switcher Button */}
            <button
              onClick={() => openAuthModal('signin')}
              className="p-2 text-[#64748B] hover:text-[#2563EB] transition-colors flex items-center justify-center"
              title="Sign In / Switch Student Account"
            >
              <KeyRound className="w-5 h-5" />
            </button>

            {/* Settings Button */}
            <button
              onClick={() => openSettingsModal()}
              className="p-2 text-[#64748B] hover:text-[#2563EB] transition-colors flex items-center justify-center"
              title="Settings & Preferences"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative p-2 text-[#64748B] hover:text-[#2563EB] transition-colors flex items-center justify-center"
              title="MEMA Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2563EB] rounded-full animate-ping" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
