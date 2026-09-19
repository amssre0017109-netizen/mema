import React from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  CreditCard,
  CheckCircle2,
  XCircle,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const { adminMetrics, transactions, setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-36 pt-4 sm:pt-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase mb-1">
              <Zap className="w-3.5 h-3.5 text-slate-900" />
              <span>Admin Telemetry</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-display">Executive Dashboard</h1>
            <p className="text-xs text-slate-600">Revenue & Subscription Analytics</p>
          </div>
          <button
            onClick={() => setCurrentView('discover')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs rounded-full shadow-xs"
          >
            Back to App
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
            <div className="text-xs text-slate-500 font-semibold">Total Revenue</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">₹{adminMetrics.totalRevenueInr}</div>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
            <div className="text-xs text-slate-500 font-semibold">Active Subscriptions</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{adminMetrics.activeSubscriptions}</div>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
            <div className="text-xs text-slate-500 font-semibold">1-Month Free Trials</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{adminMetrics.freeTrialUsers}</div>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
            <div className="text-xs text-slate-500 font-semibold">Conversion Rate</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{adminMetrics.trialConversionRatePercent}%</div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Recent Payment Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="pb-3">Transaction ID</th>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Plan</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map(txn => (
                  <tr key={txn.id}>
                    <td className="py-3 font-mono text-slate-500">{txn.id}</td>
                    <td className="py-3 font-bold text-slate-900">{txn.userName}</td>
                    <td className="py-3 text-slate-700">{txn.planName}</td>
                    <td className="py-3 font-bold text-slate-900">₹{txn.amountInr}</td>
                    <td className="py-3">
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
