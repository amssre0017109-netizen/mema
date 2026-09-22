import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  Check,
  Building,
  GraduationCap,
  Briefcase,
  School,
  MapPin,
  Award,
  Zap,
  Tag,
  Activity,
  Plus,
  Camera,
  Upload,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OccupationType, ProfileActivity } from '../../types';
import { CAMPUS_OPTIONS, SKILL_CATEGORIES } from '../../data/mockData';

interface EditProfileStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileStudioModal: React.FC<EditProfileStudioModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser, setNotificationToast } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 0. Custom Profile Picture from Personal Device
  const [avatar, setAvatar] = useState<string>(
    currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  );

  // 1. Name & Age
  const [name, setName] = useState(currentUser.name || 'Jamal Knox');
  const [age, setAge] = useState(currentUser.age || 23);

  // 2. Location
  const [location, setLocation] = useState(currentUser.location || 'North Delhi Area');

  // 3. Occupation Type (School / Work / Creator)
  const [occupationType, setOccupationType] = useState<OccupationType>(
    currentUser.occupationType === 'college_student' ? 'working_professional' : (currentUser.occupationType || 'working_professional')
  );
  const [collegeOrOrg, setCollegeOrOrg] = useState(currentUser.college === 'Delhi Technological University (DTU)' ? 'Creative Tech Studio' : (currentUser.college || 'Creative Studio'));
  const [degreeOrRole, setDegreeOrRole] = useState(currentUser.degree || 'Creative Design & Tech');
  const [yearOrLevel, setYearOrLevel] = useState(currentUser.year || 'Senior Designer');

  // 4. Bio
  const [bio, setBio] = useState(
    currentUser.bio || 'Visual artist & creative designer. Building aesthetic digital experiences, campus fest visual identities, and interactive spaces.'
  );

  // 5. Skills
  const [skills, setSkills] = useState<string[]>(
    currentUser.skills || ['Creative Designer', 'Visual Artist', 'Life Coach', 'Bhangra', 'React / Web Dev', 'Football']
  );
  const [newSkillInput, setNewSkillInput] = useState('');

  // 6. Interests
  const [interests, setInterests] = useState<string[]>(
    currentUser.interests || ['Editorial Art', 'Design Sprints', 'Photography', 'Fest Competitions', 'Acoustic Jamming']
  );
  const [newInterestInput, setNewInterestInput] = useState('');

  // 7. Activities
  const [activities, setActivities] = useState<ProfileActivity[]>(
    currentUser.recentActivities || [
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
      }
    ]
  );
  const [newActTitle, setNewActTitle] = useState('');
  const [newActCategory, setNewActCategory] = useState('Sports');
  const [newActLocation, setNewActLocation] = useState('Campus Ground');

  // 8. Stats & Role Tags
  const [followersCount, setFollowersCount] = useState(currentUser.followersCount || 21348);
  const [sessionsCount, setSessionsCount] = useState(currentUser.sessionsCount || 5983);
  const [worksCount, setWorksCount] = useState(currentUser.worksCount || 751);
  const [moodboardsCount, setMoodboardsCount] = useState(currentUser.moodboardsCount || 38);
  const [promptsCount, setPromptsCount] = useState(currentUser.promptsCount || 142);
  const [roleTags, setRoleTags] = useState<string[]>(
    currentUser.roleTags || ['Creative Designer', 'Visual Artist', 'Life Coach']
  );
  const [newTagInput, setNewTagInput] = useState('');

  if (!isOpen) return null;

  // Handle custom photo upload from user's personal device
  const handleDeviceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
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
          setAvatar(reader.result);
          setNotificationToast({
            message: '📷 Picture Selected!',
            subtext: 'Custom photo loaded from your device. Tap "Save Profile" to apply.'
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleAddCustomInterest = () => {
    if (newInterestInput.trim() && !interests.includes(newInterestInput.trim())) {
      setInterests([...interests, newInterestInput.trim()]);
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (item: string) => {
    setInterests(interests.filter(i => i !== item));
  };

  const handleAddActivity = () => {
    if (!newActTitle.trim()) return;
    const newAct: ProfileActivity = {
      id: `act_${Date.now()}`,
      title: newActTitle.trim(),
      category: newActCategory,
      date: 'Recent',
      location: newActLocation.trim() || 'Campus Spot',
      status: 'completed'
    };
    setActivities([newAct, ...activities]);
    setNewActTitle('');
  };

  const handleRemoveActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !roleTags.includes(newTagInput.trim())) {
      setRoleTags([...roleTags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setRoleTags(roleTags.filter(t => t !== tag));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      name: name.trim() || 'Jamal Knox',
      avatar: avatar, // Custom photo from device
      age: Number(age) || 23,
      location: location.trim() || 'North Delhi Area',
      locationZone: location.trim() || 'North Delhi Area',
      occupationType,
      college: collegeOrOrg.trim() || 'Delhi Technological University (DTU)',
      degree: degreeOrRole.trim() || 'Creative Design & Tech',
      year: yearOrLevel.trim() || '4th Year',
      bio: bio.trim(),
      skills: skills.length > 0 ? skills : ['Creative Designer', 'Football'],
      interests: interests.length > 0 ? interests : ['Editorial Art', 'Sports'],
      recentActivities: activities,
      activitiesCompleted: activities.length,
      followersCount: Number(followersCount) || 21348,
      sessionsCount: Number(sessionsCount) || 5983,
      worksCount: Number(worksCount) || 751,
      moodboardsCount: Number(moodboardsCount) || 38,
      promptsCount: Number(promptsCount) || 142,
      roleTags: roleTags.length > 0 ? roleTags : ['Creative Designer', 'Visual Artist']
    }));

    setNotificationToast({
      message: '✓ Profile Picture & Info Saved!',
      subtext: 'Your custom profile photo and details are now live.'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-[2.5rem] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6 text-[#172033] dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DCE8F7] dark:border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#2563EB] dark:text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Profile Settings Studio</span>
            </div>
            <h2 className="text-xl font-black text-[#172033] dark:text-white font-display">
              Edit Profile & Photo
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#F8FBFF] dark:bg-slate-800 text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-[#F0F6FF] dark:hover:bg-slate-700 border border-[#DCE8F7] dark:border-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-xs">
          {/* =========================================================================
              0. CUSTOM PROFILE PICTURE UPLOAD FROM DEVICE
             ========================================================================= */}
          <div className="bg-[#F8FBFF] dark:bg-slate-850 dark:bg-slate-800/60 p-4 sm:p-5 rounded-3xl border border-[#DCE8F7] dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#172033] dark:text-white text-xs">
                Profile Picture (From Personal Device):
              </span>
              <span className="text-[10px] text-[#2563EB] dark:text-blue-400 font-bold">
                Supports JPG, PNG, WEBP
              </span>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleDeviceImageUpload}
            />

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Avatar Live Preview */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer shrink-0"
                title="Click to upload from device"
              >
                <div className="p-1 rounded-full bg-gradient-to-tr from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] shadow-md group-hover:scale-105 transition-transform">
                  <img
                    src={avatar}
                    alt="Preview"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-white dark:ring-slate-800"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Upload CTA Controls */}
              <div className="space-y-2 text-center sm:text-left flex-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs shadow-md flex items-center justify-center sm:justify-start gap-2 transition-all hover:scale-105 active:scale-95 mx-auto sm:mx-0"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Photo from Device</span>
                </button>
                <p className="text-[11px] text-[#64748B] dark:text-slate-400 leading-relaxed">
                  Select any image from your phone or computer. It will update your profile picture instantly.
                </p>
              </div>
            </div>
          </div>

          {/* =========================================================================
              1. NAME & LOCATION
             ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#172033] dark:text-slate-200 mb-1">Display Name (Serif Title):</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Jamal Knox"
                className="w-full bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 focus:border-[#2563EB] dark:focus:border-blue-400 rounded-2xl p-2.5 text-xs text-[#172033] dark:text-white focus:outline-none shadow-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-[#172033] dark:text-slate-200 mb-1">Approximate Area / Campus Zone:</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. North Delhi Area, Campus Grounds"
                  className="w-full bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 focus:border-[#2563EB] dark:focus:border-blue-400 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-[#172033] dark:text-white focus:outline-none shadow-xs"
                />
              </div>
              <span className="text-[10px] text-[#64748B] dark:text-slate-400 mt-1 block">
                🔒 Exact live address is never exposed. Only approximate area/radius is visible.
              </span>
            </div>
          </div>

          {/* =========================================================================
              2. OCCUPATION / STATUS (School Student / Working Professional / Creator)
             ========================================================================= */}
          <div className="space-y-3 bg-[#F8FBFF] dark:bg-slate-800/60 p-4 rounded-3xl border border-[#DCE8F7] dark:border-slate-800">
            <label className="block font-bold text-[#172033] dark:text-white text-xs">
              Status / Occupation Type:
            </label>

            {/* 3-Way Segmented Control */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-white dark:bg-slate-800 rounded-2xl border border-[#DCE8F7] dark:border-slate-700 shadow-xs">
              <button
                type="button"
                onClick={() => setOccupationType('school_student')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                  occupationType === 'school_student'
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
                }`}
              >
                <School className="w-3.5 h-3.5" />
                <span>School</span>
              </button>

              <button
                type="button"
                onClick={() => setOccupationType('working_professional')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                  occupationType === 'working_professional' || occupationType === 'college_student'
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Work / Job</span>
              </button>

              <button
                type="button"
                onClick={() => setOccupationType('creator_freelancer')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                  occupationType === 'creator_freelancer'
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Creator / Freelance</span>
              </button>
            </div>

            {/* Dynamic fields */}
            {occupationType === 'creator_freelancer' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="block text-[10px] text-[#64748B] dark:text-slate-400 mb-1">Studio / Brand / Freelance:</label>
                  <input
                    type="text"
                    value={collegeOrOrg}
                    onChange={e => setCollegeOrOrg(e.target.value)}
                    placeholder="e.g. Independent / Creative Studio"
                    className="w-full bg-white dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 rounded-xl p-2 text-xs text-[#172033] dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#64748B] dark:text-slate-400 mb-1">Niche / Specialty:</label>
                  <input
                    type="text"
                    value={degreeOrRole}
                    onChange={e => setDegreeOrRole(e.target.value)}
                    placeholder="e.g. UI/UX & Motion Design"
                    className="w-full bg-white dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 rounded-xl p-2 text-xs text-[#172033] dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#64748B] dark:text-slate-400 mb-1">Focus Level:</label>
                  <input
                    type="text"
                    value={yearOrLevel}
                    onChange={e => setYearOrLevel(e.target.value)}
                    placeholder="e.g. Full-time Creator"
                    className="w-full bg-white dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 rounded-xl p-2 text-xs text-[#172033] dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {occupationType === 'school_student' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="block text-[10px] text-[#64748B] dark:text-slate-400 mb-1">School Name:</label>
                  <input
                    type="text"
                    value={collegeOrOrg}
                    onChange={e => setCollegeOrOrg(e.target.value)}
                    placeholder="e.g. Delhi Public School"
                    className="w-full bg-white dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 rounded-xl p-2 text-xs text-[#172033] dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#64748B] dark:text-slate-400 mb-1">Class / Grade:</label>
                  <select
                    value={yearOrLevel}
                    onChange={e => setYearOrLevel(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 rounded-xl p-2 text-xs text-[#172033] dark:text-white focus:outline-none"
                  >
                    <option value="Class 12th">Class 12th</option>
                    <option value="Class 11th">Class 11th</option>
                    <option value="Class 10th">Class 10th</option>
                    <option value="Class 9th">Class 9th</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[#64748B] dark:text-slate-400 mb-1">Stream / Subjects:</label>
                  <input
                    type="text"
                    value={degreeOrRole}
                    onChange={e => setDegreeOrRole(e.target.value)}
                    placeholder="e.g. Science (PCM) / Commerce"
                    className="w-full bg-white dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 rounded-xl p-2 text-xs text-[#172033] dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {occupationType === 'working_professional' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="block text-[10px] text-[#64748B] dark:text-slate-400 mb-1">Company / Studio:</label>
                  <input
                    type="text"
                    value={collegeOrOrg}
                    onChange={e => setCollegeOrOrg(e.target.value)}
                    placeholder="e.g. Tech Studio / Google / Freelance"
                    className="w-full bg-white dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 rounded-xl p-2 text-xs text-[#172033] dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#64748B] dark:text-slate-400 mb-1">Job Title / Role:</label>
                  <input
                    type="text"
                    value={degreeOrRole}
                    onChange={e => setDegreeOrRole(e.target.value)}
                    placeholder="e.g. Product Designer / Software Engineer"
                    className="w-full bg-white dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 rounded-xl p-2 text-xs text-[#172033] dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#64748B] dark:text-slate-400 mb-1">Experience Level:</label>
                  <input
                    type="text"
                    value={yearOrLevel}
                    onChange={e => setYearOrLevel(e.target.value)}
                    placeholder="e.g. 2+ Yrs Experience"
                    className="w-full bg-white dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 rounded-xl p-2 text-xs text-[#172033] dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              3. BIO
             ========================================================================= */}
          <div>
            <label className="block font-bold text-[#172033] dark:text-slate-200 mb-1">Bio / About Me:</label>
            <textarea
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="What are your goals, interests, and what kind of activity partners are you looking for?"
              className="w-full bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 focus:border-[#2563EB] dark:focus:border-blue-400 rounded-2xl p-2.5 text-xs text-[#172033] dark:text-white focus:outline-none shadow-xs"
            />
          </div>

          {/* =========================================================================
              4. SKILLS
             ========================================================================= */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-[#172033] dark:text-white">
                Skills & Talents:
              </label>
              <span className="text-[11px] text-[#2563EB] dark:text-blue-400 font-bold">{skills.length} selected</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800/80 rounded-2xl border border-[#DCE8F7] dark:border-slate-700 max-h-40 overflow-y-auto space-y-2.5">
              {SKILL_CATEGORIES.map(cat => (
                <div key={cat.id} className="space-y-1">
                  <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 flex items-center gap-1">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cat.tags.map(tag => {
                      const isSelected = skills.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => handleToggleSkill(tag)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                            isSelected
                              ? 'bg-[#2563EB] text-white shadow-xs font-bold'
                              : 'bg-[#F0F6FF] dark:bg-slate-700/80 border border-[#DCE8F7] dark:border-slate-600 text-[#172033] dark:text-slate-200 hover:bg-[#E0EAFF] dark:hover:bg-slate-600'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newSkillInput}
                onChange={e => setNewSkillInput(e.target.value)}
                placeholder="Add custom skill (e.g. Video Editing, Chess)..."
                className="flex-1 bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 rounded-full px-3.5 py-1.5 text-xs text-[#172033] dark:text-white focus:outline-none shadow-xs"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-full text-xs transition-colors"
              >
                + Add
              </button>
            </div>
          </div>

          {/* =========================================================================
              5. INTERESTS
             ========================================================================= */}
          <div className="space-y-1.5">
            <label className="block font-bold text-[#172033] dark:text-white">Interests & Campus Societies:</label>
            <div className="flex flex-wrap gap-1.5">
              {interests.map(int => (
                <span
                  key={int}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F0F6FF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 text-xs font-semibold text-[#172033] dark:text-slate-200"
                >
                  <span>{int}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(int)}
                    className="hover:text-rose-500 ml-1 text-[#64748B] dark:text-slate-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newInterestInput}
                onChange={e => setNewInterestInput(e.target.value)}
                placeholder="Add interest e.g. College Fests, Anime, Robotics..."
                className="flex-1 bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 rounded-full px-3.5 py-1.5 text-xs text-[#172033] dark:text-white focus:outline-none shadow-xs"
              />
              <button
                type="button"
                onClick={handleAddCustomInterest}
                className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-full text-xs transition-colors"
              >
                + Add
              </button>
            </div>
          </div>

          {/* =========================================================================
              6. ACTIVITIES
             ========================================================================= */}
          <div className="space-y-2 bg-[#F8FBFF] dark:bg-slate-800/60 p-4 rounded-3xl border border-[#DCE8F7] dark:border-slate-800">
            <label className="block font-bold text-[#172033] dark:text-white text-xs">
              Activities & Meetup Highlights ({activities.length}):
            </label>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {activities.map(act => (
                <div
                  key={act.id}
                  className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-[#DCE8F7] dark:border-slate-700 flex items-center justify-between text-[11px]"
                >
                  <div>
                    <span className="font-bold text-[#172033] dark:text-white block">{act.title}</span>
                    <span className="text-[#64748B] dark:text-slate-400 text-[10px]">{act.location} • {act.date}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveActivity(act.id)}
                    className="text-[#64748B] dark:text-slate-400 hover:text-rose-500 px-2 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newActTitle}
                onChange={e => setNewActTitle(e.target.value)}
                placeholder="New activity e.g. 🏏 Weekend Box Cricket"
                className="flex-1 bg-white dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-[#172033] dark:text-white focus:outline-none shadow-xs"
              />
              <button
                type="button"
                onClick={handleAddActivity}
                className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs transition-colors"
              >
                + Add
              </button>
            </div>
          </div>

          {/* =========================================================================
              7. ROLE BADGES (✺) & STATS
             ========================================================================= */}
          <div className="space-y-2 pt-2 border-t border-[#DCE8F7] dark:border-slate-800">
            <label className="block font-bold text-[#172033] dark:text-white">
              Role Badges (✺):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {roleTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F6FF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 text-xs font-semibold text-[#172033] dark:text-slate-200"
                >
                  <span>✺ {tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-500 ml-1 text-[#64748B] dark:text-slate-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newTagInput}
                onChange={e => setNewTagInput(e.target.value)}
                placeholder="Add role tag (e.g. Creative Designer, Footballer)..."
                className="flex-1 bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 rounded-full px-3.5 py-1.5 text-xs text-[#172033] dark:text-white focus:outline-none shadow-xs"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-full text-xs transition-colors"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#DCE8F7] dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-[#F8FBFF] dark:bg-slate-800 text-[#64748B] dark:text-slate-300 font-bold hover:bg-[#F0F6FF] dark:hover:bg-slate-700 border border-[#DCE8F7] dark:border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-black shadow-md transition-all"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
