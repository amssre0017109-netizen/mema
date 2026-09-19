import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  AlertCircle,
  Users,
  Building,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CAMPUS_OPTIONS, MOCK_STUDENTS } from '../../data/mockData';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

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

  const [mode, setMode] = useState<'signin' | 'signup' | 'demo'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState(CAMPUS_OPTIONS[0]);
  const [occupationType, setOccupationType] = useState<'school_student' | 'creator_freelancer' | 'working_professional'>('school_student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        setErrorMessage('Please enter both email and password.');
        setLoading(false);
        return;
      }

      // If connected to Supabase
      if (isSupabaseConfigured) {
        const { supabase } = await import('../../lib/supabaseClient');
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          setAuthUser(data.user);
          setNotificationToast({
            message: '🎉 Welcome Back!',
            subtext: `Signed in as ${data.user.email}`
          });
        }
      } else {
        // Fallback / Demo Session
        const matched = MOCK_STUDENTS.find(s => s.name.toLowerCase().includes(email.split('@')[0].toLowerCase())) || currentUser;
        setCurrentUser({
          ...matched,
          name: fullName || matched.name,
          college: college || matched.college
        });
        setAuthUser({
          id: matched.id,
          email: email.trim(),
          user_metadata: { name: fullName || matched.name }
        });
        setNotificationToast({
          message: '✓ Signed In (Demo Mode)',
          subtext: `Active profile: ${matched.name}`
        });
      }

      triggerMatchCelebration();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setErrorMessage('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        setLoading(false);
        return;
      }

      if (isSupabaseConfigured) {
        const { supabase } = await import('../../lib/supabaseClient');
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              name: fullName.trim(),
              college: college,
              occupation_type: occupationType,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
            }
          }
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          setAuthUser(data.user);
          setCurrentUser(prev => ({
            ...prev,
            id: data.user!.id,
            name: fullName.trim(),
            college: college,
            occupationType: occupationType
          }));
        }
      } else {
        // Fallback / Demo Profile Creation
        const newProfile = {
          ...currentUser,
          id: `usr_${Date.now()}`,
          name: fullName.trim(),
          college: college,
          occupationType: occupationType,
          verifiedCollege: true,
          studentIdVerified: true
        };
        setCurrentUser(newProfile);
        setAuthUser({
          id: newProfile.id,
          email: email.trim(),
          user_metadata: { name: fullName.trim(), college: college }
        });
      }

      setNotificationToast({
        message: '🚀 Account Created!',
        subtext: `Welcome to MEMA, ${fullName.trim()}!`
      });
      triggerMatchCelebration();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoPersona = (student: typeof MOCK_STUDENTS[0]) => {
    setCurrentUser(student);
    setAuthUser({
      id: student.id,
      email: `${student.name.toLowerCase().replace(/\s+/g, '')}@campus.mema.in`,
      user_metadata: { name: student.name, college: student.college }
    });
    setNotificationToast({
      message: `👤 Switched Profile: ${student.name}`,
      subtext: `Role: ${student.degree} • ${student.college}`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#DCE8F7] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-b from-[#F0F6FF] to-white border-b border-[#DCE8F7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-[#172033] tracking-tight">
                  MEMA Auth
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F0F6FF] border border-[#DCE8F7] text-[#2563EB] font-bold text-[10px]">
                  {isSupabaseConfigured ? 'Supabase Live' : 'Demo Mode'}
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Campus & Skill Network Authentication
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#F8FBFF] hover:bg-[#F0F6FF] text-[#64748B] hover:text-[#172033] border border-[#DCE8F7] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 p-2 bg-[#F8FBFF] border-b border-[#DCE8F7] gap-1">
          <button
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'signin'
                ? 'bg-white text-[#2563EB] shadow-xs border border-[#DCE8F7]'
                : 'text-[#64748B] hover:text-[#172033]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'signup'
                ? 'bg-white text-[#2563EB] shadow-xs border border-[#DCE8F7]'
                : 'text-[#64748B] hover:text-[#172033]'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => { setMode('demo'); setErrorMessage(null); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'demo'
                ? 'bg-white text-[#2563EB] shadow-xs border border-[#DCE8F7]'
                : 'text-[#64748B] hover:text-[#172033]'
            }`}
          >
            Demo Users
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Student / Campus Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@campus.ac.in or student@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#DCE8F7] text-xs text-[#172033] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#172033]">
                    Password
                  </label>
                  <span className="text-[10px] text-[#64748B]">Min 6 characters</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#DCE8F7] text-xs text-[#172033] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#64748B] hover:text-[#172033]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to MEMA</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setMode('demo')}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  ⚡ Want to test without sign-in? Switch to Demo Persona
                </button>
              </div>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Tanya Sharma or Rohan Gupta"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#DCE8F7] text-xs text-[#172033] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Campus / College
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                  <select
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#DCE8F7] text-xs text-[#172033] focus:outline-none focus:border-[#2563EB]"
                  >
                    {CAMPUS_OPTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Campus Role / Category
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
                          : 'bg-[#F8FBFF] text-[#64748B] border-[#DCE8F7] hover:bg-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@college.edu or name@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#DCE8F7] text-xs text-[#172033] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#DCE8F7] text-xs text-[#172033] focus:outline-none focus:border-[#2563EB]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#64748B] hover:text-[#172033]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Free Student Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {mode === 'demo' && (
            <div className="space-y-3">
              <p className="text-xs text-[#64748B]">
                Click any campus profile to instantly log in as that student without needing credentials:
              </p>

              <div className="space-y-2">
                {MOCK_STUDENTS.map(student => (
                  <button
                    key={student.id}
                    onClick={() => handleSelectDemoPersona(student)}
                    className="w-full p-3 rounded-2xl border border-[#DCE8F7] hover:border-[#2563EB] bg-[#F8FBFF] hover:bg-white transition-all text-left flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#DCE8F7] group-hover:ring-[#2563EB]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-[#172033]">
                            {student.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F0F6FF] text-[#2563EB] font-bold">
                            {student.degree}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#64748B] truncate max-w-[200px]">
                          {student.college} • {student.skills.slice(0, 2).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-white border border-[#DCE8F7] text-[10px] font-extrabold text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                      Switch
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#F8FBFF] border-t border-[#DCE8F7] text-center text-[10px] text-[#64748B] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Encrypted Supabase PostgreSQL Auth • 100% Student Privacy</span>
        </div>
      </div>
    </div>
  );
};
