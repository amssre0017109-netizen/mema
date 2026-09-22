import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  UserX,
  Flag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportBlockModal: React.FC = () => {
  const {
    reportModalData,
    closeReportModal,
    submitReport,
    blockUser
  } = useApp();

  const [reason, setReason] = useState('Spam or commercial advertising');
  const [details, setDetails] = useState('');
  const [actionTab, setActionTab] = useState<'report' | 'block'>('report');

  if (!reportModalData || !reportModalData.isOpen) return null;

  const reportReasons = [
    'Spam, advertising, or commercial promotions',
    'Fake profile / Impersonation / Inappropriate behavior',
    'Harassment, abusive language, or inappropriate content',
    'Dating/Romance solicitation (Not permitted on MEMA)',
    'Safety concern or suspicious meetup request',
    'Other violation'
  ];

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(reason, details.trim());
  };

  const handleBlockConfirm = () => {
    blockUser(reportModalData.targetId, reportModalData.targetName);
    closeReportModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-[2.5rem] max-w-md w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4 text-[#172033] dark:text-white">
        <button
          onClick={closeReportModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#F8FBFF] dark:bg-slate-800 text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white hover:bg-[#F0F6FF] dark:hover:bg-slate-700 border border-[#DCE8F7] dark:border-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Action Toggle */}
        <div className="flex items-center gap-2 border-b border-[#DCE8F7] dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActionTab('report')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              actionTab === 'report'
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shadow-xs'
                : 'text-[#64748B] dark:text-slate-400 hover:bg-[#F8FBFF] dark:hover:bg-slate-800'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-rose-500" />
            <span>Report {reportModalData.type === 'user' ? 'Student' : 'Request'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActionTab('block')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              actionTab === 'block'
                ? 'bg-[#172033] dark:bg-slate-800 text-white shadow-xs border border-slate-700'
                : 'text-[#64748B] dark:text-slate-400 hover:bg-[#F8FBFF] dark:hover:bg-slate-800'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            <span>Block Student</span>
          </button>
        </div>

        {actionTab === 'report' ? (
          <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
            <div>
              <h3 className="font-extrabold text-sm text-[#172033] dark:text-white">
                Why are you reporting "{reportModalData.targetName}"?
              </h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
                Our campus safety moderators review all reports within 1 hour.
              </p>
            </div>

            <div className="space-y-1.5">
              {reportReasons.map(r => (
                <label
                  key={r}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    reason === r
                      ? 'bg-[#F0F6FF] dark:bg-blue-950/40 border-[#2563EB] dark:border-blue-500 text-[#2563EB] dark:text-blue-400 font-bold'
                      : 'bg-white dark:bg-slate-800/80 border-[#DCE8F7] dark:border-slate-700 text-[#172033] dark:text-slate-200 hover:bg-[#F8FBFF] dark:hover:bg-slate-750'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-[#2563EB]"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block font-bold text-[#172033] dark:text-slate-200 mb-1">Additional details (Optional):</label>
              <textarea
                rows={2}
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Describe what happened..."
                className="w-full bg-[#F8FBFF] dark:bg-slate-800 border border-[#DCE8F7] dark:border-slate-700 focus:border-[#2563EB] dark:focus:border-blue-400 rounded-2xl p-2.5 text-xs text-[#172033] dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#DCE8F7] dark:border-slate-800">
              <button
                type="button"
                onClick={closeReportModal}
                className="px-4 py-2 bg-[#F8FBFF] dark:bg-slate-800 text-[#64748B] dark:text-slate-300 font-bold rounded-full hover:bg-[#F0F6FF] dark:hover:bg-slate-700 border border-[#DCE8F7] dark:border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-full shadow-xs transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="text-center py-2 space-y-2">
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center border border-rose-100 dark:border-rose-900/60">
                <UserX className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#172033] dark:text-white">
                Block {reportModalData.targetName}?
              </h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                They will no longer be able to see your requests, send interest, or message you.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#DCE8F7] dark:border-slate-800">
              <button
                type="button"
                onClick={closeReportModal}
                className="px-4 py-2 bg-[#F8FBFF] dark:bg-slate-800 text-[#64748B] dark:text-slate-300 font-bold rounded-full hover:bg-[#F0F6FF] dark:hover:bg-slate-700 border border-[#DCE8F7] dark:border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlockConfirm}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-full shadow-xs transition-colors"
              >
                Block Student
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
