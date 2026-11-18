'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Users,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  RefreshCw,
  PlusCircle,
  Download,
  Calendar,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';
import { GrantProModal } from '@/components/admin/GrantProModal';

export default function AdminOverviewPage() {
  const {
    analytics,
    currency,
    activities,
    users,
    requests,
    exportTransactionsCSV,
  } = useSubscription();

  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);

  const pendingRequests = requests.filter((r) => r.status === 'pending');

  const formatCurrency = (usd: number, uzs: number) => {
    if (currency === 'UZS') {
      return `${uzs.toLocaleString()} UZS`;
    }
    return `$${usd.toLocaleString()}`;
  };

  // Find max revenue for bar chart scaling
  const maxBarValue = Math.max(
    ...analytics.monthlyRevenueData.map((d) => (currency === 'UZS' ? d.uzs : d.usd)),
    1
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            Overview & Revenue Analytics
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Sync
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time subscriber lifecycle metrics, revenue breakdown, and approval status
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={exportTransactionsCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsGrantModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Grant Pro Access</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: MRR */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Monthly Recurring Rev
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white tracking-tight">
              {formatCurrency(analytics.mrrUSD, analytics.mrrUZS)}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-semibold">+14.2%</span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
        </div>

        {/* Metric 2: Active Subscribers */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Subscribers
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center border border-brand-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-white tracking-tight">
                {analytics.activeSubscribers}
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                / {users.length} total users
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-brand-400">
              <span className="font-semibold">
                {Math.round((analytics.activeSubscribers / (users.length || 1)) * 100)}%
              </span>
              <span className="text-slate-400">paid conversion rate</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-brand-500/5 rounded-full blur-xl group-hover:bg-brand-500/10 transition-colors" />
        </div>

        {/* Metric 3: Pending Requests */}
        <Link
          href="/admin/requests"
          className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-amber-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pending Approvals
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-amber-400 tracking-tight">
                {analytics.pendingRequestsCount}
              </h3>
              <span className="text-xs text-slate-400 font-medium">awaiting review</span>
            </div>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-amber-300">
              <span>Review receipts</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors" />
        </Link>

        {/* Metric 4: Expiring Soon */}
        <Link
          href="/admin/subscriptions"
          className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-rose-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Expiring in 7 Days
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-white tracking-tight">
                {analytics.expiringSoonCount}
              </h3>
              <span className="text-xs text-slate-400 font-medium">subscribers</span>
            </div>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-rose-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Retention opportunity</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-colors" />
        </Link>
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Bar Chart (2 cols) */}
        <div className="lg:col-span-2 p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Revenue Growth Trajectory
                </h3>
                <p className="text-xs text-slate-400">
                  Last 6 months performance with current subscriber base
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" /> +88% growth H2
                </span>
              </div>
            </div>

            {/* Pure SVG / CSS Bar Chart */}
            <div className="h-56 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-800">
              {analytics.monthlyRevenueData.map((item, idx) => {
                const val = currency === 'UZS' ? item.uzs : item.usd;
                const heightPercent = Math.max(Math.round((val / maxBarValue) * 100), 12);
                const isCurrentMonth = idx === analytics.monthlyRevenueData.length - 1;

                return (
                  <div
                    key={item.month}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap bg-slate-800 border border-slate-700 text-white text-[11px] font-semibold px-2 py-1 rounded-lg shadow-xl">
                      {item.month}: {formatCurrency(item.usd, item.uzs)} ({item.subscribers} subs)
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 group-hover:brightness-125 ${
                        isCurrentMonth
                          ? 'bg-gradient-to-t from-brand-600 to-indigo-500 shadow-lg shadow-brand-500/25 ring-2 ring-brand-400/40'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    />
                    <span
                      className={`text-xs mt-2 font-medium ${
                        isCurrentMonth ? 'text-brand-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-slate-700" />
                <span>Historical</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-brand-500" />
                <span>Current Month (Live MRR)</span>
              </div>
            </div>
            <span>Updated live from context</span>
          </div>
        </div>

        {/* Plan Distribution Breakdown (1 col) */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Plan Distribution
                </h3>
                <p className="text-xs text-slate-400">Subscribers per active tier</p>
              </div>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="h-4 w-full rounded-full bg-slate-800 overflow-hidden flex mb-5 p-0.5">
              {analytics.planDistribution.map((item) => (
                <div
                  key={item.planId}
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                  title={`${item.name}: ${item.count} users (${item.percentage}%)`}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300 hover:opacity-80"
                />
              ))}
            </div>

            {/* Plan List with Counts and Percentages */}
            <div className="space-y-3">
              {analytics.planDistribution.map((item) => (
                <div
                  key={item.planId}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-semibold text-white truncate max-w-[130px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 font-bold">
                      {item.count} users
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between">
            <Link
              href="/admin/plans"
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 group"
            >
              <span>Manage Plans & Pricing</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Pending Approvals Queue + Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals Quick Queue */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Awaiting Approvals
                </h3>
                {pendingRequests.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {pendingRequests.length} Needs Review
                  </span>
                )}
              </div>
              <Link
                href="/admin/requests"
                className="text-xs font-semibold text-brand-400 hover:underline"
              >
                View all requests
              </Link>
            </div>

            <div className="space-y-3">
              {pendingRequests.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  No pending subscription requests right now.
                </div>
              ) : (
                pendingRequests.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={req.userAvatar}
                        alt={req.userName}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                          {req.userName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {req.planName} • via{' '}
                          <span className="font-semibold text-slate-300 uppercase">
                            {req.paymentMethod}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-bold text-amber-400">
                        {formatCurrency(req.amountUSD, req.amountUZS)}
                      </span>
                      <Link
                        href="/admin/requests"
                        className="px-2.5 py-1 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 text-xs text-slate-400">
            Supports manual Uzcard, Humo, Click, Payme receipt approvals.
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white tracking-tight">
                Audit & Activity Feed
              </h3>
              <span className="text-xs text-slate-400 font-medium">Real-time log</span>
            </div>

            <div className="space-y-3.5">
              {activities.slice(0, 5).map((act) => {
                let badgeBg = 'bg-slate-800 text-slate-300';
                let Icon = RefreshCw;

                if (act.type === 'approval') {
                  badgeBg = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                  Icon = CheckCircle2;
                } else if (act.type === 'rejection' || act.type === 'cancellation') {
                  badgeBg = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
                  Icon = XCircle;
                } else if (act.type === 'upgrade' || act.type === 'plan_created') {
                  badgeBg = 'bg-brand-500/10 text-brand-400 border border-brand-500/20';
                  Icon = PlusCircle;
                }

                return (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl flex-shrink-0 ${badgeBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white truncate">
                          {act.title}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {new Date(act.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {act.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 text-xs text-slate-400">
            All administrative lifecycle changes are automatically tracked.
          </div>
        </div>
      </div>

      {/* Grant Pro Modal */}
      <GrantProModal
        isOpen={isGrantModalOpen}
        onClose={() => setIsGrantModalOpen(false)}
      />
    </div>
  );
}
