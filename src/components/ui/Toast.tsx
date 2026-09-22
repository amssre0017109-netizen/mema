import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { notificationToast, setNotificationToast } = useApp();

  // Auto-dismiss popup message after exactly 2 seconds
  useEffect(() => {
    if (!notificationToast) return;

    const timer = setTimeout(() => {
      setNotificationToast(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [notificationToast, setNotificationToast]);

  return (
    <AnimatePresence>
      {notificationToast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%]"
        >
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-[#172033] dark:text-white rounded-full px-4 py-3 flex items-center gap-3 shadow-xl border border-[#DCE8F7] dark:border-slate-800">
            <span className="text-lg text-[#2563EB] dark:text-blue-400">⚡</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#172033] dark:text-white truncate">
                {notificationToast.message}
              </p>
              {notificationToast.subtext && (
                <p className="text-[11px] text-[#64748B] dark:text-slate-400 truncate">
                  {notificationToast.subtext}
                </p>
              )}
            </div>
            <button
              onClick={() => setNotificationToast(null)}
              className="text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white p-1 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
