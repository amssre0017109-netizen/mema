import React from 'react';
import {
  X,
  Bell,
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setCurrentView
  } = useApp();

  if (!isNotificationDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm h-full shadow-2xl p-5 flex flex-col justify-between border-l border-[#DCE8F7] dark:border-slate-800 text-[#172033] dark:text-white animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DCE8F7] dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#2563EB] dark:text-blue-400" />
            <h3 className="font-black text-base text-[#172033] dark:text-white">MEMA Alerts</h3>
            <span className="px-2 py-0.5 rounded-full bg-[#F0F6FF] dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 border border-[#DCE8F7] dark:border-slate-700 text-[10px] font-extrabold">
              {notifications.filter(n => !n.read).length} new
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-[11px] font-bold text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white"
              title="Mark all as read"
            >
              Mark all read
            </button>
            <button
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="p-1.5 rounded-full bg-[#F8FBFF] dark:bg-slate-800 text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white border border-[#DCE8F7] dark:border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#DCE8F7] dark:divide-slate-800 my-2 pr-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#64748B] dark:text-slate-400">
              No MEMA alerts yet. Post a request or match skills to receive notifications!
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  setIsNotificationDrawerOpen(false);
                  setCurrentView('home');
                }}
                className={`p-3.5 rounded-2xl my-1.5 cursor-pointer transition-colors ${
                  notif.read
                    ? 'bg-white dark:bg-slate-900 hover:bg-[#F8FBFF] dark:hover:bg-slate-800/60 border border-[#DCE8F7] dark:border-slate-800'
                    : 'bg-[#F0F6FF] dark:bg-slate-800/80 hover:bg-[#E0EAFF] dark:hover:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  {notif.sender ? (
                    <img
                      src={notif.sender.avatar}
                      alt={notif.sender.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-[#DCE8F7] dark:ring-slate-700 shrink-0 mt-0.5"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#F0F6FF] dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 border border-[#DCE8F7] dark:border-slate-700 flex items-center justify-center text-lg shrink-0">
                      ⚡
                    </div>
                  )}

                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-extrabold text-[#172033] dark:text-white truncate">{notif.title}</h4>
                      <span className="text-[10px] text-[#64748B] dark:text-slate-400 shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-[#64748B] dark:text-slate-400 leading-relaxed text-[11px]">{notif.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#DCE8F7] dark:border-slate-800 text-center">
          <p className="text-[11px] text-[#64748B] dark:text-slate-400">
            Notifications are skill-specific and campus-focused.
          </p>
        </div>
      </div>
    </div>
  );
};
