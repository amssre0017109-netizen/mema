import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Users,
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import {
  signInWithEmail,
  resetPasswordForEmail
} from '../../services/authService';
import { supabaseService } from '../../services/supabaseService';
import { UserProfile } from '../../types';

export const LoginScreen: React.FC = () => {
  const {
    setCurrentUser,
    setAuthUser,
    setCurrentView,
    setNotificationToast,
    triggerMatchCelebration
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim() || !emailRegex.test(email.trim())) {
        setErrorMessage('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      if (!password.trim()) {
        setErrorMessage('Please enter your password.');
        setLoading(false);
        return;
      }

      const res = await signInWithEmail(email.trim(), password.trim());

      if (!res.success) {
        setErrorMessage(res.error || 'Sign in failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      if (res.user) {
        setAuthUser(res.user);
        try {
          localStorage.setItem('mema_auth_session', JSON.stringify(res.user));
        } catch {}

        let activeProfile: UserProfile | null = null;
        if (isSupabaseConfigured) {
          try {
            activeProfile = await supabaseService.getProfileById(res.user.id);
          } catch (err) {
            console.warn('Error fetching live profile upon login:', err);
          }
        }

        if (!activeProfile) {
          activeProfile = {
            id: res.user.id,
            name: res.user.user_metadata?.name || email.split('@')[0],
            age: 21,
            occupationType: res.user.user_metadata?.occupation_type || 'working_professional',
            college: res.user.user_metadata?.location || 'Connaught Place, New Delhi',
            degree: 'Student',
            year: '1st Year',
            location: res.user.user_metadata?.location || 'Connaught Place, New Delhi',
            locationZone: res.user.user_metadata?.location || 'Connaught Place, New Delhi',
            distanceKm: 0.5,
            distanceDisplay: 'Nearby',
            avatar: res.user.user_metadata?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
            verifiedCollege: true,
            studentIdVerified: true,
            skills: res.user.user_metadata?.skills || [],
            interests: [],
            activitiesCompleted: 0,
            requestsPosted: 0,
            recentActivities: [],
            bio: res.user.user_metadata?.bio || 'Verified MEMA Member',
            onlineStatus: 'active_now',
            roleTags: [],
            followersCount: 0,
            sessionsCount: 0,
            worksCount: 0,
            moodboardsCount: 0,
            promptsCount: 0,
            moodboardGallery: [],
            isGuest: false
          };
        }

        setCurrentUser(activeProfile);
        try {
          localStorage.setItem('mema_user_profile', JSON.stringify(activeProfile));
        } catch {}

        setNotificationToast({
          message: '✓ Signed In Successfully',
          subtext: `Welcome back, ${activeProfile.name}!`
        });

        triggerMatchCelebration();
        setCurrentView('home');
      }
    } catch (err: any) {
      console.error('Sign in exception:', err);
      setErrorMessage(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    setResetLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);

    const res = await resetPasswordForEmail(resetEmail.trim());
    setResetLoading(false);

    if (res.success) {
      setInfoMessage('Password recovery link has been sent to your email.');
      setResetEmail('');
      setShowForgotPassword(false);
    } else {
      setErrorMessage(res.error || 'Failed to send reset link.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F6FF] dark:bg-[#0A0F1D] text-[#172033] dark:text-[#F1F5F9] pb-24 pt-6 px-4 transition-colors">
      <div className="max-w-md mx-auto space-y-6">
        {/* Navigation Bar / Back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 text-xs font-bold text-[#64748B] dark:text-slate-400 hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Feed</span>
          </button>

          <button
            onClick={() => setCurrentView('signup')}
            className="text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:underline"
          >
            Create Account Instead →
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-[#2563EB] dark:text-blue-400 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome Back</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#172033] dark:text-white font-display">
              Sign In to MEMA
            </h1>

            <p className="text-xs text-[#64748B] dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Access your saved activities, private campus chats, and matched connections.
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl flex items-center gap-2.5 text-xs text-blue-700 dark:text-blue-300 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2563EB] dark:text-blue-400" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Sign In Form */}
          {!showForgotPassword ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#172033] dark:text-slate-200 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] dark:text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@college.edu or name@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 text-xs text-[#172033] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#172033] dark:text-slate-200">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setResetEmail(email);
                      setErrorMessage(null);
                    }}
                    className="text-[11px] font-bold text-[#2563EB] dark:text-blue-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] dark:text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 text-xs text-[#172033] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Signing In...
                  </span>
                ) : (
                  <>
                    <span>Sign In to MEMA</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-[#F0F6FF] dark:border-slate-800 flex items-center justify-between text-xs text-[#64748B] dark:text-slate-400">
                <span>New to MEMA?</span>
                <button
                  type="button"
                  onClick={() => setCurrentView('signup')}
                  className="font-bold text-[#2563EB] dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Create an account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#172033] dark:text-white">
                  Reset Account Password
                </h3>
                <p className="text-xs text-[#64748B] dark:text-slate-400">
                  Enter your registered email address to receive a secure password recovery link.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] dark:text-slate-200 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] dark:text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 text-xs text-[#172033] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-[#DCE8F7] dark:border-slate-700 text-xs font-bold text-[#64748B] dark:text-slate-300 hover:bg-[#F8FBFF] dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-1/2 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {resetLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Send Link</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
