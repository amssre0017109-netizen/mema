import React, { useState } from 'react';
import {
  Users,
  MapPin,
  Clock,
  Plus,
  Calendar,
  MessageSquare,
  Check,
  X,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ActivitiesScreen: React.FC = () => {
  const {
    campusRequests,
    currentUser,
    setIsCreateRequestModalOpen,
    acceptInterest,
    declineInterest,
    startConversationWithStudent,
    allStudents,
    openUserProfileModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'my_posts' | 'joined'>('my_posts');

  const myPostedRequests = campusRequests.filter(r => r.creator.id === currentUser.id);
  const myJoinedRequests = campusRequests.filter(r =>
    r.interestedUsers.some(u => u.id === currentUser.id) && r.creator.id !== currentUser.id
  );

  return (
    <div className="min-h-screen bg-[#F0F6FF] dark:bg-[#0A0F1D] text-[#172033] dark:text-slate-100 pb-36 pt-4 sm:pt-6 transition-colors">
      <div className="max-w-xl mx-auto px-4 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] dark:text-blue-400 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Campus Plans Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-[#172033] dark:text-white">
              My Requests & Plans
            </h1>
          </div>

          <button
            onClick={() => setIsCreateRequestModalOpen(true)}
            className="px-4 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Post Need</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#DCE8F7] dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('my_posts')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'my_posts'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-[#64748B] dark:text-slate-400 border border-[#DCE8F7] dark:border-slate-800 hover:text-[#172033] dark:hover:text-white shadow-xs'
            }`}
          >
            Requests I Posted ({myPostedRequests.length})
          </button>

          <button
            onClick={() => setActiveTab('joined')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'joined'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-[#64748B] dark:text-slate-400 border border-[#DCE8F7] dark:border-slate-800 hover:text-[#172033] dark:hover:text-white shadow-xs'
            }`}
          >
            Plans I Joined ({myJoinedRequests.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'my_posts' ? (
          <div className="space-y-4">
            {myPostedRequests.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-3xl p-8 text-center space-y-3 shadow-xs">
                <p className="text-sm font-bold text-[#172033] dark:text-white">No requests posted yet</p>
                <p className="text-xs text-[#64748B] dark:text-slate-400">
                  Post what you need for sports, study, or hackathons in under 30 seconds!
                </p>
                <button
                  onClick={() => setIsCreateRequestModalOpen(true)}
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-full shadow-md shadow-blue-500/20"
                >
                  + Create Request
                </button>
              </div>
            ) : (
              myPostedRequests.map(req => (
                <div
                  key={req.id}
                  className="bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCE8F7] dark:border-slate-800 pb-3">
                    <div className="min-w-0 flex-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F8FBFF] dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 border border-[#DCE8F7] dark:border-slate-700 text-[10px] font-black uppercase tracking-wide">
                        {req.category}
                      </span>
                      <h3 className="text-base font-black text-[#172033] dark:text-white mt-1">{req.title}</h3>
                      <p className="text-xs text-[#64748B] dark:text-slate-400">
                        {req.date} • {req.time} • {req.location}
                      </p>
                    </div>

                    <div className="text-xs font-bold text-[#172033] dark:text-slate-200 bg-[#F8FBFF] dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-[#DCE8F7] dark:border-slate-700 shrink-0 self-start sm:self-center">
                      👥 {req.peopleJoined}/{req.peopleNeeded} joined
                    </div>
                  </div>

                  {/* Interested responses */}
                  <div className="space-y-2.5">
                    <h4 className="font-extrabold text-xs text-[#64748B] dark:text-slate-400 uppercase tracking-wider">
                      Responses ({req.interestedUsers.length}):
                    </h4>

                    {req.interestedUsers.length === 0 ? (
                      <p className="text-xs text-[#64748B] dark:text-slate-400 italic py-1">
                        No responses yet. Students with matching skills will see your request on their feed.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {req.interestedUsers.map(u => {
                          const studentProfile = allStudents.find(s => s.id === u.id) || {
                            id: u.id,
                            name: u.name,
                            age: 21,
                            college: 'Nearby',
                            degree: 'Member',
                            year: 'Active',
                            avatar: u.avatar,
                            verifiedCollege: true,
                            studentIdVerified: true,
                            skills: u.skills,
                            interests: u.skills,
                            activitiesCompleted: 10,
                            requestsPosted: 2,
                            bio: `Active member in ${req.location}`,
                            locationZone: req.location,
                            onlineStatus: 'active_now' as const
                          };

                          return (
                            <div
                              key={u.id}
                              className="bg-[#F8FBFF] dark:bg-slate-800/80 border border-[#DCE8F7] dark:border-slate-700 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div
                                onClick={() => openUserProfileModal(studentProfile)}
                                className="flex items-center gap-2.5 cursor-pointer group/applicant min-w-0 flex-1"
                                title={`Open ${u.name}'s Profile File`}
                              >
                                <img
                                  src={u.avatar}
                                  alt={u.name}
                                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 group-hover/applicant:ring-[#2563EB] transition-all shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <h5 className="font-bold text-xs sm:text-sm text-[#172033] dark:text-white group-hover/applicant:text-[#2563EB] dark:group-hover/applicant:text-blue-400 transition-colors truncate">{u.name}</h5>
                                  {u.note && <p className="text-xs text-[#64748B] dark:text-slate-400 italic line-clamp-2">"{u.note}"</p>}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                                {u.status === 'ACCEPTED' ? (
                                  <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold rounded-full">
                                    ✓ Accepted
                                  </span>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => declineInterest(req.id, u.id)}
                                      className="p-1.5 rounded-full bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[#64748B] dark:text-slate-400 hover:text-rose-500 border border-[#DCE8F7] dark:border-slate-700"
                                      title="Decline"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => acceptInterest(req.id, u.id)}
                                      className="px-3 py-1 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs"
                                    >
                                      Accept
                                    </button>
                                  </>
                                )}

                                <button
                                  onClick={() => {
                                    startConversationWithStudent(studentProfile, req.title, `Hey ${u.name.split(' ')[0]}! Regarding "${req.title}".`);
                                  }}
                                  className="p-1.5 rounded-full bg-white dark:bg-slate-900 hover:bg-[#F0F6FF] dark:hover:bg-slate-700 text-[#64748B] dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-blue-400 border border-[#DCE8F7] dark:border-slate-700"
                                  title="Message Applicant"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {myJoinedRequests.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-3xl p-8 text-center space-y-2 shadow-xs">
                <p className="text-sm font-bold text-[#172033] dark:text-white">No joined requests</p>
                <p className="text-xs text-[#64748B] dark:text-slate-400">
                  Tap "Interested" on any request on your feed to join.
                </p>
              </div>
            ) : (
              myJoinedRequests.map(req => (
                <div
                  key={req.id}
                  className="bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F8FBFF] dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 text-[10px] font-black uppercase border border-[#DCE8F7] dark:border-slate-700">
                      {req.category}
                    </span>
                    <h3 className="text-base font-black text-[#172033] dark:text-white">{req.title}</h3>
                    <p className="text-xs text-[#64748B] dark:text-slate-400">
                      Host: {req.creator.name} • {req.date} • {req.time}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const partner = allStudents.find(s => s.id === req.creator.id) || {
                        id: req.creator.id,
                        name: req.creator.name,
                        age: 21,
                        college: 'Nearby',
                        degree: req.creator.degree || 'Member',
                        year: req.creator.year || 'Active',
                        avatar: req.creator.avatar,
                        verifiedCollege: req.creator.verifiedCollege,
                        studentIdVerified: true,
                        skills: req.requiredSkills,
                        interests: req.requiredSkills,
                        activitiesCompleted: 12,
                        requestsPosted: 4,
                        bio: `Active organizer in ${req.location}`,
                        locationZone: req.location,
                        onlineStatus: 'active_now'
                      };
                      startConversationWithStudent(partner, req.title);
                    }}
                    className="px-4 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat Host</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
