import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  MessageSquare,
  MoreVertical,
  Flag,
  UserX,
  Plus,
  Trash2,
  FileText,
  X,
  Sparkles,
  Check,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MessagesScreen: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    respondToMeetupProposal,
    clearConversationMessages,
    openReportModal,
    blockUser,
    openUserProfileModal,
    setNotificationToast
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMeetupModalOpen, setIsMeetupModalOpen] = useState(false);

  // Safe Meetup Proposal Customization
  const [selectedSpot, setSelectedSpot] = useState('Central Library Study Commons');
  const [customSpot, setCustomSpot] = useState('');
  const [selectedTime, setSelectedTime] = useState('Today @ 5:30 PM');
  const [customTime, setCustomTime] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(c =>
    c.partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.partner.college?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.activityContext?.requestTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (activeConv?.messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConv?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversationId) return;

    sendMessage(activeConversationId, inputMessage.trim());
    setInputMessage('');
  };

  const handleQuickSend = (text: string) => {
    if (!activeConversationId) return;
    sendMessage(activeConversationId, text);
  };

  const handleSendCustomMeetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversationId || !activeConv) return;

    const finalSpot = customSpot.trim() || selectedSpot;
    const finalTime = customTime.trim() || selectedTime;

    sendMessage(
      activeConversationId,
      `Let's meet up safely! How about ${finalSpot} on ${finalTime}?`,
      false,
      {
        locationName: finalSpot,
        time: finalTime,
        status: 'proposed'
      }
    );

    setIsMeetupModalOpen(false);
    setCustomSpot('');
    setCustomTime('');

    setNotificationToast({
      message: '🛡️ Safe Meetup Proposed!',
      subtext: `Sent proposal for ${finalSpot} • ${finalTime}`
    });
  };

  const quickActionChips = [
    { label: '🛡️ Safe Meetup', action: () => setIsMeetupModalOpen(true) },
    { label: '📚 Library Co-Study', action: () => handleQuickSend('Hey! Up for a co-study session at the Central Library?') },
    { label: '⏰ Free This Evening', action: () => handleQuickSend('I am free this evening after 5 PM! Let me know if that works.') },
    { label: '⚽ Ready to Join', action: () => handleQuickSend('Count me in! I will reach the spot on time.') },
    { label: '👍 Sounds Great!', action: () => handleQuickSend('Sounds like a solid plan! See you there.') }
  ];

  const presetSpots = [
    'Central Library Study Commons',
    'Campus Main Sports Ground',
    'Student Union Cafe & Lounge',
    'Tech Block Innovation Lab',
    'North Sports Complex Turf'
  ];

  const presetTimes = [
    'Today @ 5:30 PM',
    'Today @ 7:00 PM',
    'Tomorrow @ 4:30 PM',
    'This Saturday @ 11:00 AM'
  ];

  return (
    <div className="min-h-screen bg-[#F0F6FF] text-[#172033] pb-36 pt-4 sm:pt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-[#DCE8F7] rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-3 h-[75vh] min-h-[580px]">
          {/* Conversation List Sidebar */}
          <div className={`border-r border-[#DCE8F7] flex flex-col ${activeConv ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-[#DCE8F7] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-extrabold text-base text-[#172033]">Campus Chats</h2>
                  <span className="text-xs text-[#64748B]">{conversations.length} active conversations</span>
                </div>
              </div>

              {/* Chat Search Column */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Search className="w-3.5 h-3.5 text-[#2563EB]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search students or activities..."
                  className="w-full bg-[#F8FBFF] border border-[#DCE8F7] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] rounded-full pl-8 pr-7 py-1.5 text-xs text-[#172033] placeholder-[#64748B] focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#172033]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#DCE8F7]">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#64748B]">
                  {searchQuery ? 'No matching conversations found.' : 'No conversations yet. Tap "Interested" on any request to chat with the host!'}
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const isSelected = conv.id === activeConversationId;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversationId(conv.id)}
                      className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                        isSelected ? 'bg-[#F0F6FF]' : 'hover:bg-[#F8FBFF]'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={conv.partner.avatar}
                          alt={conv.partner.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-[#DCE8F7]"
                        />
                        {conv.partner.verifiedCollege && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] absolute -bottom-1 -right-1 bg-white rounded-full" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 text-xs">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-[#172033] truncate">
                            {conv.partner.name}
                          </span>
                          <span className="text-[10px] text-[#64748B] shrink-0 ml-1">
                            {conv.lastMessageTime}
                          </span>
                        </div>
                        <p className="text-[#64748B] truncate leading-relaxed">
                          {conv.lastMessage}
                        </p>
                        {conv.activityContext && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F8FBFF] text-[#2563EB] border border-[#DCE8F7] truncate max-w-full">
                            {conv.activityContext.requestTitle}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Chat Area */}
          {activeConv ? (
            <div className="md:col-span-2 flex flex-col h-full bg-[#F8FBFF] relative">
              {/* Chat Header */}
              <div className="p-3.5 sm:p-4 bg-white border-b border-[#DCE8F7] flex items-center justify-between z-20">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
                  <button
                    onClick={() => setActiveConversationId(null)}
                    className="md:hidden p-1.5 rounded-full hover:bg-[#F8FBFF] text-[#64748B] hover:text-[#172033] shrink-0"
                    title="Back to conversations"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div
                    onClick={() => openUserProfileModal(activeConv.partner)}
                    className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group/partner min-w-0 flex-1"
                    title={`Open ${activeConv.partner.name}'s Profile File`}
                  >
                    <img
                      src={activeConv.partner.avatar}
                      alt={activeConv.partner.name}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-[#DCE8F7] group-hover/partner:ring-[#2563EB] transition-all shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-sm text-[#172033] group-hover/partner:text-[#2563EB] transition-colors truncate">
                          {activeConv.partner.name}
                        </h3>
                        {activeConv.partner.verifiedCollege && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#64748B] truncate">
                        {activeConv.partner.degree || 'Member'} • {activeConv.partner.distanceDisplay || activeConv.partner.location || 'Nearby'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 relative shrink-0">
                  {/* Propose Safe Meetup CTA Button */}
                  <button
                    type="button"
                    onClick={() => setIsMeetupModalOpen(true)}
                    className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#F0F6FF] text-[#2563EB] border border-[#DCE8F7] text-xs font-bold hover:bg-[#2563EB] hover:text-white transition-all active:scale-95 shadow-2xs"
                    title="Propose verified safe campus meetup"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden xs:inline sm:inline">Safe Meetup</span>
                  </button>

                  {/* 3-Dots Chat Options Menu */}
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-1.5 rounded-full text-[#64748B] hover:text-[#172033] hover:bg-[#F8FBFF] transition-colors"
                    title="Chat options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu & Backdrop */}
                  {isMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setIsMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-10 w-52 bg-white border border-[#DCE8F7] rounded-2xl p-1.5 shadow-xl shadow-blue-500/10 z-30 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                        <button
                          onClick={() => {
                            openUserProfileModal(activeConv.partner);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F8FBFF] text-[#172033] font-semibold flex items-center gap-2 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>View Profile File</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsMeetupModalOpen(true);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F8FBFF] text-[#172033] font-semibold flex items-center gap-2 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>Propose Safe Meetup</span>
                        </button>

                        <button
                          onClick={() => {
                            clearConversationMessages(activeConv.id);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F8FBFF] text-[#64748B] hover:text-[#172033] font-semibold flex items-center gap-2 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear Chat History</span>
                        </button>

                        <div className="border-t border-[#DCE8F7] my-1" />

                        <button
                          onClick={() => {
                            openReportModal('user', activeConv.partner.id, activeConv.partner.name);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2 transition-colors"
                        >
                          <Flag className="w-3.5 h-3.5 text-rose-500" />
                          <span>Report User</span>
                        </button>

                        <button
                          onClick={() => {
                            blockUser(activeConv.partner.id, activeConv.partner.name);
                            setIsMenuOpen(false);
                            setActiveConversationId(null);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2 transition-colors"
                        >
                          <UserX className="w-3.5 h-3.5 text-rose-500" />
                          <span>Block User</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {activeConv.messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#64748B] space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#F0F6FF] border border-[#DCE8F7] flex items-center justify-center text-[#2563EB]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-[#172033]">
                      Start the conversation with {activeConv.partner.name.split(' ')[0]}
                    </p>
                    <p className="text-[11px] text-[#64748B] max-w-xs">
                      Tap any quick suggestion below or send a safe meetup invitation.
                    </p>
                  </div>
                ) : (
                  activeConv.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-2xs ${
                          msg.isMine
                            ? 'bg-[#2563EB] text-white rounded-br-xs'
                            : 'bg-white border border-[#DCE8F7] text-[#172033] rounded-bl-xs'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>

                        {/* Interactive Safe Meetup Proposal Card */}
                        {msg.safeMeetupProposal && (
                          <div
                            className={`mt-2.5 p-3 rounded-2xl border text-[11px] space-y-2 ${
                              msg.isMine
                                ? 'bg-white/15 border-white/25 text-white'
                                : 'bg-[#F0F6FF] border-[#DCE8F7] text-[#172033]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-current/10">
                              <span className="font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                                <span>Verified Campus Meetup</span>
                              </span>
                              {msg.safeMeetupProposal.status === 'accepted' && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[9px] flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> Confirmed
                                </span>
                              )}
                            </div>

                            <div className="space-y-1">
                              <div className="font-bold flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                                <span>{msg.safeMeetupProposal.locationName}</span>
                              </div>
                              <div className="text-[#64748B] flex items-center gap-1.5 font-medium">
                                <Clock className="w-3.5 h-3.5 shrink-0" />
                                <span>{msg.safeMeetupProposal.time}</span>
                              </div>
                            </div>

                            {/* Action Options for Safe Meetup */}
                            {msg.safeMeetupProposal.status === 'proposed' && (
                              <div className="pt-1.5 border-t border-current/10 flex items-center gap-1.5 flex-wrap">
                                {!msg.isMine ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => respondToMeetupProposal(activeConv.id, msg.id, true)}
                                      className="px-3 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-xs flex items-center gap-1 shadow-xs transition-all active:scale-95"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>Accept Meetup</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setIsMeetupModalOpen(true)}
                                      className="px-3 py-1.5 rounded-full bg-white hover:bg-[#F8FBFF] text-[#64748B] hover:text-[#172033] border border-[#DCE8F7] font-bold text-xs transition-colors"
                                    >
                                      Suggest Other Time
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[10px] text-white/80 font-semibold italic">
                                    ⏳ Awaiting peer confirmation...
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-[#64748B] mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Action Suggestion Chips */}
              <div className="px-3 py-2 bg-white/80 backdrop-blur-md border-t border-[#DCE8F7] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {quickActionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={chip.action}
                    className="px-3 py-1 rounded-full bg-[#F8FBFF] hover:bg-[#F0F6FF] text-[#2563EB] hover:text-[#1D4ED8] border border-[#DCE8F7] text-[11px] font-bold whitespace-nowrap transition-all shadow-2xs active:scale-95 shrink-0"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#DCE8F7] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMeetupModalOpen(true)}
                  className="p-2.5 rounded-full bg-[#F8FBFF] hover:bg-[#F0F6FF] text-[#2563EB] border border-[#DCE8F7] transition-all shrink-0"
                  title="Propose Safe Campus Meetup"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder={`Message ${activeConv.partner.name.split(' ')[0]}...`}
                  className="flex-1 bg-[#F8FBFF] border border-[#DCE8F7] focus:border-[#2563EB] focus:bg-white rounded-full px-4 py-2.5 text-xs text-[#172033] placeholder-[#64748B] focus:outline-none transition-colors"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white shadow-xs transition-all active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="hidden md:flex md:col-span-2 items-center justify-center p-8 text-center text-[#64748B] text-xs bg-[#F8FBFF]">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#F0F6FF] border border-[#DCE8F7] flex items-center justify-center mx-auto text-[#2563EB]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-[#172033]">Select a conversation</h3>
                <p className="text-[11px] max-w-xs text-[#64748B]">
                  Chat with students about your posted requests, shared skills, or safe campus meetups.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Safe Campus Meetup Proposer Modal */}
      {isMeetupModalOpen && activeConv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white border border-[#DCE8F7] rounded-[2.5rem] max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4 text-[#172033]">
            <div className="flex items-center justify-between pb-2 border-b border-[#DCE8F7]">
              <div className="flex items-center gap-2 text-xs font-black text-[#2563EB] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Propose Safe Campus Meetup</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMeetupModalOpen(false)}
                className="p-2 rounded-full bg-[#F8FBFF] text-[#64748B] hover:text-[#172033] border border-[#DCE8F7] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendCustomMeetup} className="space-y-4 text-xs">
              <div className="p-3 bg-[#F0F6FF] border border-[#DCE8F7] rounded-2xl text-[11px] text-[#64748B] leading-relaxed">
                🛡️ <strong>Safety Guarantee:</strong> Always meet at well-lit, public campus spaces during active hours.
              </div>

              {/* Spot Selection */}
              <div className="space-y-2">
                <label className="block font-bold text-[#172033]">
                  Select Public Campus Spot:
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {presetSpots.map(spot => (
                    <button
                      key={spot}
                      type="button"
                      onClick={() => {
                        setSelectedSpot(spot);
                        setCustomSpot('');
                      }}
                      className={`w-full p-2.5 text-left rounded-xl border flex items-center justify-between transition-all ${
                        selectedSpot === spot && !customSpot
                          ? 'bg-[#F0F6FF] border-[#2563EB] text-[#2563EB] font-bold'
                          : 'bg-[#F8FBFF] border-[#DCE8F7] text-[#172033] hover:bg-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>{spot}</span>
                      </span>
                      {selectedSpot === spot && !customSpot && (
                        <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                      )}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={customSpot}
                  onChange={e => setCustomSpot(e.target.value)}
                  placeholder="Or enter custom public location..."
                  className="w-full bg-[#F8FBFF] border border-[#DCE8F7] focus:border-[#2563EB] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#172033] placeholder-[#64748B] focus:outline-none"
                />
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <label className="block font-bold text-[#172033]">
                  Select Convenient Time:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {presetTimes.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setSelectedTime(t);
                        setCustomTime('');
                      }}
                      className={`p-2.5 text-left rounded-xl border flex items-center justify-between transition-all ${
                        selectedTime === t && !customTime
                          ? 'bg-[#F0F6FF] border-[#2563EB] text-[#2563EB] font-bold'
                          : 'bg-[#F8FBFF] border-[#DCE8F7] text-[#172033] hover:bg-white'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        <span className="truncate">{t}</span>
                      </span>
                      {selectedTime === t && !customTime && (
                        <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={customTime}
                  onChange={e => setCustomTime(e.target.value)}
                  placeholder="Or enter custom time (e.g. Today @ 6:15 PM)..."
                  className="w-full bg-[#F8FBFF] border border-[#DCE8F7] focus:border-[#2563EB] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#172033] placeholder-[#64748B] focus:outline-none"
                />
              </div>

              {/* CTA Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-[#DCE8F7]">
                <button
                  type="button"
                  onClick={() => setIsMeetupModalOpen(false)}
                  className="px-4 py-2 bg-[#F8FBFF] text-[#64748B] font-bold rounded-full hover:bg-[#F0F6FF] border border-[#DCE8F7] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold rounded-full shadow-md shadow-blue-500/20 transition-all active:scale-95"
                >
                  Send Meetup Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
