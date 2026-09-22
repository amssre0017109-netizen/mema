import React from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  EyeOff,
  GraduationCap,
  Flag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SafetyModal: React.FC = () => {
  const { isSafetyModalOpen, setIsSafetyModalOpen } = useApp();

  if (!isSafetyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-[2.5rem] max-w-md w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4 text-[#172033] dark:text-white">
        <button
          onClick={() => setIsSafetyModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#F8FBFF] dark:bg-slate-800 text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-[#F0F6FF] dark:hover:bg-slate-700 border border-[#DCE8F7] dark:border-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#2563EB] dark:text-blue-400" />
          <h2 className="text-xl font-black text-[#172033] dark:text-white font-display">Safety & Trust Guidelines</h2>
        </div>

        <div className="space-y-3 text-xs text-[#172033] dark:text-slate-200">
          <div className="bg-[#F8FBFF] dark:bg-slate-800/70 border border-[#DCE8F7] dark:border-slate-700 p-3.5 rounded-2xl space-y-1">
            <h4 className="font-bold text-[#172033] dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
              <span>1. Verified Profiles & Moderation</span>
            </h4>
            <p className="text-[#64748B] dark:text-slate-400">
              Members are verified with personal credentials and phone/email, ensuring authentic peers and safe connections.
            </p>
          </div>

          <div className="bg-[#F8FBFF] dark:bg-slate-800/70 border border-[#DCE8F7] dark:border-slate-700 p-3.5 rounded-2xl space-y-1">
            <h4 className="font-bold text-[#172033] dark:text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
              <span>2. Public Campus Meetups Only</span>
            </h4>
            <p className="text-[#64748B] dark:text-slate-400">
              Always meet in open, populated campus areas (Sports Grounds, College Library, Cafeteria, Tech Commons).
            </p>
          </div>

          <div className="bg-[#F8FBFF] dark:bg-slate-800/70 border border-[#DCE8F7] dark:border-slate-700 p-3.5 rounded-2xl space-y-1">
            <h4 className="font-bold text-[#172033] dark:text-white flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
              <span>3. Approximate Distance & Area Privacy</span>
            </h4>
            <p className="text-[#64748B] dark:text-slate-400 leading-relaxed">
              MEMA never exposes your exact live GPS location or home address. Only approximate distance bands (e.g. Nearby ~500m, ~Within 1 km) and generalized campus areas are shown.
            </p>
          </div>

          <div className="bg-[#F8FBFF] dark:bg-slate-800/70 border border-[#DCE8F7] dark:border-slate-700 p-3.5 rounded-2xl space-y-1">
            <h4 className="font-bold text-[#172033] dark:text-white flex items-center gap-1.5">
              <Flag className="w-4 h-4 text-rose-500" />
              <span>4. Zero Tolerance Moderation</span>
            </h4>
            <p className="text-[#64748B] dark:text-slate-400">
              MEMA is strictly for activities, skills, and teams. Inappropriate behavior or harassment results in an immediate campus ban.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setIsSafetyModalOpen(false)}
            className="px-5 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-bold text-xs rounded-full shadow-md transition-all"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
