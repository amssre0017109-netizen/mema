import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Smile, ThumbsUp, Sparkles, BookOpen, Trophy, Coffee, Flame } from 'lucide-react';

export interface EmojiData {
  emoji: string;
  name: string;
  keywords: string[];
}

export interface EmojiCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  emojis: EmojiData[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'smileys',
    name: 'Smileys & Faces',
    icon: <Smile className="w-3.5 h-3.5" />,
    emojis: [
      { emoji: '😀', name: 'Grinning Face', keywords: ['smile', 'happy', 'grin'] },
      { emoji: '😃', name: 'Smiley', keywords: ['happy', 'joy', 'smile'] },
      { emoji: '😄', name: 'Big Smile', keywords: ['laugh', 'joy', 'happy'] },
      { emoji: '😁', name: 'Beaming Smile', keywords: ['grin', 'teeth', 'proud'] },
      { emoji: '😆', name: 'Squinting Laugh', keywords: ['laugh', 'lol', 'haha'] },
      { emoji: '😅', name: 'Sweat Smile', keywords: ['relief', 'nervous', 'phew'] },
      { emoji: '😂', name: 'Tears of Joy', keywords: ['cry', 'laugh', 'funny', 'lol', 'lmao'] },
      { emoji: '🤣', name: 'ROFL', keywords: ['rofl', 'funny', 'haha', 'lmao'] },
      { emoji: '😊', name: 'Warm Smile', keywords: ['warm', 'friendly', 'sweet', 'blush'] },
      { emoji: '😇', name: 'Halo Angel', keywords: ['innocent', 'good', 'kind'] },
      { emoji: '🙂', name: 'Slight Smile', keywords: ['okay', 'neutral', 'friendly'] },
      { emoji: '😉', name: 'Wink', keywords: ['flirt', 'joke', 'playful', 'wink'] },
      { emoji: '😍', name: 'Heart Eyes', keywords: ['love', 'crush', 'adore', 'heart'] },
      { emoji: '🥰', name: 'Smiling with Hearts', keywords: ['warm', 'love', 'cute', 'hearts'] },
      { emoji: '😘', name: 'Blowing Kiss', keywords: ['kiss', 'love', 'bye'] },
      { emoji: '😎', name: 'Cool Sunglasses', keywords: ['cool', 'chill', 'boss', 'sunglasses'] },
      { emoji: '🤩', name: 'Star Struck', keywords: ['star', 'wow', 'amaze', 'sparkle'] },
      { emoji: '🥳', name: 'Party Face', keywords: ['celebrate', 'birthday', 'party', 'yay'] },
      { emoji: '🤗', name: 'Hugging Face', keywords: ['hug', 'friendly', 'welcome'] },
      { emoji: '🤔', name: 'Thinking Face', keywords: ['think', 'hmm', 'wonder', 'curious'] },
      { emoji: '🤫', name: 'Shushing Face', keywords: ['secret', 'quiet', 'shh', 'silent'] },
      { emoji: '🫡', name: 'Saluting Face', keywords: ['respect', 'yes sir', 'roger', 'salute'] },
      { emoji: '😴', name: 'Sleeping Face', keywords: ['sleep', 'tired', 'night', 'zzz'] },
      { emoji: '🤯', name: 'Exploding Head', keywords: ['mind blown', 'shock', 'wow', 'crazy'] },
      { emoji: '🤪', name: 'Zany Face', keywords: ['crazy', 'silly', 'fun', 'wild'] },
      { emoji: '🥺', name: 'Pleading Eyes', keywords: ['please', 'puppy eyes', 'beg', 'cute'] },
      { emoji: '😏', name: 'Smirk', keywords: ['smug', 'sneaky', 'clever'] }
    ]
  },
  {
    id: 'gestures',
    name: 'Gestures & Vibes',
    icon: <ThumbsUp className="w-3.5 h-3.5" />,
    emojis: [
      { emoji: '👍', name: 'Thumbs Up', keywords: ['yes', 'like', 'good', 'approve', 'ok'] },
      { emoji: '👎', name: 'Thumbs Down', keywords: ['no', 'dislike', 'bad'] },
      { emoji: '👏', name: 'Clapping', keywords: ['applause', 'bravo', 'cheer', 'clap'] },
      { emoji: '🙌', name: 'Raising Hands', keywords: ['praise', 'yay', 'hooray', 'celebrate'] },
      { emoji: '🤝', name: 'Handshake', keywords: ['deal', 'agree', 'meet', 'partner'] },
      { emoji: '✌️', name: 'Peace Sign', keywords: ['peace', 'victory', 'two'] },
      { emoji: '🤞', name: 'Crossed Fingers', keywords: ['luck', 'hope', 'wish'] },
      { emoji: '👋', name: 'Waving Hand', keywords: ['hi', 'hello', 'bye', 'wave'] },
      { emoji: '✋', name: 'High Five', keywords: ['stop', 'high five', 'hand'] },
      { emoji: '👊', name: 'Fist Bump', keywords: ['bro', 'punch', 'together', 'respect'] },
      { emoji: '💪', name: 'Flexed Bicep', keywords: ['strong', 'gym', 'fitness', 'power', 'muscle'] },
      { emoji: '🙏', name: 'Folded Hands', keywords: ['please', 'thanks', 'pray', 'namaste', 'thank you'] },
      { emoji: '🤙', name: 'Shaka Sign', keywords: ['call', 'chill', 'hang loose', 'cool'] },
      { emoji: '🫶', name: 'Heart Hands', keywords: ['love', 'support', 'care', 'heart'] },
      { emoji: '👀', name: 'Eyes', keywords: ['look', 'see', 'watching', 'observe'] },
      { emoji: '🔥', name: 'Fire', keywords: ['lit', 'hot', 'awesome', 'fire', 'hype'] },
      { emoji: '💯', name: 'Hundred Points', keywords: ['perfect', '100', 'score', 'exact'] }
    ]
  },
  {
    id: 'campus',
    name: 'Campus & Study',
    icon: <BookOpen className="w-3.5 h-3.5" />,
    emojis: [
      { emoji: '📚', name: 'Books', keywords: ['study', 'library', 'read', 'homework', 'exam'] },
      { emoji: '📖', name: 'Open Book', keywords: ['reading', 'notes', 'learn', 'chapter'] },
      { emoji: '💻', name: 'Laptop', keywords: ['coding', 'tech', 'computer', 'hackathon', 'dev'] },
      { emoji: '🖊️', name: 'Pen', keywords: ['write', 'exam', 'notes', 'signing'] },
      { emoji: '📝', name: 'Memo', keywords: ['notes', 'todo', 'task', 'list'] },
      { emoji: '🎒', name: 'Backpack', keywords: ['school', 'college', 'bag', 'campus'] },
      { emoji: '🔬', name: 'Microscope', keywords: ['science', 'lab', 'research', 'experiment'] },
      { emoji: '💡', name: 'Lightbulb', keywords: ['idea', 'bright', 'solution', 'smart'] },
      { emoji: '🧠', name: 'Brain', keywords: ['smart', 'intelligence', 'genius', 'mind'] },
      { emoji: '📊', name: 'Bar Chart', keywords: ['data', 'presentation', 'analytics', 'chart'] },
      { emoji: '🎓', name: 'Graduation Cap', keywords: ['college', 'degree', 'student', 'grad'] },
      { emoji: '🏛️', name: 'Campus Commons', keywords: ['campus', 'university', 'college', 'building'] },
      { emoji: '🏫', name: 'School', keywords: ['class', 'lecture', 'campus', 'hall'] },
      { emoji: '📐', name: 'Ruler', keywords: ['math', 'engineering', 'design', 'geometry'] },
      { emoji: '📎', name: 'Paperclip', keywords: ['attachment', 'document', 'clip'] },
      { emoji: '📅', name: 'Calendar', keywords: ['date', 'schedule', 'event', 'meetup', 'time'] },
      { emoji: '⏰', name: 'Alarm Clock', keywords: ['time', 'urgent', 'deadline', 'alarm'] }
    ]
  },
  {
    id: 'activities',
    name: 'Sports & Activities',
    icon: <Trophy className="w-3.5 h-3.5" />,
    emojis: [
      { emoji: '⚽', name: 'Football / Soccer', keywords: ['football', 'match', 'game', 'turf', 'soccer'] },
      { emoji: '🏀', name: 'Basketball', keywords: ['hoops', 'court', 'ball', 'dunk'] },
      { emoji: '🏏', name: 'Cricket', keywords: ['cricket', 'bat', 'ipl', 'match', 'wicket'] },
      { emoji: '🏸', name: 'Badminton', keywords: ['badminton', 'shuttle', 'racket', 'court'] },
      { emoji: '🎾', name: 'Tennis', keywords: ['tennis', 'court', 'racket'] },
      { emoji: '🏐', name: 'Volleyball', keywords: ['volleyball', 'spike', 'beach'] },
      { emoji: '🏃', name: 'Running', keywords: ['runner', 'athletics', 'sprint', 'jog'] },
      { emoji: '🚴', name: 'Cycling', keywords: ['bike', 'ride', 'cycle'] },
      { emoji: '🏋️', name: 'Weightlifting', keywords: ['gym', 'workout', 'lifting', 'fitness'] },
      { emoji: '💃', name: 'Dancing Woman', keywords: ['dance', 'bhangra', 'salsa', 'choreography'] },
      { emoji: '🕺', name: 'Dancing Man', keywords: ['dance', 'groove', 'fest', 'party'] },
      { emoji: '🎸', name: 'Guitar', keywords: ['music', 'acoustic', 'jam', 'band'] },
      { emoji: '🎨', name: 'Artist Palette', keywords: ['art', 'design', 'drawing', 'ui', 'creative'] },
      { emoji: '🎮', name: 'Video Game', keywords: ['gaming', 'fifa', 'esports', 'controller'] },
      { emoji: '🎯', name: 'Target', keywords: ['goal', 'focus', 'bullseye', 'aim'] },
      { emoji: '🏆', name: 'Trophy', keywords: ['winner', 'first place', 'champion', 'cup'] },
      { emoji: '🥇', name: 'Gold Medal', keywords: ['gold', 'winner', 'top', 'first'] },
      { emoji: '👑', name: 'Crown', keywords: ['king', 'queen', 'leader', 'best'] }
    ]
  },
  {
    id: 'meetup',
    name: 'Food & Hangouts',
    icon: <Coffee className="w-3.5 h-3.5" />,
    emojis: [
      { emoji: '🍕', name: 'Pizza', keywords: ['food', 'slice', 'snack', 'meetup', 'pizza'] },
      { emoji: '🍔', name: 'Burger', keywords: ['burger', 'fast food', 'lunch', 'canteen'] },
      { emoji: '🥪', name: 'Sandwich', keywords: ['lunch', 'canteen', 'cafe', 'snack'] },
      { emoji: '☕', name: 'Coffee', keywords: ['caffeine', 'study', 'break', 'morning', 'cafe'] },
      { emoji: '🥤', name: 'Cold Drink', keywords: ['drink', 'soda', 'smoothie', 'beverage'] },
      { emoji: '🧋', name: 'Boba Tea', keywords: ['tea', 'sweet', 'hangout', 'boba'] },
      { emoji: '🍿', name: 'Popcorn', keywords: ['movie', 'hangout', 'chill', 'snack'] },
      { emoji: '🍩', name: 'Donut', keywords: ['sweet', 'treat', 'snack'] },
      { emoji: '🎉', name: 'Party Popper', keywords: ['celebrate', 'yay', 'fest', 'party', 'congrats'] },
      { emoji: '✨', name: 'Sparkles', keywords: ['magic', 'clean', 'vibe', 'shine', 'special'] },
      { emoji: '⭐', name: 'Star', keywords: ['favorite', 'top', 'star', 'highlight'] },
      { emoji: '🌟', name: 'Glowing Star', keywords: ['awesome', 'brilliant', 'star', 'glow'] },
      { emoji: '❤️', name: 'Red Heart', keywords: ['love', 'favorite', 'heart', 'like'] },
      { emoji: '💙', name: 'Blue Heart', keywords: ['mema', 'campus', 'support', 'trust'] },
      { emoji: '💜', name: 'Purple Heart', keywords: ['vibe', 'love', 'support'] },
      { emoji: '🚀', name: 'Rocket', keywords: ['launch', 'fast', 'start', 'speed', 'future'] },
      { emoji: '⚡', name: 'Lightning', keywords: ['electric', 'fast', 'energy', 'hype', 'speed'] }
    ]
  }
];

