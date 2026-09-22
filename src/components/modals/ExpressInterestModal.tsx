import React, { useState } from 'react';
import {
  X,
  Send,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Users,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExpressInterestModal: React.FC = () => {
  const {
    activeInterestTargetRequest,
    setActiveInterestTargetRequest,
    expressInterest,
    currentUser,
    setCurrentView
  } = useApp();

  const [note, setNote] = useState('');

  if (!activeInterestTargetRequest) return null;

  const target = activeInterestTargetRequest;

  const matchingSkills = currentUser.skills.filter(sk =>
    target.requiredSkills.some(r => r.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(r.toLowerCase()))
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    expressInterest(target.id, note.trim() || undefined);
    setActiveInterestTargetRequest(null);
    setCurrentView('messages');
  };

  const quickNotes = [
    `Hey ${target.creator.name.split(' ')[0]}! I can join for this.`,
    `Count me in! I will reach ${target.location.split('•')[0].trim()} on time.`,
    `I have experience with this, happy to team up!`
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-[2.5rem] max-w-md w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4 text-[#172033] dark:text-white">
        <button
          onClick={() => setActiveInterestTargetRequest(null)}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#F8FBFF] dark:bg-slate-800 text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-[#F0F6FF] dark:hover:bg-slate-700 border border-[#DCE8F7] dark:border-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#2563EB] dark:text-blue-400 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-[#2563EB] dark:fill-blue-400" />
            <span>Join / Express Interest</span>
          </div>
          <h2 className="text-xl font-black text-[#172033] dark:text-white font-display">
            {target.title}
          </h2>
        </div>

        {/* Requester & Spot Preview */}
        <div className="bg-[#F8FBFF] dark:bg-slate-800/70 border border-[#DCE8F7] dark:border-slate-700 p-3.5 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={target.creator.avatar}
                alt={target.creator.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-700"
              />
              <div>
                <h4 className="font-bold text-[#172033] dark:text-white">{target.creator.name}</h4>
                <p className="text-[11px] text-[#64748B] dark:text-slate-400">{target.location} • {target.creator.degree || 'Member'}</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F0F6FF] dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 border border-[#DCE8F7] dark:border-slate-700 text-[11px] font-bold">
              Need {target.peopleNeeded}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[#64748B] dark:text-slate-400 pt-1 border-t border-[#DCE8F7] dark:border-slate-700">
            <span className="flex items-center gap-1 font-semibold text-[#172033] dark:text-slate-200">
              <Clock className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" /> {target.date} • {target.time}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" /> {target.location}
            </span>
          </div>
        </div>

        {/* Skill Match Highlight */}
        {matchingSkills.length > 0 && (
          <div className="p-3 rounded-2xl bg-[#F0F6FF] dark:bg-blue-950/40 border border-[#DCE8F7] dark:border-blue-900/60 flex items-center gap-2 text-xs text-[#2563EB] dark:text-blue-400">
            <CheckCircle2 className="w-4 h-4 text-[#2563EB] dark:text-blue-400 shrink-0" />
            <div>
              <span className="font-bold block text-[#172033] dark:text-white">⚡ Skill Match Detected:</span>
              <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                You have {matchingSkills.map(s => `"${s}"`).join(', ')} in your profile!
              </span>
            </div>
          </div>
        )}

        {/* Quick Note Options */}
        <div className="space-y-1.5 text-xs">
          <span className="font-bold text-[#172033] dark:text-slate-200 block">Quick Note (Tap to autofill):</span>
          <div className="space-y-1">
            {quickNotes.map((qn, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setNote(qn)}
                className="w-full text-left p-2 rounded-xl bg-[#F8FBFF] dark:bg-slate-800 hover:bg-[#F0F6FF] dark:hover:bg-slate-750 border border-[#DCE8F7] dark:border-slate-700 text-[#172033] dark:text-slate-200 text-xs transition-colors"
              >
                "{qn}"
              </button>
            ))}
          </div>
        </div>

        {/* Note Input */}
        <form onSubmit={handleSend} className="space-y-3 pt-1 text-xs">
          <div>
            <label className="block font-bold text-[#172033] dark:text-slate-200 mb-1">Your Message:</label>
            <textarea
              rows={2}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Hey! I play midfield, free today at 6 PM."
              className="w-full bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 focus:border-[#2563EB] dark:focus:border-blue-400 rounded-2xl p-3 text-xs text-[#172033] dark:text-white focus:outline-none shadow-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#DCE8F7] dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveInterestTargetRequest(null)}
              className="px-4 py-2 bg-[#F8FBFF] dark:bg-slate-800 text-[#64748B] dark:text-slate-300 font-bold rounded-full hover:bg-[#F0F6FF] dark:hover:bg-slate-700 border border-[#DCE8F7] dark:border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-extrabold rounded-full shadow-md flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Interest & Open Chat</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
