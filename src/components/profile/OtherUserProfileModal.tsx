import React, { useState } from 'react';
import {
  X,
  UserPlus,
  UserCheck,
  MessageSquare,
  Share2,
  CheckCircle2,
  MapPin,
  Briefcase,
  School,
  Sparkles,
  Calendar,
  Activity,
  Image as ImageIcon,
  Tag,
  FileText,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MoodboardPosterModal } from './MoodboardPosterModal';
import { ProfileActivity } from '../../types';

export const OtherUserProfileModal: React.FC = () => {
  const {
    viewingProfileUser,
    closeUserProfileModal,
    followedUserIds,
    toggleFollowUser,
    isFollowingUser,
    startConversationWithStudent,
    setNotificationToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'files' | 'activities' | 'skills' | 'bio'>('files');
  const [activePoster, setActivePoster] = useState<{
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    tag?: string;
  } | null>(null);

  if (!viewingProfileUser) return null;

  const user = viewingProfileUser;
  const isFollowing = isFollowingUser(user.id);

  const moodboards = user.moodboardGallery || [
    {
      id: 'mb_1',
      title: 'Signal Echo',
      subtitle: 'VISUAL IDENTITY • TOUCH INTERRUPTED',
      image: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      tag: 'PORTFOLIO 01'
    },
    {
      id: 'mb_2',
      title: 'Warm Silhouette',
      subtitle: 'CHROMA DATA • CREATIVE DESIGN',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      tag: 'EDITORIAL'
    },
    {
      id: 'mb_3',
      title: 'Ethereal Noise',
      subtitle: 'DIGITAL SCULPTING • EXHIBITION',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      tag: 'MOODBOARD'
    },
    {
      id: 'mb_4',
      title: 'Horizon Sprint',
      subtitle: 'TECH PROTOTYPE & DESIGN SYSTEM',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      tag: 'PROJECT'
    }
  ];

  const activities: ProfileActivity[] = user.recentActivities || [
    {
      id: 'act_1',
      title: '⚽ 6v6 Football Match',
      category: 'Sports',
      date: 'Yesterday • 6:00 PM',
      location: user.location || 'Sports Ground',
      status: 'completed'
    },
    {
      id: 'act_2',
      title: '💃 Zonal Cultural Fest Rehearsal',
      category: 'Dance',
      date: '2 days ago • 4:00 PM',
      location: 'Auditorium Green Room',
      status: 'completed'
    },
    {
      id: 'act_3',
      title: '💻 Hackathon UI/UX Design Sprint',
      category: 'Coding',
      date: 'Last Weekend',
      location: 'Tech Hub',
      status: 'completed'
    }
  ];

  const renderOccupationBadge = () => {
    if (user.occupationType === 'school_student') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-xs font-bold text-slate-900 shadow-xs">
          <School className="w-3.5 h-3.5 text-amber-600" />
          <span>School Student • {user.degree || user.year || 'Student'}</span>
        </div>
      );
    }
    if (user.occupationType === 'creator_freelancer') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-xs font-bold text-slate-900 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Creator / Freelance • {user.degree || 'Creative Tech'}</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-xs font-bold text-slate-900 shadow-xs">
        <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
        <span>Working Professional • {user.degree || 'Professional'}</span>
      </div>
    );
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
    } catch {}
    setNotificationToast({
      message: 'Profile Link Copied! 🔗',
      subtext: `Share ${user.name}'s profile with friends.`
    });
  };

  const handleStartChat = () => {
    closeUserProfileModal();
    startConversationWithStudent(user, 'Profile Connect', `Hi ${user.name.split(' ')[0]}! Checked out your profile.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white border border-[#DCE8F7] rounded-[2.5rem] max-w-md w-full p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-4 text-[#172033]">
        {/* Top Floating Controls */}
        <div className="flex items-center justify-between pb-1 border-b border-[#DCE8F7]">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#2563EB] uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Member Profile File</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-[#F8FBFF] hover:bg-white text-[#64748B] border border-[#DCE8F7] transition-colors"
              title="Share Profile"
            >
              <Share2 className="w-3.5 h-3.5 text-[#2563EB]" />
            </button>

            <button
              onClick={closeUserProfileModal}
              className="p-2 rounded-full bg-[#F8FBFF] hover:bg-white text-[#64748B] hover:text-[#172033] border border-[#DCE8F7] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Card Top */}
        <div className="relative rounded-3xl overflow-hidden p-6 bg-gradient-to-br from-[#E0EAFF] via-[#C7D7FE] to-[#BFDBFE] border border-[#DCE8F7] shadow-md text-[#172033] text-center space-y-3">
          {/* Avatar Ring */}
          <div className="relative inline-block mx-auto">
            <div className="p-1 rounded-full bg-white shadow-xl">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-[#DCE8F7]"
              />
            </div>
            {user.verifiedCollege && (
              <span className="absolute bottom-0 right-0 bg-[#2563EB] text-white p-1 rounded-full ring-2 ring-white" title="Verified Profile">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          {/* Name & Followers */}
          <div className="space-y-0.5 px-2">
            <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172033] break-words leading-tight">
              {user.name}
            </h2>
            <p className="text-xs font-semibold text-[#172033]">
              {((user.followersCount || 1240) + (isFollowing ? 1 : 0)).toLocaleString()} <span className="font-medium text-[#64748B]">Followers</span>
            </p>
          </div>

          {/* Occupation Badge & Location */}
          <div className="space-y-1.5 pt-1">
            <div>{renderOccupationBadge()}</div>
            <div className="flex items-center justify-center gap-2 text-xs text-[#172033] font-semibold flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{user.location || user.locationZone || 'Nearby Area'}</span>
              </span>
              {user.distanceDisplay && (
                <span className="bg-white/90 border border-[#DCE8F7] text-[#2563EB] text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                  📍 {user.distanceDisplay}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons: Follow & Message */}
          <div className="grid grid-cols-2 gap-2 pt-2 max-w-xs mx-auto">
            <button
              onClick={() => toggleFollowUser(user.id)}
              className={`py-2.5 px-4 rounded-full text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${
                isFollowing
                  ? 'bg-white text-[#2563EB] border border-[#DCE8F7]'
                  : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md shadow-blue-500/20'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Follow</span>
                </>
              )}
            </button>

            <button
              onClick={handleStartChat}
              className="py-2.5 px-4 rounded-full bg-[#172033] hover:bg-[#1D4ED8] text-white text-xs font-black shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message</span>
            </button>
          </div>

          {/* Role Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {(user.roleTags || ['Creative Designer', 'Visual Artist']).map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-[#172033] text-[10px] font-bold flex items-center gap-1"
              >
                <span className="text-[#2563EB]">✺</span>
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Horizontal Metric Stats */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="p-2 rounded-2xl bg-[#F8FBFF] border border-[#DCE8F7]">
            <span className="text-[9px] text-[#64748B] font-bold block">Sessions</span>
            <span className="text-xs font-black text-[#172033] block mt-0.5">
              {(user.sessionsCount || 4280).toLocaleString()}
            </span>
          </div>

          <div className="p-2 rounded-2xl bg-[#F8FBFF] border border-[#DCE8F7]">
            <span className="text-[9px] text-[#64748B] font-bold block">Age</span>
            <span className="text-xs font-black text-[#172033] block mt-0.5">
              {user.age || 22} y.o
            </span>
          </div>

          <div className="p-2 rounded-2xl bg-[#F8FBFF] border border-[#DCE8F7]">
            <span className="text-[9px] text-[#64748B] font-bold block">Works</span>
            <span className="text-xs font-black text-[#172033] block mt-0.5">
              {(user.worksCount || 640).toLocaleString()}
            </span>
          </div>

          <div className="p-2 rounded-2xl bg-[#F8FBFF] border border-[#DCE8F7]">
            <span className="text-[9px] text-[#64748B] font-bold block">Activities</span>
            <span className="text-xs font-black text-[#172033] block mt-0.5">
              {user.activitiesCompleted || 18}
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#F8FBFF] rounded-2xl border border-[#DCE8F7] text-[11px] font-bold">
          <button
            onClick={() => setActiveTab('files')}
            className={`py-1.5 rounded-xl transition-all ${
              activeTab === 'files' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172033]'
            }`}
          >
            Portfolio & Files
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`py-1.5 rounded-xl transition-all ${
              activeTab === 'activities' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172033]'
            }`}
          >
            Activities
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`py-1.5 rounded-xl transition-all ${
              activeTab === 'skills' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172033]'
            }`}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveTab('bio')}
            className={`py-1.5 rounded-xl transition-all ${
              activeTab === 'bio' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172033]'
            }`}
          >
            Bio & About
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-3 min-h-[140px]">
          {/* 1. Portfolio Files / Moodboards */}
          {activeTab === 'files' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#172033]">Uploaded Works & File Gallery</span>
                <span className="text-[10px] text-[#64748B]">{moodboards.length} items</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {moodboards.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setActivePoster(item)}
                    className="relative aspect-3/4 rounded-2xl overflow-hidden border border-[#DCE8F7] shadow-xs cursor-pointer group transform hover:scale-102 transition-all bg-[#F0F6FF]"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-white">
                      <span className="text-[8px] font-black uppercase tracking-wider text-[#BFDBFE]">{item.tag}</span>
                      <h4 className="font-editorial text-sm font-bold uppercase truncate">{item.title}</h4>
                      <span className="text-[9px] text-[#DCE8F7]">Tap to inspect file ↗</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Activities */}
          {activeTab === 'activities' && (
            <div className="space-y-2">
              {activities.map(act => (
                <div
                  key={act.id}
                  className="p-3 rounded-2xl bg-white border border-[#DCE8F7] shadow-xs flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-xs text-[#172033]">{act.title}</h4>
                    <p className="text-[10px] text-[#64748B]">{act.location} • {act.date}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold uppercase">
                    {act.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 3. Skills & Interests */}
          {activeTab === 'skills' && (
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-[#172033] block mb-1.5">Skills & Talents:</span>
                <div className="flex flex-wrap gap-1.5">
                  {user.skills.map(sk => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-full bg-[#F0F6FF] border border-[#DCE8F7] text-[#2563EB] text-xs font-bold"
                    >
                      #{sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[#172033] block mb-1.5">Interests & Hobbies:</span>
                <div className="flex flex-wrap gap-1.5">
                  {user.interests.map(intr => (
                    <span
                      key={intr}
                      className="px-2.5 py-1 rounded-full bg-[#F8FBFF] border border-[#DCE8F7] text-[#172033] text-xs font-bold"
                    >
                      {intr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. Bio & About */}
          {activeTab === 'bio' && (
            <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-[#DCE8F7] space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB]">About Statement</span>
              <p className="text-xs text-[#172033] leading-relaxed italic">
                "{user.bio || 'Active member on MEMA finding partners for sports, skills, and creative plans.'}"
              </p>
            </div>
          )}
        </div>

        {/* Bottom Close Action */}
        <div className="pt-2 border-t border-[#DCE8F7] flex justify-end">
          <button
            onClick={closeUserProfileModal}
            className="px-5 py-2 rounded-full bg-[#F8FBFF] hover:bg-white text-[#64748B] hover:text-[#172033] border border-[#DCE8F7] font-bold text-xs transition-colors"
          >
            Close File
          </button>
        </div>
      </div>

      {/* Moodboard Poster Detail Modal when inspecting artwork/file */}
      {activePoster && (
        <MoodboardPosterModal
          poster={activePoster}
          onClose={() => setActivePoster(null)}
        />
      )}
    </div>
  );
};