const QUICK_EMOJIS = ['😂', '🔥', '❤️', '👍', '👏', '🙌', '✨', '🎉', '😎', '🚀', '💯', '🤩'];

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  isOpen,
  onClose,
  onSelectEmoji,
  position = 'bottom-left'
}) => {
  const [activeTab, setActiveTab] = useState<string>('smileys');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const pickerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset search when opening
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredEmojis = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      const activeCategory = EMOJI_CATEGORIES.find(c => c.id === activeTab);
      return activeCategory ? activeCategory.emojis : [];
    }

    const matched: EmojiData[] = [];
    const seen = new Set<string>();

    for (const cat of EMOJI_CATEGORIES) {
      for (const item of cat.emojis) {
        if (!seen.has(item.emoji)) {
          const matchName = item.name.toLowerCase().includes(query);
          const matchKeyword = item.keywords.some(k => k.toLowerCase().includes(query));
          if (matchName || matchKeyword) {
            seen.add(item.emoji);
            matched.push(item);
          }
        }
      }
    }

    return matched;
  }, [searchQuery, activeTab]);

  if (!isOpen) return null;

  return (
    <div
      ref={pickerRef}
      className={`absolute z-50 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
        position === 'bottom-left'
          ? 'bottom-16 left-0 origin-bottom-left'
          : position === 'bottom-right'
          ? 'bottom-16 right-0 origin-bottom-right'
          : 'top-12 left-0 origin-top-left'
      }`}
    >
      {/* Top Header & Search Bar */}
      <div className="p-2.5 pb-2 border-b border-[#DCE8F7] dark:border-slate-800 bg-[#F8FBFF] dark:bg-slate-800/80 space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#2563EB] dark:text-blue-400 uppercase tracking-wider">
            <Smile className="w-3.5 h-3.5" />
            <span>Chat Emojis</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B] dark:text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search emoji (e.g. fire, laugh, study)..."
            className="w-full bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-700 focus:border-[#2563EB] dark:focus:border-blue-500 rounded-full pl-8 pr-7 py-1.5 text-xs text-[#172033] dark:text-white placeholder-[#64748B] dark:placeholder-slate-500 focus:outline-none transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Reaction Row (Top 12) */}
      {!searchQuery && (
        <div className="px-2.5 py-1.5 bg-[#F0F6FF] dark:bg-slate-800/40 border-b border-[#DCE8F7] dark:border-slate-800/60 flex items-center gap-1 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 shrink-0 px-1">
            Fast:
          </span>
          {QUICK_EMOJIS.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => onSelectEmoji(emoji)}
              className="w-7 h-7 flex items-center justify-center text-sm rounded-lg hover:bg-white dark:hover:bg-slate-700 hover:scale-125 transition-transform shrink-0 active:scale-95"
              title={`Add ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Category Tabs (When not searching) */}
      {!searchQuery && (
        <div className="flex items-center justify-between px-2 pt-2 border-b border-[#DCE8F7] dark:border-slate-800">
          {EMOJI_CATEGORIES.map(cat => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`flex-1 pb-2 flex flex-col items-center justify-center text-[11px] font-bold transition-all relative ${
                  isActive
                    ? 'text-[#2563EB] dark:text-blue-400'
                    : 'text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-slate-200'
                }`}
                title={cat.name}
              >
                <div className="p-1 rounded-md">{cat.icon}</div>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#2563EB] dark:bg-blue-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Emoji Grid Area */}
      <div className="p-2.5 max-h-52 overflow-y-auto min-h-[170px]">
        {filteredEmojis.length === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center text-center p-4 text-xs text-[#64748B] dark:text-slate-400">
            <p className="font-semibold">No emojis found</p>
            <p className="text-[10px] mt-0.5">Try searching "smile", "heart", or "football"</p>
          </div>
        ) : (
          <div>
            {searchQuery && (
              <p className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 mb-1.5 px-1">
                Results ({filteredEmojis.length})
              </p>
            )}
            <div className="grid grid-cols-7 gap-1">
              {filteredEmojis.map(item => (
                <button
                  key={item.emoji}
                  type="button"
                  onClick={() => onSelectEmoji(item.emoji)}
                  className="w-9 h-9 flex items-center justify-center text-lg rounded-xl hover:bg-[#F0F6FF] dark:hover:bg-slate-800 hover:scale-125 transition-transform active:scale-95"
                  title={item.name}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="px-3 py-1.5 bg-[#F8FBFF] dark:bg-slate-800/90 border-t border-[#DCE8F7] dark:border-slate-800 flex items-center justify-between text-[10px] text-[#64748B] dark:text-slate-400">
        <span>Tap emoji to insert into chat</span>
        <span className="font-bold text-[#2563EB] dark:text-blue-400">MEMA Chat</span>
      </div>
    </div>
  );
};
