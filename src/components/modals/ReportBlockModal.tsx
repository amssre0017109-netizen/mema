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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="bg-white border border-[#DCE8F7] rounded-[2.5rem] max-w-md w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4 text-[#172033]">
        <button
          onClick={closeReportModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#F8FBFF] text-[#64748B] hover:text-[#172033] border border-[#DCE8F7] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Action Toggle */}
        <div className="flex items-center gap-2 border-b border-[#DCE8F7] pb-3">
          <button
            type="button"
            onClick={() => setActionTab('report')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              actionTab === 'report'
                ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-xs'
                : 'text-[#64748B] hover:bg-[#F8FBFF]'
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
                ? 'bg-[#172033] text-white shadow-xs'
                : 'text-[#64748B] hover:bg-[#F8FBFF]'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            <span>Block Student</span>
          </button>
        </div>

        {actionTab === 'report' ? (
          <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
            <div>
              <h3 className="font-extrabold text-sm text-[#172033]">
                Why are you reporting "{reportModalData.targetName}"?
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Our campus safety moderators review all reports within 1 hour.
              </p>
            </div>

            <div className="space-y-1.5">
              {reportReasons.map(r => (
                <label
                  key={r}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    reason === r
                      ? 'bg-[#F0F6FF] border-[#2563EB] text-[#2563EB] font-bold'
                      : 'bg-white border-[#DCE8F7] text-[#172033] hover:bg-[#F8FBFF]'
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
              <label className="block font-bold text-[#172033] mb-1">Additional details (Optional):</label>
              <textarea
                rows={2}
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Describe what happened..."
                className="w-full bg-[#F8FBFF] border border-[#DCE8F7] focus:border-[#2563EB] rounded-2xl p-2.5 text-xs text-[#172033] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#DCE8F7]">
              <button
                type="button"
                onClick={closeReportModal}
                className="px-4 py-2 bg-[#F8FBFF] text-[#64748B] font-bold rounded-full hover:bg-[#F0F6FF] border border-[#DCE8F7] transition-colors"
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
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center border border-rose-100">
                <UserX className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#172033]">
                Block {reportModalData.targetName}?
              </h3>
              <p className="text-xs text-[#64748B] max-w-xs mx-auto leading-relaxed">
                They will no longer be able to see your requests, send interest, or message you.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#DCE8F7]">
              <button
                type="button"
                onClick={closeReportModal}
                className="px-4 py-2 bg-[#F8FBFF] text-[#64748B] font-bold rounded-full hover:bg-[#F0F6FF] border border-[#DCE8F7] transition-colors"
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
