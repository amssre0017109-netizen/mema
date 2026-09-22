import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  Users,
  Search,
  MessageCircle,
  Building,
  UserPlus,
  UserCheck,
  X,
  Target,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SKILL_CATEGORIES } from '../../data/mockData';
import { BoostProfileWidget } from '../premium/BoostProfileWidget';
import { tool_parse_intent, tool_search_and_rank_users, ParsedIntent } from '../../services/askMemaEngine';

export const DiscoverScreen: React.FC = () => {
  const {
    allStudents,
    currentUser,
    startConversationWithStudent,
    openUserProfileModal,
    toggleFollowUser,
    isFollowingUser
  } = useApp();

  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [nearbyOnly, setNearbyOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 🧠 CONTROLLED AGENTIC PARSER: Parse natural language intent from search query
  const parsedIntent: ParsedIntent = useMemo(() => {
    return tool_parse_intent(searchQuery);
  }, [searchQuery]);

  // 🧠 CONTROLLED AGENTIC SEARCH TOOL: Search and rank peers using multi-factor relevancy
  const rankedResults = useMemo(() => {
    const rawRanked = tool_search_and_rank_users(parsedIntent, allStudents, currentUser);

    return rawRanked.filter(res => {
      const student = res.student;

      if (nearbyOnly && (student.distanceKm ?? 99) > 1.0) {
        return false;
      }

      if (selectedSkillFilter !== 'all') {
        const hasSkill = student.skills.some(
          s => s.toLowerCase() === selectedSkillFilter.toLowerCase()
        );
        if (!hasSkill) return false;
      }

      return true;
    });
  }, [parsedIntent, allStudents, currentUser, nearbyOnly, selectedSkillFilter]);

  const samplePrompts = [
    { label: '🏸 2 badminton partners near me', query: 'find me 2 badminton partners near me' },
    { label: '💻 React dev for hackathon', query: 'looking for react dev for weekend hackathon' },
    { label: '🏋️ Gym spotter today', query: 'need a gym spotter at DTU today' },
    { label: '🎸 Acoustic guitarist in North Campus', query: 'acoustic guitarist in North Campus' },
    { label: '📚 Physics study buddy', query: 'physics study partner at Central Library' }
  ];

  return (
    <div className="min-h-screen bg-[#F0F6FF] dark:bg-[#0A0F1D] text-[#172033] dark:text-slate-100 pb-36 pt-4 sm:pt-6 transition-colors">
      <div className="max-w-xl mx-auto px-4 space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] dark:text-blue-400 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Talent & Activity Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-[#172033] dark:text-white">
            Find People by Skill
          </h1>
          <p className="text-xs text-[#64748B] dark:text-slate-400">
            Connect with peers nearby for sports, music, coding, and activities.
          </p>
        </div>

        {/* Boost Widget */}
        <BoostProfileWidget />

        {/* =========================================================================
            INTELLIGENT 'ASK MEMA' SEARCH BAR
           ========================================================================= */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
              <Search className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='Ask MEMA: "find me 2 badminton partners near me"...'
              className="w-full bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#2563EB]/10 rounded-full pl-11 pr-10 py-3 text-xs sm:text-sm text-[#172033] dark:text-white placeholder-[#64748B] dark:placeholder-slate-500 focus:outline-none shadow-xs transition-all"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-[#F8FBFF] dark:hover:bg-slate-800 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ⚡ Ask MEMA Intelligent Interpretation Pill */}
          {parsedIntent.isNaturalLanguage && parsedIntent.summaryText && (
            <div className="p-2.5 rounded-2xl bg-[#F8FBFF] dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 text-xs flex items-center justify-between gap-2 shadow-2xs animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center gap-1.5 text-[#2563EB] dark:text-blue-400 font-bold min-w-0">
                <Target className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate text-[11px] sm:text-xs text-[#172033] dark:text-slate-200">
                  <strong className="text-[#2563EB] dark:text-blue-400">Ask MEMA:</strong> {parsedIntent.summaryText}
                </span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F0F6FF] dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 border border-[#DCE8F7] dark:border-slate-800 shrink-0">
                {rankedResults.length} {rankedResults.length === 1 ? 'match' : 'matches'}
              </span>
            </div>
          )}

          {/* Natural Language Suggestion Prompts */}
          {!searchQuery && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] font-bold text-[#64748B] dark:text-slate-400 shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#2563EB] dark:text-blue-400" /> Try:
              </span>
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSearchQuery(p.query)}
                  className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 hover:bg-[#F0F6FF] dark:hover:bg-slate-800 text-[#172033] dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-blue-400 border border-[#DCE8F7] dark:border-slate-800 text-[11px] font-semibold whitespace-nowrap transition-all shadow-2xs shrink-0 active:scale-95"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Quick Skill & Distance Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => {
                setNearbyOnly(false);
                setSelectedSkillFilter('all');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                !nearbyOnly && selectedSkillFilter === 'all'
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-[#F8FBFF] dark:hover:bg-slate-800 border border-[#DCE8F7] dark:border-slate-800 shadow-xs'
              }`}
            >
              ⚡ All Talent
            </button>

            <button
              onClick={() => setNearbyOnly(!nearbyOnly)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
                nearbyOnly
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-[#F8FBFF] dark:hover:bg-slate-800 border border-[#DCE8F7] dark:border-slate-800 shadow-xs'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>Nearby (&lt; 1 km)</span>
            </button>

            {['Badminton', 'Football', 'React / Web Dev', 'Gym Training', 'Physics', 'Cricket', 'Guitar', 'UI/UX Design', 'Bhangra'].map(sk => (
              <button
                key={sk}
                onClick={() => setSelectedSkillFilter(sk)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  selectedSkillFilter === sk
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-[#F8FBFF] dark:hover:bg-slate-800 border border-[#DCE8F7] dark:border-slate-800 shadow-xs'
                }`}
              >
                #{sk}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            STUDENTS DIRECTORY LIST (Intelligently Ranked)
           ========================================================================= */}
        <div className="space-y-4">
          {rankedResults.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-3xl p-8 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#F0F6FF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 flex items-center justify-center mx-auto text-[#2563EB] dark:text-blue-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#172033] dark:text-white">
                No exact talent matches found
              </h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400 max-w-sm mx-auto">
                Ask MEMA for a broader skill (e.g. "badminton players nearby" or "coding partner") or reset your filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSkillFilter('all');
                  setNearbyOnly(false);
                }}
                className="px-4 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            rankedResults.map(({ student, matchPercentage, matchReason, isTopChoice, choiceRank }) => {
              const isFollowing = isFollowingUser(student.id);

              return (
                <div
                  key={student.id}
                  className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-xs hover:shadow-md card-light-hover space-y-3 transition-all ${
                    isTopChoice && searchQuery
                      ? 'border-[#2563EB] dark:border-blue-500 ring-1 ring-[#2563EB]/20'
                      : 'border-[#DCE8F7] dark:border-slate-800'
                  }`}
                >
                  {/* Top Choice & Match Badge */}
                  {searchQuery && (
                    <div className="flex items-center justify-between gap-2 pb-1 border-b border-[#DCE8F7]/80 dark:border-slate-800 text-[11px]">
                      <div className="flex items-center gap-1.5 font-extrabold text-[#2563EB] dark:text-blue-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{matchPercentage}% Match</span>
                        <span className="text-[#64748B] dark:text-slate-400 font-medium hidden sm:inline">• {matchReason}</span>
                      </div>

                      {isTopChoice && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB] text-white text-[10px] font-black tracking-wide uppercase shadow-2xs">
                          ⭐ Top Choice #{choiceRank}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div
                      onClick={() => openUserProfileModal(student)}
                      className="flex items-center gap-3 cursor-pointer group/user flex-1 min-w-0"
                      title={`Open ${student.name}'s Profile File`}
                    >
                      <div className="story-ring-light dark:story-ring-dark p-0.5 shrink-0 group-hover:scale-105 transition-transform">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-extrabold text-sm sm:text-base text-[#172033] dark:text-white group-hover/user:text-[#2563EB] dark:group-hover/user:text-blue-400 transition-colors">
                            {student.name}
                          </h3>
                          {student.verifiedCollege && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400 shrink-0" />
                          )}
                          {student.distanceDisplay && (
                            <span className="bg-[#F0F6FF] dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#DCE8F7] dark:border-slate-800 shrink-0">
                              📍 {student.distanceDisplay}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#64748B] dark:text-slate-400 truncate">{student.location || 'Nearby Area'}</p>
                        <p className="text-[11px] text-[#64748B] dark:text-slate-400 truncate">{student.degree} {student.year ? `• ${student.year}` : ''}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => toggleFollowUser(student.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1 ${
                          isFollowing
                            ? 'bg-[#F8FBFF] dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 border border-[#DCE8F7] dark:border-slate-700'
                            : 'bg-white dark:bg-slate-900 hover:bg-[#F8FBFF] dark:hover:bg-slate-800 text-[#64748B] dark:text-slate-300 hover:text-[#172033] dark:hover:text-white border border-[#DCE8F7] dark:border-slate-700'
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
                            <span>+ Follow</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => startConversationWithStudent(student, 'Talent Directory')}
                        className="p-2 bg-[#F8FBFF] dark:bg-slate-800 hover:bg-[#F0F6FF] dark:hover:bg-slate-700 text-[#2563EB] dark:text-blue-400 rounded-full border border-[#DCE8F7] dark:border-slate-700 transition-colors"
                        title={`Message ${student.name}`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => openUserProfileModal(student)}
                        className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs rounded-full shadow-md shadow-blue-500/20 flex items-center gap-1 transition-all active:scale-95"
                      >
                        <span>Open File</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#172033] dark:text-slate-300 leading-relaxed italic bg-[#F8FBFF] dark:bg-slate-800/80 p-3 rounded-2xl border border-[#DCE8F7] dark:border-slate-700">
                    "{student.bio}"
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {student.skills.map(sk => {
                      const isHighlighted = parsedIntent.activityOrSkill &&
                        sk.toLowerCase().includes(parsedIntent.activityOrSkill.toLowerCase());

                      return (
                        <span
                          key={sk}
                          className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold transition-all ${
                            isHighlighted
                              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-2xs'
                              : 'bg-[#F0F6FF] dark:bg-blue-950/60 border-[#DCE8F7] dark:border-slate-700 text-[#2563EB] dark:text-blue-300'
                          }`}
                        >
                          #{sk}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
