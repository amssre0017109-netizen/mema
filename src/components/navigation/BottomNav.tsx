import React from 'react';
import {
  Home,
  Compass,
  Plus,
  MessageSquare,
  User
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    conversations,
    setIsCreateRequestModalOpen
  } = useApp();

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 flex items-center justify-center px-4 pointer-events-none">
      {/* Floating Clean Blue-Tinted Glass Dock */}
      <div className="pointer-events-auto glass-dock-light dark:bg-slate-900/95 dark:border-slate-800 rounded-full p-2 sm:p-2.5 flex items-center gap-2 sm:gap-4 shadow-light-dock dark:shadow-2xl max-w-md w-full justify-around">
        {/* 1. Home */}
        <button
          onClick={() => setCurrentView('home')}
          className={`p-2.5 sm:p-3 rounded-full transition-all duration-200 ${
            currentView === 'home'
              ? 'text-[#2563EB] dark:text-blue-400 bg-[#F0F6FF] dark:bg-blue-950/60 scale-105 shadow-xs font-bold'
              : 'text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-[#F8FBFF] dark:hover:bg-slate-800 active:scale-95'
          }`}
          title="Home Feed"
        >
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* 2. Students / Discover */}
        <button
          onClick={() => setCurrentView('discover')}
          className={`p-2.5 sm:p-3 rounded-full transition-all duration-200 ${
            currentView === 'discover'
              ? 'text-[#2563EB] dark:text-blue-400 bg-[#F0F6FF] dark:bg-blue-950/60 scale-105 shadow-xs font-bold'
              : 'text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-[#F8FBFF] dark:hover:bg-slate-800 active:scale-95'
          }`}
          title="Students Directory"
        >
          <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* 3. Center Primary Blue + Button */}
        <button
          onClick={() => setIsCreateRequestModalOpen(true)}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white flex items-center justify-center shadow-lg shadow-blue-600/30 transition-transform hover:scale-110 active:scale-95"
          title="Create Request"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        {/* 4. Chat */}
        <button
          onClick={() => setCurrentView('messages')}
          className={`relative p-2.5 sm:p-3 rounded-full transition-all duration-200 ${
            currentView === 'messages'
              ? 'text-[#2563EB] dark:text-blue-400 bg-[#F0F6FF] dark:bg-blue-950/60 scale-105 shadow-xs font-bold'
              : 'text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-[#F8FBFF] dark:hover:bg-slate-800 active:scale-95'
          }`}
          title="Messages"
        >
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
          {totalUnread > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#2563EB] rounded-full animate-ping" />
          )}
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => setCurrentView('profile')}
          className={`p-2.5 sm:p-3 rounded-full transition-all duration-200 ${
            currentView === 'profile'
              ? 'text-[#2563EB] dark:text-blue-400 bg-[#F0F6FF] dark:bg-blue-950/60 scale-105 shadow-xs font-bold'
              : 'text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-[#F8FBFF] dark:hover:bg-slate-800 active:scale-95'
          }`}
          title="Profile"
        >
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
};
