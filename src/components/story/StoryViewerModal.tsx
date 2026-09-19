import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  UserCheck,
  FileText,
  Heart,
  Send,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StoryViewerModal: React.FC = () => {
  const {
    activeStoryUser,
    closeStoryViewer,
    openUserProfileModal,
    toggleFollowUser,
    isFollowingUser,
    startConversationWithStudent,
    setNotificationToast
  } = useApp();

  const [replyText, setReplyText] = useState('');
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const isPaused = isHolding || isInputFocused;

  // Reset progress when active story user changes
  useEffect(() => {
    setProgress(0);
  }, [activeStoryUser?.id]);

  // Auto-play timer for the current user's story (smooth 5-second progress, seamlessly paused on hold)
  useEffect(() => {
    if (!activeStoryUser || isPaused) return;

    const duration = 5000; // 5 seconds per story
    const intervalMs = 50;
    const step = (intervalMs / duration) * 100;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          closeStoryViewer();
          return 100;
        }
        return prev + step;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [activeStoryUser?.id, isPaused, closeStoryViewer]);

  if (!activeStoryUser) return null;

  const user = activeStoryUser;
  const isFollowing = isFollowingUser(user.id);

  // Story updates based on user
  const storyData: Record<string, { image: string; caption: string; tag: string }> = {
    stu_1: {
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      caption: '💃 Rehearsing our folk choreography for the upcoming fest! Need 1 more dancer.',
      tag: 'CULTURAL FEST'
    },
    stu_2: {
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      caption: '📚 Late night problem solving sprint at Central Library. Anyone working on circuits?',
      tag: 'STUDY SPRINT'
    },
    stu_3: {
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      caption: '⚽ 7v7 match today at 6 PM! Need a solid goalkeeper & 1 striker.',
      tag: 'SPORTS'
    },
    stu_4: {
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      caption: '💻 Building a real-time UI design system for the upcoming weekend hackathon.',
      tag: 'TECH SPRINT'
    },
    stu_5: {
      image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
      caption: '🏏 Evening nets practice under the floodlights. Join in for batting practice!',
      tag: 'CRICKET NETS'
    },
    stu_6: {
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      caption: '🎸 Jamming acoustic covers tonight. Looking for a cajon / percussion player.',
      tag: 'MUSIC SESSION'
    },
    stu_7: {
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      caption: '🏸 Morning badminton sparring session at North Delhi Sports Arena! Looking for a doubles partner.',
      tag: 'BADMINTON'
    },
    stu_8: {
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      caption: '💪 Calisthenics bodyweight workout session this evening at North Delhi Fitness Park. Come join!',
      tag: 'CALISTHENICS'
    }
  };

  const story = storyData[user.id] || {
    image: user.avatar,
    caption: `🔥 Active update from ${user.name} — looking for activity partners nearby!`,
    tag: 'ACTIVE STORY'
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    startConversationWithStudent(
      user,
      'Story Reply',
      `Replying to your story: "${replyText.trim()}"`
    );

    setReplyText('');
    setNotificationToast({
      message: 'Reply Sent! 💬',
      subtext: `Your message was delivered to ${user.name.split(' ')[0]}.`
    });
    closeStoryViewer();
  };

  const handleOpenProfileFile = () => {
    closeStoryViewer();
    openUserProfileModal(user);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black animate-in fade-in duration-200">
      <div
        onPointerDown={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('button, input, textarea, a, form')) return;
          setIsHolding(true);
        }}
        onPointerUp={() => setIsHolding(false)}
        onPointerLeave={() => setIsHolding(false)}
        onPointerCancel={() => setIsHolding(false)}
        onContextMenu={(e) => e.preventDefault()}
        className="relative w-full sm:max-w-sm h-full sm:h-[88vh] sm:max-h-[760px] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-0 sm:border sm:border-white/15 flex flex-col justify-between text-white group bg-slate-950 select-none cursor-pointer"
      >
        {/* Background Artwork */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={story.image}
            alt={user.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${isHolding ? 'scale-[1.02]' : 'scale-100'}`}
          />
          {/* Subtle gradient overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/75" />
        </div>

        {/* Top Header & Single Progress Bar for this user */}
        <div className="relative z-20 p-4 pt-5 space-y-3 pointer-events-auto">
          {/* Single Clean Progress Bar */}
          <div className="w-full h-1 bg-white/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-75 ease-linear rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>

          {/* User Info & Controls */}
          <div className="flex items-center justify-between gap-2">
            <div
              onClick={handleOpenProfileFile}
              className="flex items-center gap-2.5 cursor-pointer group/user min-w-0 flex-1"
              title="Click to open full profile file"
            >
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#1E40AF] to-[#609AFA] shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-white"
                />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-extrabold text-sm text-white group-hover/user:text-blue-200 transition-colors truncate">
                    {user.name}
                  </h3>
                  {isHolding ? (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-bold shrink-0 animate-pulse">
                      Paused
                    </span>
                  ) : (
                    <span className="text-[10px] text-white/70 shrink-0">• Active now</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-white/80 truncate">
                  <MapPin className="w-3 h-3 text-blue-300 shrink-0" />
                  <span className="truncate">{user.distanceDisplay || user.location || 'Nearby'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Follow Button inside Story */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollowUser(user.id);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1 shadow-md ${
                  isFollowing
                    ? 'bg-white/20 backdrop-blur-md text-white border border-white/30'
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md shadow-blue-500/20'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-3 h-3" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3" />
                    <span>Follow</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeStoryViewer();
                }}
                className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/20 transition-all active:scale-95"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Center Story Content & Caption */}
        <div className="relative z-20 p-5 space-y-3 pointer-events-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-wider text-blue-300">
            {story.tag}
          </div>

          <p className="text-sm sm:text-base font-semibold text-white leading-relaxed drop-shadow-md bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/15">
            {story.caption}
          </p>

          {/* Quick Open File Dossier CTA */}
          <button
            onClick={handleOpenProfileFile}
            className="w-full py-2.5 px-4 rounded-2xl bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg"
          >
            <FileText className="w-4 h-4 text-blue-300" />
            <span>Open {user.name.split(' ')[0]}'s Profile File ↗</span>
          </button>
        </div>

        {/* Bottom Reply Bar */}
        <div className="relative z-20 p-4 bg-black/60 backdrop-blur-md border-t border-white/10 pointer-events-auto">
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              onChange={e => setReplyText(e.target.value)}
              placeholder={`Reply to ${user.name.split(' ')[0]}...`}
              className="flex-1 bg-white/10 border border-white/20 focus:border-blue-400 rounded-full px-4 py-2.5 text-xs text-white placeholder-white/50 focus:outline-none"
            />

            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2.5 rounded-full border transition-all ${
                isLiked
                  ? 'bg-rose-500 border-rose-500 text-white scale-110'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
            </button>

            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white transition-all shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
