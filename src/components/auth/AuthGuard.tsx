import React from 'react';
import { Lock, Sparkles, KeyRound, GraduationCap, Home, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuthGuardProps {
  children: React.ReactNode;
  featureName?: string;
  title?: string;
  description?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  featureName = 'this feature',
  title = 'Authentication Required',
  description = 'Please sign in or create an account to access this section of MEMA.'
}) => {
  const { isAuthenticated, openAuthModal, setCurrentView } = useApp();

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Floating Badge */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
          <Lock className="w-8 h-8 stroke-[2.2]" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-white stroke-[3]" />
          </div>
        </div>

        {/* Text Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F0F6FF] dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 text-[11px] font-bold border border-[#DCE8F7] dark:border-blue-900">
            <Sparkles className="w-3 h-3" />
            <span>Protected Campus Area</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#172033] dark:text-white tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 max-w-xs mx-auto">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => openAuthModal('signin')}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all active:scale-[0.98]"
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In to Your Account</span>
          </button>

          <button
            onClick={() => openAuthModal('signup')}
            className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-[#F0F6FF] dark:hover:bg-slate-750 text-[#2563EB] dark:text-blue-400 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 border border-[#DCE8F7] dark:border-slate-700 transition-all active:scale-[0.98]"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Create Student Account</span>
          </button>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('demo')}
              className="text-[11px] font-bold text-[#64748B] hover:text-[#2563EB] dark:hover:text-blue-400 underline underline-offset-4 transition-colors"
            >
              Explore Demo Personas
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => setCurrentView('home')}
              className="text-[11px] font-bold text-[#64748B] hover:text-[#172033] dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <Home className="w-3 h-3" />
              <span>Back to Feed</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
