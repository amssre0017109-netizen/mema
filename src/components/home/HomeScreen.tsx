import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  Clock,
  CheckCircle2,
  Users,
  Building,
  Sparkles,
  Zap,
  MoreHorizontal,
  Flag,
  UserX,
  X,
  UserPlus,
  UserCheck,
  ChevronRight,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RequestCategory, CampusRequest } from '../../types';
import { tool_parse_intent, tool_search_and_rank_requests, ParsedIntent } from '../../services/askMemaEngine';

export const HomeScreen: React.FC = () => {
  const {
    currentUser,
    allStudents,
    filteredRequests,
    setIsCreateRequestModalOpen,
    setActiveInterestTargetRequest,
    toggleLikeRequest,
    startConversationWithStudent,
    openReportModal,
    blockUser,
    selectedCategory,
    setSelectedCategory,
    selectedCampus,
    myCampusOnly,
    setMyCampusOnly,
    setCurrentView,
    setNotificationToast,
    followedUserIds,
    toggleFollowUser,
    isFollowingUser,
    openUserProfileModal,
    openStoryViewer
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'campus'>('all');
  const [activeMenuRequestId, setActiveMenuRequestId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [dismissedSuggestionIds, setDismissedSuggestionIds] = useState<string[]>([]);

  const followedStudents = allStudents.filter(s => followedUserIds.includes(s.id));
  const suggestedToFollow = allStudents.filter(s => !followedUserIds.includes(s.id));

  // Nearby profile suggestions sorted by proximity
  const nearbySuggestions = allStudents
    .filter(s => s.id !== currentUser.id && !dismissedSuggestionIds.includes(s.id))
    .sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));

  const dismissSuggestion = (studentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedSuggestionIds(prev => [...prev, studentId]);
    setNotificationToast({
      message: 'Suggestion hidden ✕',
      subtext: 'We will show fewer profiles like this.'
    });
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    setNotificationToast({
      message: bookmarkedIds.includes(id) ? 'Removed from Saved' : 'Request Saved 🔖',
      subtext: 'You can access your saved requests anytime.'
    });
  };

  // 🧠 CONTROLLED AGENTIC PARSER: Parse natural language intent
  const parsedIntent: ParsedIntent = useMemo(() => {
    return tool_parse_intent(searchQuery);
  }, [searchQuery]);

  // 🧠 CONTROLLED AGENTIC SEARCH TOOL: Search and rank requests
  const rankedRequestResults = useMemo(() => {
    return tool_search_and_rank_requests(parsedIntent, filteredRequests);
  }, [parsedIntent, filteredRequests]);

  const searchFilteredRequests = rankedRequestResults.map(r => r.request);

  const handleShare = (req: CampusRequest) => {
    try {
      navigator.clipboard.writeText(window.location.href);
    } catch {}
    setNotificationToast({
      message: 'Link Copied! 🔗',
      subtext: `Share "${req.title}" with your friends.`
    });
  };

  // High quality realistic imagery for request cards
  const requestImages: Record<string, string> = {
    req_1: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80', // Football
    req_2: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', // Dance / Fest
    req_3: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80', // Library / Physics
    req_4: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', // Coding / Laptop
    req_5: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', // Gym
    req_6: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80'  // Cricket
  };

  return (
    <div className="min-h-screen bg-[#F0F6FF] text-[#172033] pb-36 pt-3 sm:pt-5">
      <div className="max-w-xl mx-auto px-4 space-y-5">
        {/* =========================================================================
            1. INTELLIGENT 'ASK MEMA' SEARCH BAR
           ========================================================================= */}
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
              <Search className="w-4 h-4 text-[#2563EB]" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='Ask MEMA: "football match today" or search plans...'
              className="w-full bg-white border border-[#DCE8F7] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 rounded-full pl-11 pr-10 py-3 text-xs sm:text-sm text-[#172033] placeholder-[#64748B] focus:outline-none shadow-xs transition-all"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#64748B] hover:text-[#172033] hover:bg-[#F8FBFF] transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ⚡ Ask MEMA Intelligent Interpretation Pill */}
          {parsedIntent.isNaturalLanguage && parsedIntent.summaryText && (
            <div className="p-2.5 rounded-2xl bg-[#F8FBFF] border border-[#DCE8F7] text-xs flex items-center justify-between gap-2 shadow-2xs animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center gap-1.5 text-[#2563EB] font-bold min-w-0">
                <Target className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate text-[11px] sm:text-xs">
                  <strong>Ask MEMA:</strong> {parsedIntent.summaryText}
                </span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F0F6FF] text-[#2563EB] border border-[#DCE8F7] shrink-0">
                {searchFilteredRequests.length} {searchFilteredRequests.length === 1 ? 'activity' : 'activities'}
              </span>
            </div>
          )}
        </div>

        {/* =========================================================================
            2. HORIZONTAL STORY CAROUSEL (Followed Users + Suggested to Follow)
           ========================================================================= */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
              Following Stories ({followedStudents.length})
            </span>
            <span className="text-[10px] text-[#2563EB] font-bold">Tap to view</span>
          </div>

          <div className="flex items-center gap-3.5 overflow-x-auto pb-1.5 pt-1 scrollbar-none">
            {/* User's own story circle */}
            <div
              onClick={() => setIsCreateRequestModalOpen(true)}
              className="w-[76px] sm:w-[80px] flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full p-[2.5px] bg-[#F8FBFF] border-2 border-[#DCE8F7] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <img
                    src={currentUser.avatar}
                    alt="You"
                    className="w-[52px] h-[52px] rounded-full object-cover ring-2 ring-white"
                  />
                </div>
                <span className="absolute bottom-0 right-0 bg-[#2563EB] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shadow-xs ring-2 ring-white">
                  +
                </span>
              </div>
              <div className="h-5 flex items-center justify-center w-full">
                <span className="text-[11px] font-semibold text-[#64748B] truncate text-center px-0.5">Your Story</span>
              </div>
            </div>

            {/* Followed users story circles */}
            {followedStudents.map(student => (
              <div
                key={student.id}
                onClick={() => openStoryViewer(student)}
                className="w-[76px] sm:w-[80px] flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                title={`View ${student.name}'s live story & file`}
              >
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-[52px] h-[52px] rounded-full object-cover ring-2 ring-white"
                    />
                  </div>
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#2563EB] rounded-full ring-2 ring-white animate-pulse" />
                </div>
                <div className="h-5 flex items-center justify-center w-full">
                  <span className="text-[11px] font-bold text-[#172033] truncate text-center px-0.5">
                    {student.name.split(' ')[0]}
                  </span>
                </div>
              </div>
            ))}

            {/* Suggested users to follow */}
            {suggestedToFollow.map(student => (
              <div
                key={student.id}
                className="w-[76px] sm:w-[80px] flex flex-col items-center gap-1.5 shrink-0 group"
              >
                <div
                  onClick={() => openUserProfileModal(student)}
                  className="relative w-16 h-16 flex items-center justify-center cursor-pointer"
                  title={`View ${student.name}'s Profile File`}
                >
                  <div className="w-16 h-16 rounded-full p-[2.5px] border-2 border-dashed border-[#DCE8F7] group-hover:border-[#2563EB] flex items-center justify-center group-hover:scale-105 transition-all bg-white">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-[52px] h-[52px] rounded-full object-cover ring-2 ring-white opacity-95 group-hover:opacity-100"
                    />
                  </div>
                </div>
                <div className="h-5 flex items-center justify-center w-full px-1">
                  <button
                    type="button"
                    onClick={() => toggleFollowUser(student.id)}
                    className="w-full py-0.5 rounded-full bg-[#F8FBFF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white border border-[#DCE8F7] text-[10px] font-black tracking-tight transition-colors shadow-2xs text-center truncate"
                  >
                    + Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            2.5. NEARBY PROFILE SUGGESTIONS (People Near You)
           ========================================================================= */}
        {nearbySuggestions.length > 0 && (
          <div className="bg-white border border-[#DCE8F7] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F0F6FF] border border-[#DCE8F7] flex items-center justify-center text-[#2563EB]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-extrabold text-[#172033] font-display">
                      People Near You
                    </h2>
                    <span className="bg-[#2563EB] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-2xs">
                      Radar
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    Discover talent & peers around your location
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentView('discover')}
                className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-0.5 hover:underline"
              >
                <span>View Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Horizontal Scrollable Nearby Profile Cards */}
            <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
              {nearbySuggestions.map(student => {
                const isFollowing = isFollowingUser(student.id);
                return (
                  <div
                    key={student.id}
                    className="w-[225px] sm:w-[245px] shrink-0 bg-white border border-[#DCE8F7] hover:border-[#2563EB] rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative group"
                  >
                    {/* Top row: Proximity chip & Dismiss (X) */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F0F6FF] border border-[#DCE8F7] text-[#2563EB] text-[10px] font-extrabold">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>{student.distanceDisplay || (student.distanceKm ? (student.distanceKm <= 0.5 ? 'Nearby (~500m)' : student.distanceKm <= 1 ? '~Within 1 km' : `~${Math.round(student.distanceKm)} km away`) : 'Nearby Area')}</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => dismissSuggestion(student.id, e)}
                        title="Hide suggestion"
                        className="text-[#64748B] hover:text-[#172033] p-1 rounded-full hover:bg-[#F8FBFF] transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Avatar & Info (clickable to open profile modal) */}
                    <div
                      onClick={() => openUserProfileModal(student)}
                      className="cursor-pointer text-center flex flex-col items-center group/card"
                    >
                      <div className="relative mb-2">
                        <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] group-hover/card:scale-105 transition-transform">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-full h-full rounded-full object-cover ring-2 ring-white"
                          />
                        </div>
                        {student.onlineStatus === 'active_now' && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white" title="Active Now" />
                        )}
                      </div>

                      <div className="flex items-center gap-1 max-w-full justify-center px-1">
                        <h4 className="font-extrabold text-sm text-[#172033] leading-snug group-hover/card:text-[#2563EB] transition-colors truncate">
                          {student.name}
                        </h4>
                        {student.verifiedCollege && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] font-medium text-[#64748B] truncate w-full px-1 mt-0.5">
                        {student.degree || student.college}
                      </p>
                      <p className="text-[10px] text-[#64748B] truncate w-full px-1 mt-0.5">
                        {student.locationZone || student.location}
                      </p>
                    </div>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1 justify-center my-2.5">
                      {student.skills.slice(0, 2).map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md bg-[#F8FBFF] text-[#2563EB] border border-[#DCE8F7] text-[10px] font-bold truncate max-w-[105px]"
                        >
                          #{skill}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons: Follow + Chat */}
                    <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[#DCE8F7]">
                      <button
                        type="button"
                        onClick={() => toggleFollowUser(student.id)}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-extrabold transition-all flex items-center justify-center gap-1 ${
                          isFollowing
                            ? 'bg-[#F8FBFF] text-[#2563EB] border border-[#DCE8F7]'
                            : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs'
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

                      <button
                        type="button"
                        onClick={() => startConversationWithStudent(student, 'Nearby Connection')}
                        className="py-1.5 px-2 rounded-xl text-[11px] font-bold bg-white hover:bg-[#F8FBFF] border border-[#DCE8F7] text-[#172033] hover:text-[#2563EB] transition-colors flex items-center justify-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3 text-[#2563EB]" />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            3. TOP TAB SWITCHER ("All Needs | Nearby (5 km)")
           ========================================================================= */}
        <div className="flex items-center justify-between border-b border-[#DCE8F7] pb-2">
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                setActiveTab('all');
                setMyCampusOnly(false);
              }}
              className={`text-sm font-extrabold transition-all relative pb-2 ${
                activeTab === 'all'
                  ? 'text-[#172033]'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              <span>All Needs</span>
              {activeTab === 'all' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('campus');
                setMyCampusOnly(true);
              }}
              className={`text-sm font-extrabold transition-all relative pb-2 ${
                activeTab === 'campus'
                  ? 'text-[#172033]'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              <span>Nearby (5 km)</span>
              {activeTab === 'campus' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
              )}
            </button>
          </div>

          <button
            onClick={() => setIsCreateRequestModalOpen(true)}
            className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] hover:underline flex items-center gap-1"
          >
            <span>+ Post Need</span>
          </button>
        </div>

        {/* =========================================================================
            4. FEED CARDS (Clean White + Soft Blue Highlights)
           ========================================================================= */}
        <div className="space-y-5">
          {searchFilteredRequests.map(req => {
            const isCreator = req.creator.id === currentUser.id;
            const alreadyExpressed = req.interestedUsers.some(u => u.id === currentUser.id);
            const isBookmarked = bookmarkedIds.includes(req.id);
            const isMenuOpen = activeMenuRequestId === req.id;

            const matchingSkills = currentUser.skills.filter(sk =>
              req.requiredSkills.some(r => r.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(r.toLowerCase()))
            );

            const cardImage = requestImages[req.id] || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';

            const partnerProfile = allStudents.find(s => s.id === req.creator.id) || {
              id: req.creator.id,
              name: req.creator.name,
              age: 21,
              college: 'Nearby',
              degree: req.creator.degree || 'Member',
              year: req.creator.year || 'Active',
              location: req.location,
              avatar: req.creator.avatar,
              verifiedCollege: req.creator.verifiedCollege,
              studentIdVerified: true,
              skills: req.requiredSkills,
              interests: req.requiredSkills,
              activitiesCompleted: 12,
              requestsPosted: 4,
              bio: `Active organizer in ${req.location}`,
              locationZone: req.location,
              onlineStatus: 'active_now' as const
            };

            return (
              <div
                key={req.id}
                className="bg-white border border-[#DCE8F7] rounded-3xl overflow-hidden shadow-xs hover:shadow-md card-light-hover space-y-3"
              >
                {/* 1. Header Row (Avatar, Name, Timestamp, More Options) */}
                <div className="p-4 sm:p-5 pb-0 flex items-center justify-between gap-2">
                  <div
                    onClick={() => openUserProfileModal(partnerProfile)}
                    className="flex items-center gap-3 cursor-pointer group/creator min-w-0 flex-1"
                    title={`Open ${req.creator.name}'s Profile File`}
                  >
                    <img
                      src={req.creator.avatar}
                      alt={req.creator.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#DCE8F7] group-hover/creator:ring-[#2563EB] transition-all shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-extrabold text-sm sm:text-base text-[#172033] group-hover/creator:text-[#2563EB] transition-colors truncate">
                          {req.creator.name}
                        </h4>
                        {req.creator.verifiedCollege && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#64748B] truncate">
                        {req.location} • {req.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 relative shrink-0">
                    {req.isUrgent && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-extrabold uppercase">
                        Urgent
                      </span>
                    )}

                    <button
                      onClick={() => setActiveMenuRequestId(isMenuOpen ? null : req.id)}
                      className="p-1.5 rounded-full text-[#64748B] hover:text-[#172033] hover:bg-[#F8FBFF]"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Menu Dropdown */}
                    {isMenuOpen && (
                      <div className="absolute right-0 top-8 w-44 bg-white border border-[#DCE8F7] rounded-2xl p-1.5 shadow-xl shadow-blue-500/10 z-30 space-y-1 text-xs">
                        <button
                          onClick={() => {
                            openReportModal('request', req.id, req.title);
                            setActiveMenuRequestId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-[#F8FBFF] text-[#172033] font-semibold flex items-center gap-2"
                        >
                          <Flag className="w-3.5 h-3.5 text-rose-500" />
                          <span>Report Request</span>
                        </button>
                        <button
                          onClick={() => {
                            openReportModal('user', req.creator.id, req.creator.name);
                            setActiveMenuRequestId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Block User</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Visual Media Card Banner with Overlay Meta */}
                <div className="px-4 sm:px-5">
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#F0F6FF] border border-[#DCE8F7] group">
                    <img
                      src={cardImage}
                      alt={req.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/25 to-transparent flex flex-col justify-end p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#2563EB] text-[10px] font-black uppercase tracking-wider self-start mb-1 shadow-xs border border-[#DCE8F7]">
                        {req.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-white leading-tight drop-shadow-md">
                        {req.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* 3. Key Meta & Details Row */}
                <div className="px-4 sm:px-5 space-y-2 text-xs">
                  <div className="flex items-center justify-between bg-[#F8FBFF] p-3 rounded-2xl border border-[#DCE8F7] text-[#172033]">
                    <span className="flex items-center gap-1.5 font-semibold text-[#172033]">
                      <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{req.date} • {req.time}</span>
                    </span>

                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{req.location}</span>
                    </span>

                    <span className="flex items-center gap-1.5 text-[#64748B]">
                      <Users className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>Need {req.peopleNeeded}</span>
                    </span>
                  </div>

                  {/* Skill match highlight banner */}
                  {matchingSkills.length > 0 && !isCreator && (
                    <div className="px-3 py-1.5 rounded-xl bg-[#F0F6FF] border border-[#DCE8F7] text-[#2563EB] text-[11px] font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 fill-[#2563EB] text-[#2563EB]" />
                      <span>Skill Match: You have <strong>"{matchingSkills[0]}"</strong> in your profile!</span>
                    </div>
                  )}

                  {/* Caption */}
                  <p className="text-[#172033] leading-relaxed text-xs">
                    {req.description}
                  </p>
                </div>

                {/* 4. Interactive Reactions & Action Row */}
                <div className="p-4 sm:p-5 pt-1 border-t border-[#DCE8F7] flex items-center justify-between">
                  {/* Left Reactions Icons */}
                  <div className="flex items-center gap-4 text-[#64748B] text-xs">
                    <button
                      onClick={() => toggleLikeRequest(req.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        req.likedByMe ? 'text-rose-500' : 'hover:text-[#172033]'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${req.likedByMe ? 'fill-rose-500' : ''}`} />
                      <span className="font-bold">{req.likesCount || 0}</span>
                    </button>

                    <button
                      onClick={() => {
                        const partner = allStudents.find(s => s.id === req.creator.id) || {
                          id: req.creator.id,
                          name: req.creator.name,
                          age: 21,
                          college: req.creator.college,
                          degree: 'Student',
                          year: 'Campus',
                          avatar: req.creator.avatar,
                          verifiedCollege: true,
                          studentIdVerified: true,
                          skills: req.requiredSkills,
                          interests: req.requiredSkills,
                          activitiesCompleted: 12,
                          requestsPosted: 3,
                          bio: `Student at ${req.creator.college}`,
                          locationZone: req.location,
                          onlineStatus: 'active_now'
                        };
                        startConversationWithStudent(partner, req.title);
                      }}
                      className="flex items-center gap-1.5 hover:text-[#172033] transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-bold">{req.commentsCount || 0}</span>
                    </button>

                    <button
                      onClick={() => handleShare(req)}
                      className="hover:text-[#172033] transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => toggleBookmark(req.id)}
                      className={`transition-colors ${isBookmarked ? 'text-[#2563EB]' : 'hover:text-[#172033]'}`}
                    >
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-[#2563EB]' : ''}`} />
                    </button>
                  </div>

                  {/* Right Blue Pill Action CTA */}
                  <div>
                    {isCreator ? (
                      <button
                        onClick={() => setCurrentView('activities')}
                        className="px-4 py-2 rounded-full bg-[#F8FBFF] hover:bg-white text-[#2563EB] border border-[#DCE8F7] text-xs font-bold transition-all"
                      >
                        Manage ({req.interestedUsers.length})
                      </button>
                    ) : alreadyExpressed ? (
                      <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        ✓ Interested
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveInterestTargetRequest(req)}
                        className="px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-black shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                      >
                        Interested
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
