import React from 'react';
import {
  X,
  ChevronLeft,
  Download,
  Share2,
  MoreHorizontal,
  Sparkles,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MoodboardPosterModalProps {
  poster: {
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    tag?: string;
  } | null;
  onClose: () => void;
}

export const MoodboardPosterModal: React.FC<MoodboardPosterModalProps> = ({ poster, onClose }) => {
  const { currentUser, setNotificationToast } = useApp();

  if (!poster) return null;

  const handleDownload = () => {
    setNotificationToast({
      message: `Downloaded "${poster.title}" 🖼️`,
      subtext: 'High resolution editorial poster saved to device.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm h-[88vh] max-h-[750px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between text-white group">
        {/* Background Image Artwork */}
        <div className="absolute inset-0 z-0">
          <img
            src={poster.image}
            alt={poster.title}
            className="w-full h-full object-cover"
          />
          {/* Subtle noise and gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />
        </div>

        {/* Top Header matching right phone in screenshot */}
        <div className="relative z-10 p-4 pt-5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/20 transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Center User Pill Badge matching right phone */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25 shadow-lg">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-white/40"
            />
            <span className="font-editorial text-sm font-semibold tracking-wide text-white">
              {currentUser.name}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/20 transition-all active:scale-95"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Poster Center Headline & Typography ("red lips") */}
        <div className="relative z-10 px-6 space-y-3">
          <h1 className="text-5xl sm:text-6xl font-black font-display tracking-tight text-white uppercase drop-shadow-lg leading-none">
            {poster.title}
          </h1>

          <div className="grid grid-cols-3 gap-2 text-[8px] font-mono uppercase tracking-widest text-white/70 pt-2 border-t border-white/20">
            <div>
              <p className="font-bold text-white">SIGNAL</p>
              <p>ECHO DATA</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-white">TOUCH — FORM</p>
              <p>INTERRUPTED</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-white">TRACE LEFT</p>
              <p>WHO SPOKE FIRST</p>
            </div>
          </div>
        </div>

        {/* Bottom Download Icon matching right phone in screenshot */}
        <div className="relative z-10 p-5 flex items-center justify-center">
          <button
            onClick={handleDownload}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95"
            title="Download Poster Artwork"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
