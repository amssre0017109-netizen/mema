import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  AlertCircle,
  Users,
  MapPin,
  Eye,
  EyeOff,
  RefreshCw,
  Send,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_STUDENTS } from '../../data/mockData';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import {
  signInWithEmail,
  signUpWithEmail,
  resendVerificationEmail,
  resetPasswordForEmail
} from '../../services/authService';
import { supabaseService } from '../../services/supabaseService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'demo';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin'
}) => {
  const {
    currentUser,
    setCurrentUser,
    setNotificationToast,
    triggerMatchCelebration,
    authUser,
    setAuthUser
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | 'demo' | 'verification_pending' | 'forgot_password'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('Connaught Place, New Delhi');
  const [occupationType, setOccupationType] = useState<'school_student' | 'creator_freelancer' | 'working_professional'>('school_student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

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
        if (res.error?.includes('not confirmed') || res.error?.includes('not verified')) {
          setErrorMessage(res.error);
          setMode('verification_pending');
        } else {
          setErrorMessage(res.error || 'Sign in failed. Please check your credentials.');
        }
        setLoading(false);
        return;
      }

      if (res.user) {
        setAuthUser(res.user);

        // Fetch user profile from Supabase database
        const dbProfile = await supabaseService.getProfileById(res.user.id);
        const activeProfile = dbProfile || {
          ...currentUser,
          id: res.user.id,
          name: res.user.user_metadata?.name || email.split('@')[0] || 'Member',
          location: res.user.user_metadata?.location || 'Connaught Place, New Delhi',
          locationZone: res.user.user_metadata?.locationZone || res.user.user_metadata?.location || 'Connaught Place, New Delhi',
          college: res.user.user_metadata?.college || 'Delhi Technological University (DTU)',
          isGuest: false
        };

        setCurrentUser(activeProfile);

        try {
          localStorage.setItem('mema_auth_session', JSON.stringify(res.user));
          localStorage.setItem('mema_user_profile', JSON.stringify(activeProfile));
        } catch {}

        setNotificationToast({
          message: '🎉 Welcome Back!',
          subtext: `Signed in as ${activeProfile.name}`
        });

        triggerMatchCelebration();
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

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
        setErrorMessage('Please enter a valid email address (e.g. name@domain.com).');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        setLoading(false);
        return;
      }

      const userLocation = location.trim() || 'Connaught Place, New Delhi';

      const res = await signUpWithEmail({
        name: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
        location: userLocation,
        occupationType
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to create account.');
        setLoading(false);
        return;
      }

      if (res.requiresEmailConfirmation) {
        // Supabase requires email verification
        setMode('verification_pending');
        setNotificationToast({
          message: '📬 Confirmation Email Sent',
          subtext: `Verification link sent to ${email.trim()}`
        });
        setLoading(false);
        return;
      }

      if (res.user) {
        setAuthUser(res.user);

        const newProfile = {
          ...currentUser,
          id: res.user.id,
          name: fullName.trim(),
          location: userLocation,
          locationZone: userLocation,
          college: userLocation,
          occupationType,
          verifiedCollege: true,
          studentIdVerified: true,
          isGuest: false
        };

        setCurrentUser(newProfile);

        try {
          localStorage.setItem('mema_auth_session', JSON.stringify(res.user));
          localStorage.setItem('mema_user_profile', JSON.stringify(newProfile));
        } catch {}

        setNotificationToast({
          message: '🚀 Account Created!',
          subtext: `Welcome to MEMA, ${fullName.trim()}!`
        });

        triggerMatchCelebration();
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address above.');
      return;
    }

    setResendingEmail(true);
    setErrorMessage(null);
    setInfoMessage(null);

    const res = await resendVerificationEmail(email.trim());
    setResendingEmail(false);

    if (res.success) {
      setInfoMessage(`Verification link resent to ${email.trim()}! Please check your spam/inbox folder.`);
      setNotificationToast({
        message: '✓ Email Resent',
        subtext: `Verification link sent to ${email.trim()}`
      });
    } else {
      setErrorMessage(res.error || 'Failed to resend confirmation email.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email address to reset password.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);

    const res = await resetPasswordForEmail(email.trim());
    setLoading(false);

    if (res.success) {
      setInfoMessage(`Password reset link sent to ${email.trim()}. Follow the instructions in your inbox.`);
      setNotificationToast({
        message: '🔑 Reset Link Sent',
        subtext: `Password instructions sent to ${email.trim()}`
      });
    } else {
      setErrorMessage(res.error || 'Failed to send password reset link.');
    }
  };

  const handleSelectDemoPersona = (student: typeof MOCK_STUDENTS[0]) => {
    const personaProfile = {
      ...student,
      isGuest: false
    };
    const userObj = {
      id: student.id,
      email: `${student.name.toLowerCase().replace(/\s+/g, '')}@campus.mema.in`,
      user_metadata: { name: student.name, college: student.college }
    };
    setCurrentUser(personaProfile);
    setAuthUser(userObj);
    try {
      localStorage.setItem('mema_auth_session', JSON.stringify(userObj));
      localStorage.setItem('mema_user_profile', JSON.stringify(personaProfile));
    } catch {}
    setNotificationToast({
      message: `👤 Switched Profile: ${student.name}`,
      subtext: `Role: ${student.degree} • ${student.college}`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-[#DCE8F7] dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-[#F0F6FF] to-white dark:from-slate-850 dark:to-slate-900 border-b border-[#DCE8F7] dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-[#172033] dark:text-white tracking-tight">
                  MEMA Auth
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F0F6FF] dark:bg-blue-950/60 border border-[#DCE8F7] dark:border-blue-900 text-[#2563EB] dark:text-blue-400 font-bold text-[10px]">
                  {isSupabaseConfigured ? 'Supabase Live' : 'Demo Mode'}
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Activity Partner & Skill Network
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#F8FBFF] dark:bg-slate-800 hover:bg-[#F0F6FF] dark:hover:bg-slate-700 text-[#64748B] dark:text-slate-300 hover:text-[#172033] dark:hover:text-white border border-[#DCE8F7] dark:border-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        {mode !== 'verification_pending' && mode !== 'forgot_password' && (
          <div className="grid grid-cols-3 p-2 bg-[#F8FBFF] dark:bg-slate-850 border-b border-[#DCE8F7] dark:border-slate-800 gap-1">
            <button
              onClick={() => { setMode('signin'); setErrorMessage(null); setInfoMessage(null); }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'signin'
                  ? 'bg-white dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 shadow-xs border border-[#DCE8F7] dark:border-slate-700'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setErrorMessage(null); setInfoMessage(null); }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 shadow-xs border border-[#DCE8F7] dark:border-slate-700'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => { setMode('demo'); setErrorMessage(null); setInfoMessage(null); }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'demo'
                  ? 'bg-white dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 shadow-xs border border-[#DCE8F7] dark:border-slate-700'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
              }`}
            >
              Demo Users
            </button>
          </div>
        )}

        {/* Error / Info Alerts */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {infoMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* 1. SIGN IN FORM */}
          {mode === 'signin' && (
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
                    placeholder="you@domain.com or student@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 text-xs text-[#172033] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#2563EB]"
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
                    onClick={() => { setMode('forgot_password'); setErrorMessage(null); setInfoMessage(null); }}
                    className="text-[11px] text-[#2563EB] dark:text-blue-400 hover:underline font-semibold"
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
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 text-xs text-[#172033] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#2563EB]"
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
                className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Signing In...
                  </span>
                ) : (
                  <>
                    <span>Sign In to MEMA</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 flex items-center justify-between text-xs text-[#64748B] dark:text-slate-400">
                <span>New to MEMA?</span>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMessage(null); setInfoMessage(null); }}
                  className="font-bold text-[#2563EB] dark:text-blue-400 hover:underline"
                >
                  Create an account →
                </button>
              </div>
            </form>
          )}

          {/* 2. SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#172033] dark:text-slate-200 mb-1.5">
                  Full Name
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

              <div>
                <label className="block text-xs font-bold text-[#172033] dark:text-slate-200 mb-1.5">
                  Location / Area
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

              <div>
                <label className="block text-xs font-bold text-[#172033] dark:text-slate-200 mb-1.5">
                  Role / Profile Category
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
                          ? 'bg-[#2563EB] text-white border-[#2563EB]'
                          : 'bg-[#F8FBFF] dark:bg-slate-800 text-[#64748B] dark:text-slate-300 border-[#DCE8F7] dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
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
                    Create Password
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 flex items-center justify-between text-xs text-[#64748B] dark:text-slate-400">
                <span>Already have an account?</span>
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrorMessage(null); setInfoMessage(null); }}
                  className="font-bold text-[#2563EB] dark:text-blue-400 hover:underline"
                >
                  Sign in here →
                </button>
              </div>
            </form>
          )}

          {/* 3. EMAIL VERIFICATION PENDING */}
          {mode === 'verification_pending' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#2563EB] dark:text-blue-400 mx-auto flex items-center justify-center">
                <Mail className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-extrabold text-[#172033] dark:text-white">
                  Verify Your Email Address
                </h3>
                <p className="text-xs text-[#64748B] dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
                  We've sent a verification link to <strong className="text-[#172033] dark:text-white">{email || 'your email'}</strong>. Please click the link to confirm your account.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FBFF] dark:bg-slate-800/80 border border-[#DCE8F7] dark:border-slate-700 text-left text-xs space-y-1 text-[#64748B] dark:text-slate-300">
                <div className="flex items-center gap-1.5 font-bold text-[#172033] dark:text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Next Steps:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  1. Open the email and click the confirmation link.<br />
                  2. Return here and sign in with your password.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={resendingEmail}
                  onClick={handleResendEmail}
                  className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-[#F0F6FF] dark:hover:bg-slate-750 text-[#2563EB] dark:text-blue-400 font-bold text-xs border border-[#DCE8F7] dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resendingEmail ? 'animate-spin' : ''}`} />
                  <span>{resendingEmail ? 'Resending Link...' : 'Resend Verification Email'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrorMessage(null); setInfoMessage(null); }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}

          {/* 4. FORGOT PASSWORD FORM */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#172033] dark:text-white">
                  Reset Account Password
                </h3>
                <p className="text-xs text-[#64748B] dark:text-slate-400">
                  Enter your registered email address to receive password reset instructions.
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
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@college.edu or you@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 text-xs text-[#172033] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Sending Link...
                    </span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Password Reset Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrorMessage(null); setInfoMessage(null); }}
                  className="w-full py-2.5 text-xs text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white font-bold"
                >
                  ← Return to Sign In
                </button>
              </div>
            </form>
          )}

          {/* 5. DEMO PERSONAS */}
          {mode === 'demo' && (
            <div className="space-y-3">
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                Click any campus profile to instantly log in as that student without needing credentials:
              </p>

              <div className="space-y-2">
                {MOCK_STUDENTS.map(student => (
                  <button
                    key={student.id}
                    onClick={() => handleSelectDemoPersona(student)}
                    className="w-full p-3 rounded-2xl border border-[#DCE8F7] dark:border-slate-800 hover:border-[#2563EB] dark:hover:border-blue-500 bg-[#F8FBFF] dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 transition-all text-left flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#DCE8F7] dark:ring-slate-700 group-hover:ring-[#2563EB] dark:group-hover:ring-blue-500"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-[#172033] dark:text-white">
                            {student.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F0F6FF] dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-bold border border-transparent dark:border-blue-900">
                            {student.degree}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#64748B] dark:text-slate-400 truncate max-w-[200px]">
                          {student.college} • {student.skills.slice(0, 2).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-white dark:bg-slate-700 border border-[#DCE8F7] dark:border-slate-600 text-[10px] font-extrabold text-[#2563EB] dark:text-blue-400 group-hover:bg-[#2563EB] dark:group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      Switch
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#F8FBFF] dark:bg-slate-850 border-t border-[#DCE8F7] dark:border-slate-800 text-center text-[10px] text-[#64748B] dark:text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
          <span>Encrypted Supabase PostgreSQL Auth • 100% Student Privacy</span>
        </div>
      </div>
    </div>
  );
};

