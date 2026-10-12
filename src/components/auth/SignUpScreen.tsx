import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  MapPin,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ShieldCheck,
  Send,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import {
  signUpWithEmail,
  resendVerificationEmail
} from '../../services/authService';
import { supabaseService } from '../../services/supabaseService';
import { CURRENT_USER } from '../../data/mockData';
import { UserProfile } from '../../types';

export const SignUpScreen: React.FC = () => {
  const {
    setCurrentUser,
    setAuthUser,
    setCurrentView,
    setNotificationToast,
    triggerMatchCelebration,
    theme
  } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('Connaught Place, New Delhi');
  const [occupationType, setOccupationType] = useState<'school_student' | 'creator_freelancer' | 'working_professional'>('school_student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isVerificationPending, setIsVerificationPending] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setErrorMessage('Please enter your full name (at least 2 characters).');
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim() || !emailRegex.test(email.trim())) {
        setErrorMessage('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      if (!password.trim() || password.trim().length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        setLoading(false);
        return;
      }

      const res = await signUpWithEmail({
        email: email.trim(),
        password: password.trim(),
        name: fullName.trim(),
        fullName: fullName.trim(),
        location: location.trim(),
        occupationType
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      if (res.requiresEmailConfirmation) {
        setIsVerificationPending(true);
        setInfoMessage('Verification email sent! Please check your inbox.');
        setNotificationToast({
          message: '✉️ Verification Link Sent',
          subtext: `Confirmation link dispatched to ${email.trim()}.`
        });
        setLoading(false);
        return;
      }

      // Successful auto-confirmed registration or active session
      const newUserId = res.user?.id || `user_${Date.now()}`;
      const newProfile: UserProfile = {
        ...CURRENT_USER,
        id: newUserId,
        name: fullName.trim(),
        college: location.trim(),
        location: location.trim(),
        locationZone: location.trim(),
        occupationType,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
        isGuest: false,
        skills: ['Casual Meetups', 'Campus Activities'],
        interests: ['Sports', 'Study', 'Creative Projects']
      };

      setAuthUser(res.user || { id: newUserId, email: email.trim() });
      setCurrentUser(newProfile);

      try {
        localStorage.setItem('mema_auth_session', JSON.stringify(res.user || { id: newUserId, email: email.trim() }));
        localStorage.setItem('mema_user_profile', JSON.stringify(newProfile));
      } catch {}

      if (isSupabaseConfigured) {
        supabaseService.upsertProfile(newProfile).catch(err => {
          console.warn('Initial profile sync warning:', err);
        });
      }

      setNotificationToast({
        message: '🎉 Account Created Successfully!',
        subtext: `Welcome to MEMA, ${fullName.trim()}!`
      });

      triggerMatchCelebration();
      setCurrentView('home');
    } catch (err: any) {
      console.error('Sign up error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendLink = async () => {
    if (!email.trim()) return;
    setResendingEmail(true);
    setErrorMessage(null);
    setInfoMessage(null);

    const res = await resendVerificationEmail(email.trim());
    setResendingEmail(false);

    if (res.success) {
      setInfoMessage('A fresh verification link has been sent to your email.');
      setNotificationToast({
        message: '✓ Link Resent',
        subtext: `Check ${email.trim()} for your activation link.`
      });
    } else {
      setErrorMessage(res.error || 'Failed to resend email. Please try again in a few moments.');
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
            onClick={() => setCurrentView('login')}
            className="text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:underline"
          >
            Sign In Instead →
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-[#2563EB] dark:text-blue-400 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join MEMA Free</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#172033] dark:text-white font-display">
              Create Your Account
            </h1>

            <p className="text-xs text-[#64748B] dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Find partners for badminton, football, gym, study & campus activities in seconds.
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

          {/* Form or Email Verification Pending */}
          {!isVerificationPending ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#172033] dark:text-slate-200 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#64748B] dark:text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Tanya Sharma or Rohan Gupta"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 text-xs text-[#172033] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-[#172033] dark:text-slate-200 mb-1.5">
                  Location / Area <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#64748B] dark:text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Connaught Place, New Delhi or Hauz Khas"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 text-xs text-[#172033] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              {/* Profile Role */}
              <div>
                <label className="block text-xs font-bold text-[#172033] dark:text-slate-200 mb-1.5">
                  I am a
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'school_student', label: 'Student' },
                    { id: 'creator_freelancer', label: 'Creator' },
                    { id: 'working_professional', label: 'Professional' }
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setOccupationType(r.id as any)}
                      className={`py-2 rounded-xl text-[11px] font-bold border transition-all ${
                        occupationType === r.id
                          ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                          : 'bg-[#F8FBFF] dark:bg-slate-800 text-[#64748B] dark:text-slate-300 border-[#DCE8F7] dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#172033] dark:text-slate-200 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
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

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#172033] dark:text-slate-200">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-[#64748B] dark:text-slate-400">Min 6 characters</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] dark:text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Creating Your Account...
                  </span>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Terms Note */}
              <p className="text-[10px] text-center text-[#64748B] dark:text-slate-500 leading-tight pt-1">
                By joining MEMA, you agree to verified activity guidelines and safety standards.
              </p>

              {/* Switch to Sign In */}
              <div className="pt-4 border-t border-[#F0F6FF] dark:border-slate-800 flex items-center justify-between text-xs text-[#64748B] dark:text-slate-400">
                <span>Already have an account?</span>
                <button
                  type="button"
                  onClick={() => setCurrentView('login')}
                  className="font-bold text-[#2563EB] dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Sign in here</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            /* Email Verification Pending View */
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#2563EB] dark:text-blue-400 mx-auto flex items-center justify-center shadow-xs">
                <Mail className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-black text-[#172033] dark:text-white">
                  Verify Your Email Address
                </h2>
                <p className="text-xs text-[#64748B] dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
                  We've sent a verification link to <strong className="text-[#172033] dark:text-white">{email}</strong>.
                  Please click the link in your email to activate your account.
                </p>
              </div>

              <div className="p-3.5 bg-[#F8FBFF] dark:bg-slate-800 rounded-2xl border border-[#DCE8F7] dark:border-slate-700 text-xs text-[#64748B] dark:text-slate-400 space-y-2 text-left">
                <div className="flex items-center gap-1.5 font-bold text-[#172033] dark:text-white">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                  <span>Didn't receive the email?</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Check your spam/junk folder. If you still don't see it, click below to request a new link.
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={resendingEmail}
                  onClick={handleResendLink}
                  className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {resendingEmail ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Sending fresh link...
                    </span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Resend Confirmation Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView('login')}
                  className="w-full py-2.5 rounded-xl border border-[#DCE8F7] dark:border-slate-700 text-xs font-bold text-[#64748B] dark:text-slate-300 hover:text-[#172033] dark:hover:text-white hover:bg-[#F8FBFF] dark:hover:bg-slate-800 transition-colors"
                >
                  Proceed to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
