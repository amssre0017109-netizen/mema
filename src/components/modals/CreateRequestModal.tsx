import React, { useState } from 'react';
import {
  X,
  Plus,
  Clock,
  MapPin,
  Users,
  Sparkles,
  Zap,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RequestCategory, NeedType } from '../../types';
import { SKILL_CATEGORIES } from '../../data/mockData';

export const CreateRequestModal: React.FC = () => {
  const {
    isCreateRequestModalOpen,
    setIsCreateRequestModalOpen,
    addCampusRequest,
    currentUser,
    selectedCampus
  } = useApp();

  const [category, setCategory] = useState<RequestCategory>('Sports');
  const [needType, setNeedType] = useState<NeedType>('Activity');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('6:00 PM');
  const [location, setLocation] = useState('College Sports Ground');
  const [peopleNeeded, setPeopleNeeded] = useState(2);
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['Football']);
  const [description, setDescription] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  if (!isCreateRequestModalOpen) return null;

  const categories: { id: RequestCategory; icon: string; name: string }[] = [
    { id: 'Sports', icon: '⚽', name: 'Sports' },
    { id: 'Gym', icon: '🏋️', name: 'Gym' },
    { id: 'Dance', icon: '💃', name: 'Dance & Fest' },
    { id: 'Music', icon: '🎵', name: 'Music' },
    { id: 'Coding', icon: '💻', name: 'Coding' },
    { id: 'Study', icon: '📚', name: 'Study' },
    { id: 'Team', icon: '🤝', name: 'Teams' },
    { id: 'Gaming', icon: '🎮', name: 'Gaming' },
    { id: 'Other', icon: '✨', name: 'Other' }
  ];

  const quickDates = ['Today', 'Tomorrow', 'This Friday', 'This Saturday', 'This Weekend'];
  const suggestedSkills = SKILL_CATEGORIES.find(c => c.id === category)?.tags || [];

  const handleQuickSkillSelect = (skill: string) => {
    if (!requiredSkills.includes(skill)) {
      setRequiredSkills([...requiredSkills, skill]);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addCampusRequest({
      title: title.trim(),
      category,
      needType,
      date: date.trim() || 'Today',
      time: time.trim() || '6:00 PM',
      location: location.trim() || 'Sports Ground / Activity Center',
      college: currentUser.college || 'Local Area',
      distanceKm: 0.3,
      distanceDisplay: 'Nearby Area (~500m)',
      peopleNeeded: Number(peopleNeeded) || 1,
      requiredSkills: requiredSkills.length > 0 ? requiredSkills : [category],
      description: description.trim(),
      creator: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        college: currentUser.college || 'Local Area',
        degree: currentUser.degree,
        year: currentUser.year,
        verifiedCollege: currentUser.verifiedCollege
      },
      isUrgent
    });

    setTitle('');
    setDescription('');
    setIsCreateRequestModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-[2.5rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-5 text-[#172033] dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DCE8F7] dark:border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#2563EB] dark:text-blue-400 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-[#2563EB] dark:fill-blue-400" />
              <span>Campus Quick Post (30 Sec)</span>
            </div>
            <h2 className="text-xl font-black text-[#172033] dark:text-white font-display">
              Post What You Need
            </h2>
          </div>

          <button
            onClick={() => setIsCreateRequestModalOpen(false)}
            className="p-2 rounded-full bg-[#F8FBFF] dark:bg-slate-800 text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-[#F0F6FF] dark:hover:bg-slate-700 border border-[#DCE8F7] dark:border-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Category */}
          <div>
            <label className="block font-extrabold text-[#172033] dark:text-slate-200 mb-1.5">
              1. Category
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {categories.map(cat => {
                const isSelected = category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.id);
                      const defaultSkills = SKILL_CATEGORIES.find(c => c.id === cat.id)?.tags.slice(0, 2) || [];
                      setRequiredSkills(defaultSkills);
                    }}
                    className={`p-2 rounded-2xl text-left border transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#2563EB] text-white font-bold border-[#2563EB] shadow-sm'
                        : 'bg-[#F8FBFF] dark:bg-slate-800/80 text-[#172033] dark:text-slate-200 hover:bg-[#F0F6FF] dark:hover:bg-slate-750 border-[#DCE8F7] dark:border-slate-700'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate text-[11px] font-semibold">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Need Title */}
          <div>
            <label className="block font-extrabold text-[#172033] dark:text-slate-200 mb-1">
              2. Title (What do you need?)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. ⚽ Football Partner Needed / 💃 Bhangra dancer for Fest"
              className="w-full bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 focus:border-[#2563EB] dark:focus:border-blue-400 rounded-2xl p-3 text-xs text-[#172033] dark:text-white font-semibold focus:outline-none shadow-xs"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-extrabold text-[#172033] dark:text-slate-200 mb-1">When (Date):</label>
              <select
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 focus:border-[#2563EB] dark:focus:border-blue-400 rounded-2xl p-2.5 text-xs text-[#172033] dark:text-white font-medium focus:outline-none"
              >
                {quickDates.map(d => (
                  <option key={d} value={d} className="bg-white dark:bg-slate-800 text-[#172033] dark:text-white">{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-extrabold text-[#172033] dark:text-slate-200 mb-1">Time:</label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="e.g. 6:00 PM"
                className="w-full bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 focus:border-[#2563EB] dark:focus:border-blue-400 rounded-2xl p-2.5 text-xs text-[#172033] dark:text-white font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Spot & People */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2">
              <label className="block font-extrabold text-[#172033] dark:text-slate-200 mb-1">Location / Spot:</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Main Sports Ground / Community Park / Library"
                className="w-full bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 focus:border-[#2563EB] dark:focus:border-blue-400 rounded-2xl p-2.5 text-xs text-[#172033] dark:text-white font-medium focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-extrabold text-[#172033] dark:text-slate-200 mb-1">People Needed:</label>
              <input
                type="number"
                min={1}
                max={20}
                value={peopleNeeded}
                onChange={e => setPeopleNeeded(Number(e.target.value))}
                className="w-full bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 focus:border-[#2563EB] dark:focus:border-blue-400 rounded-2xl p-2.5 text-xs text-[#172033] dark:text-white font-bold text-center focus:outline-none"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-1.5">
            <label className="block font-extrabold text-[#172033] dark:text-white">
              Required Skill or Activity Tags:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {requiredSkills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2563EB] text-white text-[11px] font-bold"
                >
                  <span>#{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-200 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Suggested skill chips */}
            <div className="flex flex-wrap items-center gap-1 pt-1">
              <span className="text-[10px] text-[#64748B] dark:text-slate-400 font-bold uppercase">Quick Add:</span>
              {suggestedSkills.map(sk => (
                <button
                  type="button"
                  key={sk}
                  onClick={() => handleQuickSkillSelect(sk)}
                  className="px-2 py-0.5 rounded-full bg-[#F0F6FF] dark:bg-slate-800 hover:bg-[#E0EAFF] dark:hover:bg-slate-700 text-[#2563EB] dark:text-blue-400 text-[10px] font-medium transition-colors border border-[#DCE8F7] dark:border-slate-700"
                >
                  + {sk}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-extrabold text-[#172033] dark:text-slate-200 mb-1">
              Short Description / Details:
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What should interested students know? (Gear, level, meetup spot...)"
              className="w-full bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 focus:border-[#2563EB] dark:focus:border-blue-400 rounded-2xl p-3 text-xs text-[#172033] dark:text-white focus:outline-none shadow-xs"
            />
          </div>

          {/* Urgent Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FBFF] dark:bg-slate-800/80 border border-[#DCE8F7] dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <div>
                <span className="font-bold text-[#172033] dark:text-white block">Mark as Urgent (Happening Today/Tomorrow)</span>
                <span className="text-[10px] text-[#64748B] dark:text-slate-400">Instantly alerts students with matching skills.</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={e => setIsUrgent(e.target.checked)}
              className="w-4 h-4 accent-[#2563EB] rounded"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DCE8F7] dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateRequestModalOpen(false)}
              className="px-5 py-2.5 bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 text-[#64748B] dark:text-slate-300 font-bold rounded-full hover:bg-[#F0F6FF] dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-black rounded-full shadow-md flex items-center gap-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>POST REQUEST</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
