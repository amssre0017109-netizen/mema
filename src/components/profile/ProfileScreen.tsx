import React, { useState, useRef } from 'react';
import {
  X,
  Edit3,
  Settings,
  Sparkles,
  Zap,
  CheckCircle2,
  Award,
  Layers,
  Image as ImageIcon,
  Share2,
  Bookmark,
  MapPin,
  Building,
  GraduationCap,
  Briefcase,
  School,
  Clock,
  Calendar,
  Activity,
  User,
  Heart,
  Camera,
  Upload,
  Sun,
  Moon,
  Shield,
  Sliders,
  Crown,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EditProfileStudioModal } from './EditProfileStudioModal';
import { MoodboardPosterModal } from './MoodboardPosterModal';
import { ProfileActivity } from '../../types';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    setNotificationToast,
    isPremium,
    triggerProfileBoost,
    setCurrentView,
    theme,
    openSettingsModal
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'activities' | 'skills' | 'interests' | 'bio' | 'posters'>('activities');
  const [activePoster, setActivePoster] = useState<{
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    tag?: string;
  } | null>(null);

  const moodboards = currentUser.moodboardGallery || [
    {
      id: 'mb_1',
      title: 'red lips',
      subtitle: 'SIGNAL ECHO DATA • TOUCH INTERRUPTED',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      tag: 'POSTER 01'
    },
    {
      id: 'mb_2',
      title: 'warm silhouette',
      subtitle: 'CHROMA DATA • VISUAL IDENTITY',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      tag: 'EDITORIAL'
    },
    {
      id: 'mb_3',
      title: 'ethereal noise',
      subtitle: 'CAMPUS ART DIRECTION',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      tag: 'MOODBOARD'
    },
    {
      id: 'mb_4',
      title: 'neon horizon',
      subtitle: 'DIGITAL SCULPTING',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      tag: 'CONCEPT'
    }
  ];

  const occupationType = currentUser.occupationType === 'college_student' ? 'working_professional' : (currentUser.occupationType || 'working_professional');

  const renderOccupationBadge = () => {
    if (occupationType === 'school_student') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-xs font-bold text-slate-900 shadow-xs">
          <School className="w-3.5 h-3.5 text-amber-600" />
          <span>School Student • {currentUser.degree || currentUser.year || 'Student'}</span>
        </div>
      );
    }
    if (occupationType === 'creator_freelancer') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-xs font-bold text-slate-900 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Creator / Freelance • {currentUser.degree || 'Design & Tech'}</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-xs font-bold text-slate-900 shadow-xs">
        <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
        <span>Working Professional • {currentUser.degree || 'Professional'}</span>
      </div>
    );
  };

  const activities: ProfileActivity[] = currentUser.recentActivities || [
    {
      id: 'act_1',
      title: '⚽ 6v6 Football Match',
      category: 'Sports',
      date: 'Yesterday • 6:00 PM',
      location: 'DTU Main Football Ground',
      status: 'completed'
    },
    {
      id: 'act_2',
      title: '💃 Zonal Fest Bhangra Rehearsal',
      category: 'Dance',
      date: '2 days ago • 4:00 PM',
      location: 'Main Auditorium Green Room',
      status: 'completed'
    },
    {
      id: 'act_3',
      title: '💻 AI Hackathon UI/UX Design Sprint',
      category: 'Coding',
      date: 'Last Weekend',
      location: 'Tech Commons Block B',
      status: 'completed'
    },
    {
      id: 'act_4',
      title: '📚 Physics & Circuits Midsem Study Group',
      category: 'Study',
      date: 'Ongoing this week',
      location: 'Central Library 2nd Floor',
      status: 'ongoing'
    }
  ];

  const handleDeviceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setNotificationToast({
          message: 'Invalid File',
          subtext: 'Please select an image file (PNG, JPG, JPEG, WEBP).'
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCurrentUser(prev => ({
            ...prev,
            avatar: reader.result as string
          }));
          setNotificationToast({
            message: '📷 Profile Picture Updated!',
            subtext: 'Your custom photo from this device has been applied.'
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F6FF] text-[#172033] pb-36 pt-2 sm:pt-4">
      <div className="max-w-xl mx-auto px-4 space-y-4">
        {/* =========================================================================
            1. HERO PROFILE CARD (Modern Clean Glass Aesthetic)
           ========================================================================= */}
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl border border-[#DCE8F7] bg-gradient-to-b from-[#E0EAFF] via-[#C7D7FE] to-[#BFDBFE] p-5 sm:p-6 text-[#172033] space-y-5">
          {/* Subtle artistic glow in background */}
          <div className="absolute top-0 left-0 right-0 h-80 pointer-events-none opacity-30 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
              alt="Silhouette"
              className="w-full h-full object-cover filter blur-2xl scale-125 translate-y-[-10%] mix-blend-overlay"
            />
          </div>

          {/* Hidden File Input for Device Photo Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleDeviceImageUpload}
          />

          {/* 1. Top Bar: Edit profile button (left), Settings gear button (middle) and ✕ (right) */}
          <div className="relative z-10 flex items-center justify-between">
            <button
              onClick={() => setIsStudioOpen(true)}
              className="px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md hover:bg-white border border-white/80 text-[#172033] text-xs font-bold transition-all active:scale-95 shadow-xs flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Edit profile</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openSettingsModal('appearance')}
                className="px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-md hover:bg-white border border-white/80 text-[#172033] text-xs font-bold transition-all active:scale-95 shadow-xs flex items-center gap-1.5"
                title="Settings & Preferences"
              >
                <Settings className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="hidden sm:inline">Settings</span>
              </button>

              <button
                onClick={() => setCurrentView('home')}
                className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-md hover:bg-white border border-white/80 text-[#172033] flex items-center justify-center transition-all active:scale-95"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. Cutout Profile Avatar with Camera Trigger */}
          <div className="relative z-10 text-center space-y-2.5 pt-4">
            <div className="relative inline-block group">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-1 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] shadow-xl cursor-pointer transform group-hover:scale-105 transition-transform"
                title="Tap to change profile picture from device"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white"
                />
              </div>

              {/* Camera Icon Overlay on Hover/Tap */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="Upload Photo from Device"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>

              {/* Camera Badge in bottom-left */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 left-0 bg-white/90 backdrop-blur-md hover:bg-white border border-[#DCE8F7] text-[#2563EB] p-1.5 rounded-full ring-2 ring-white shadow-md transition-all active:scale-95"
                title="Change Photo from Device"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              {currentUser.verifiedCollege && (
                <span className="absolute bottom-0 right-0 bg-[#2563EB] text-white p-1 rounded-full ring-2 ring-white" title="Verified Profile">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              )}
            </div>

            {/* Followers Count */}
            <div>
              <p className="text-xs font-bold text-[#172033] tracking-wide">
                {(currentUser.followersCount || 21348).toLocaleString()} <span className="font-medium text-[#64748B]">Followers</span>
              </p>
            </div>

            {/* 3. Name (Serif Title) */}
            <div className="px-2">
              <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-[#172033] drop-shadow-xs break-words leading-tight">
                {currentUser.name}
              </h1>
            </div>

            {/* 4. Occupation Status Badge */}
            <div className="pt-0.5">
              {renderOccupationBadge()}
            </div>

            {/* 5. Location Field */}
            <div className="flex items-center justify-center gap-1 text-xs text-[#172033] font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{currentUser.location || currentUser.locationZone || 'Delhi, India'}</span>
            </div>

            {/* 6. Role Badges (✺) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 max-w-xs mx-auto">
              {(currentUser.roleTags || ['Creative Designer', 'Visual Artist', 'Life Coach']).map((tag, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-[#172033] text-[11px] font-bold flex items-center gap-1 shadow-xs"
                >
                  <span className="text-[#2563EB]">✺</span>
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Horizontal Threads Stats Row */}
          <div className="relative z-10 space-y-1.5 pt-3">
            <div className="text-center">
              <span className="text-[11px] font-bold text-[#172033] tracking-wide uppercase">
                Threads
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              <div className="p-2 rounded-2xl bg-white/60 backdrop-blur-md border border-white/70 text-center">
                <span className="text-[9px] text-[#64748B] block font-bold truncate">Sessions</span>
                <span className="text-xs sm:text-sm font-black text-[#172033] block mt-0.5">
                  {(currentUser.sessionsCount || 5983).toLocaleString()}
                </span>
              </div>

              <div className="p-2 rounded-2xl bg-white/60 backdrop-blur-md border border-white/70 text-center">
                <span className="text-[9px] text-[#64748B] block font-bold truncate">Age</span>
                <span className="text-xs sm:text-sm font-black text-[#172033] block mt-0.5">
                  {currentUser.age || 23} y.o
                </span>
              </div>

              <div className="p-2 rounded-2xl bg-white/60 backdrop-blur-md border border-white/70 text-center">
                <span className="text-[9px] text-[#64748B] block font-bold truncate">Works</span>
                <span className="text-xs sm:text-sm font-black text-[#172033] block mt-0.5">
                  {currentUser.worksCount || 751}
                </span>
              </div>

              <div className="p-2 rounded-2xl bg-white/60 backdrop-blur-md border border-white/70 text-center">
                <span className="text-[9px] text-[#64748B] block font-bold truncate">Mood boards</span>
                <span className="text-xs sm:text-sm font-black text-[#172033] block mt-0.5">
                  {currentUser.moodboardsCount || 38}
                </span>
              </div>

              <div className="p-2 rounded-2xl bg-white/60 backdrop-blur-md border border-white/70 text-center">
                <span className="text-[9px] text-[#64748B] block font-bold truncate">Prompts</span>
                <span className="text-xs sm:text-sm font-black text-[#172033] block mt-0.5">
                  {currentUser.promptsCount || 142}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STRUCTURED PROFILE CONTENT TABS
            (Activities, Skills, Interests, Bio, Posters)
           ========================================================================= */}
        <div className="space-y-4">
          {/* Tabs Selector */}
          <div className="flex items-center justify-between border-b border-[#DCE8F7] pb-2 overflow-x-auto scrollbar-none gap-2">
            <button
              onClick={() => setActiveTab('activities')}
              className={`pb-1 text-xs font-bold transition-all relative shrink-0 ${
                activeTab === 'activities' ? 'text-[#2563EB]' : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              <span>⚡ Activities ({activities.length})</span>
              {activeTab === 'activities' && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`pb-1 text-xs font-bold transition-all relative shrink-0 ${
                activeTab === 'skills' ? 'text-[#2563EB]' : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              <span>🎯 Skills ({currentUser.skills.length})</span>
              {activeTab === 'skills' && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('interests')}
              className={`pb-1 text-xs font-bold transition-all relative shrink-0 ${
                activeTab === 'interests' ? 'text-[#2563EB]' : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              <span>✨ Interests</span>
              {activeTab === 'interests' && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('bio')}
              className={`pb-1 text-xs font-bold transition-all relative shrink-0 ${
                activeTab === 'bio' ? 'text-[#2563EB]' : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              <span>📝 Bio</span>
              {activeTab === 'bio' && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('posters')}
              className={`pb-1 text-xs font-bold transition-all relative shrink-0 ${
                activeTab === 'posters' ? 'text-[#2563EB]' : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              <span>🖼️ Posters</span>
              {activeTab === 'posters' && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
              )}
            </button>
          </div>

          {/* Tab 1: Activities */}
          {activeTab === 'activities' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  Recent Activities & Meetups
                </span>
                <span className="text-[11px] text-[#2563EB] font-bold">
                  {currentUser.activitiesCompleted} Total Completed
                </span>
              </div>

              <div className="space-y-2.5">
                {activities.map(act => (
                  <div
                    key={act.id}
                    className="bg-white border border-[#DCE8F7] rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F8FBFF] text-[#2563EB] border border-[#DCE8F7] uppercase">
                          {act.category}
                        </span>
                        <h4 className="font-extrabold text-sm text-[#172033]">{act.title}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#64748B]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#2563EB]" />
                          <span>{act.date}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#2563EB]" />
                          <span>{act.location}</span>
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                      act.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {act.status === 'completed' ? '✓ Completed' : '⚡ Ongoing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Skills */}
          {activeTab === 'skills' && (
            <div className="bg-white border border-[#DCE8F7] rounded-3xl p-5 space-y-4 shadow-xs">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  Verified Skills & Talents
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentUser.skills.map(sk => (
                    <span
                      key={sk}
                      className="px-3.5 py-1.5 rounded-full bg-[#F8FBFF] border border-[#DCE8F7] text-[#2563EB] text-xs font-extrabold shadow-xs"
                    >
                      #{sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Interests */}
          {activeTab === 'interests' && (
            <div className="bg-white border border-[#DCE8F7] rounded-3xl p-5 space-y-3 shadow-xs">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                Interests, Hobbies & Societies
              </span>
              <div className="flex flex-wrap gap-2">
                {currentUser.interests.map(int => (
                  <span
                    key={int}
                    className="px-3 py-1.5 rounded-full bg-[#F8FBFF] border border-[#DCE8F7] text-[#172033] text-xs font-semibold"
                  >
                    ✨ {int}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Bio */}
          {activeTab === 'bio' && (
            <div className="bg-white border border-[#DCE8F7] rounded-3xl p-5 space-y-3 shadow-xs">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                About Me / Bio
              </span>
              <p className="text-xs sm:text-sm text-[#172033] leading-relaxed italic bg-[#F8FBFF] p-4 rounded-2xl border border-[#DCE8F7]">
                "{currentUser.bio}"
              </p>
              <div className="text-[11px] text-[#64748B] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Base Location: {currentUser.location || currentUser.locationZone}</span>
              </div>
            </div>
          )}

          {/* Tab 5: Posters Gallery */}
          {activeTab === 'posters' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  Editorial Posters & Moodboards
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Tap to view poster
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {moodboards.map(mb => (
                  <div
                    key={mb.id}
                    onClick={() => setActivePoster(mb)}
                    className="relative rounded-3xl overflow-hidden aspect-[3/4] bg-[#F0F6FF] border border-[#DCE8F7] group cursor-pointer shadow-xs hover:scale-[1.02] transition-transform duration-300"
                  >
                    <img
                      src={mb.image}
                      alt={mb.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent flex flex-col justify-end p-4">
                      <span className="text-[9px] font-mono font-bold tracking-widest text-[#BFDBFE] uppercase">
                        {mb.tag}
                      </span>
                      <h3 className="font-display text-lg font-black text-white uppercase leading-tight mt-0.5">
                        {mb.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              SETTINGS & ACCOUNT CONTROLS MENU
             ========================================================================= */}
          <div className="bg-white border border-[#DCE8F7] rounded-3xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-[#2563EB]" />
                Account & Settings
              </span>
              <span className="text-[11px] font-bold text-[#2563EB]">
                {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Bright Mode'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => openSettingsModal('appearance')}
                className="p-3 rounded-2xl bg-[#F8FBFF] hover:bg-white border border-[#DCE8F7] text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs font-extrabold text-[#172033]">Theme & Display</div>
                <div className="text-[10px] text-[#64748B]">Dark / Bright Mode</div>
              </button>

              <button
                type="button"
                onClick={() => openSettingsModal('privacy')}
                className="p-3 rounded-2xl bg-[#F8FBFF] hover:bg-white border border-[#DCE8F7] text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <Shield className="w-4 h-4 text-[#2563EB]" />
                  <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs font-extrabold text-[#172033]">Privacy & Safety</div>
                <div className="text-[10px] text-[#64748B]">Ghost Mode, Blocked</div>
              </button>

              <button
                type="button"
                onClick={() => openSettingsModal('preferences')}
                className="p-3 rounded-2xl bg-[#F8FBFF] hover:bg-white border border-[#DCE8F7] text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs font-extrabold text-[#172033]">Preferences</div>
                <div className="text-[10px] text-[#64748B]">Radar & Push Alerts</div>
              </button>

              <button
                type="button"
                onClick={() => openSettingsModal('location')}
                className="p-3 rounded-2xl bg-[#F8FBFF] hover:bg-white border border-[#DCE8F7] text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs font-extrabold text-[#172033]">Location Spot</div>
                <div className="text-[10px] text-[#64748B] truncate">{currentUser.location?.split(',')[0] || 'Nearby'}</div>
              </button>

              <button
                type="button"
                onClick={() => openSettingsModal('premium')}
                className="p-3 rounded-2xl bg-amber-50/70 hover:bg-amber-100 border border-amber-200/60 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs font-extrabold text-[#172033]">MEMA VIP</div>
                <div className="text-[10px] text-amber-700 font-semibold">{isPremium ? 'Active Plan' : 'Free / Upgrade'}</div>
              </button>

              <button
                type="button"
                onClick={() => openSettingsModal('help')}
                className="p-3 rounded-2xl bg-[#F8FBFF] hover:bg-white border border-[#DCE8F7] text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                  <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs font-extrabold text-[#172033]">Help & Support</div>
                <div className="text-[10px] text-[#64748B]">FAQs & Live Chat</div>
              </button>

              <button
                type="button"
                onClick={() => openSettingsModal('terms')}
                className="p-3 rounded-2xl bg-[#F8FBFF] hover:bg-white border border-[#DCE8F7] text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <FileText className="w-4 h-4 text-[#64748B]" />
                  <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs font-extrabold text-[#172033]">Terms & Policy</div>
                <div className="text-[10px] text-[#64748B]">Legal & Code</div>
              </button>

              <button
                type="button"
                onClick={() => openSettingsModal('logout')}
                className="p-3 rounded-2xl bg-rose-50/70 hover:bg-rose-100 border border-rose-200/60 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <ChevronRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs font-extrabold text-rose-600">Logout</div>
                <div className="text-[10px] text-rose-400">Sign out session</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Studio Modal */}
      <EditProfileStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
      />

      {/* Moodboard Poster Modal */}
      <MoodboardPosterModal
        poster={activePoster}
        onClose={() => setActivePoster(null)}
      />
    </div>
  );
};
