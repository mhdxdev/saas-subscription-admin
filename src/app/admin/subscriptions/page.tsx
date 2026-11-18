'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Ban,
  RefreshCw,
  Plus,
  ArrowUpDown,
  ExternalLink,
  Shield,
  Layers,
  ChevronRight,
  X,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';
import { User, SubscriptionStatus } from '@/types/subscription';
import { GrantProModal } from '@/components/admin/GrantProModal';

export default function SubscriptionsUsersPage() {
  const {
    users,
    plans,
    transactions,
    currency,
    extendSubscription,
    changeUserPlan,
    toggleUserStatus,
    toggleAutoRenew,
  } = useSubscription();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SubscriptionStatus>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Modals state
  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState<User | null>(null);
  const [changePlanUser, setChangePlanUser] = useState<User | null>(null);
  const [extendUser, setExtendUser] = useState<User | null>(null);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);

  // Extend days state
  const [extendDaysCount, setExtendDaysCount] = useState<number>(30);
  // Change plan state
  const [newPlanId, setNewPlanId] = useState<string>('pro-monthly');

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Status
      if (statusFilter !== 'all' && user.status !== statusFilter) return false;

      // Plan
      if (planFilter !== 'all' && user.planId !== planFilter) return false;

      return true;
    });
  }, [users, searchQuery, statusFilter, planFilter]);

  // Status badge helper
  const renderStatusBadge = (status: SubscriptionStatus, endDate: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active
          </span>
        );
      case 'expiring_soon':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Expiring Soon
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300 border border-slate-600">
            <AlertCircle className="w-3.5 h-3.5" /> Expired
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Ban className="w-3.5 h-3.5" /> Suspended
          </span>
        );
    }
  };

  // Plan badge helper
  const renderPlanBadge = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return <span className="text-xs text-slate-400">{planId}</span>;

    const colors: Record<string, string> = {
      free: 'bg-slate-800 text-slate-300 border-slate-700',
      'pro-monthly': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'pro-annual': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      lifetime: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${
          colors[plan.id] || 'bg-brand-500/10 text-brand-400 border-brand-500/20'
        }`}
      >
        {plan.name}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            Subscriptions & User Management
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {users.length} Users
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Control user access tiers, extend cycles, toggle renewals, and inspect detailed profiles
          </p>
        </div>

        <button
          onClick={() => setIsGrantModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/20 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Grant Access</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-slate-800/80 border border-slate-700 rounded-xl text-xs font-medium">
            {(['all', 'active', 'expiring_soon', 'expired', 'suspended'] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                    statusFilter === status
                      ? 'bg-brand-600 text-white shadow font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status === 'all' ? 'All' : status.replace('_', ' ')}
                </button>
              )
            )}
          </div>

          {/* Plan Tier Selector */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            aria-label="Filter by subscription plan"
            className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Plans</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Data Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Current Plan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Auto-Renew</th>
                <th className="py-3.5 px-4">Expiration Date</th>
                <th className="py-3.5 px-4">Progress</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No users match your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isLifetime = user.planId === 'lifetime';
                  const isFree = user.planId === 'free';
                  const endDateObj = new Date(user.endDate);
                  const formattedEnd =
                    isLifetime || isFree
                      ? 'No Expiry'
                      : endDateObj.toLocaleDateString();

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* User Column */}
                      <td className="py-3.5 px-4">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => setSelectedUserForDrawer(user)}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700 group-hover:ring-brand-500 transition-all"
                          />
                          <div>
                            <div className="font-bold text-white group-hover:text-brand-300 transition-colors flex items-center gap-1.5">
                              {user.name}
                              {user.role === 'admin' && (
                                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 text-[11px]">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Current Plan */}
                      <td className="py-3.5 px-4">{renderPlanBadge(user.planId)}</td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {renderStatusBadge(user.status, user.endDate)}
                      </td>

                      {/* Auto-Renew Toggle */}
                      <td className="py-3.5 px-4">
                        {isFree || isLifetime ? (
                          <span className="text-slate-400 text-[11px]">N/A</span>
                        ) : (
                          <button
                            onClick={() => toggleAutoRenew(user.id)}
                            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              user.autoRenew ? 'bg-brand-600' : 'bg-slate-700'
                            }`}
                            title={`Click to ${user.autoRenew ? 'disable' : 'enable'} auto-renew`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                user.autoRenew ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        )}
                      </td>

                      {/* Expiration Date */}
                      <td className="py-3.5 px-4 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span
                            className={
                              user.status === 'expiring_soon'
                                ? 'text-amber-400 font-bold'
                                : 'text-slate-300'
                            }
                          >
                            {formattedEnd}
                          </span>
                        </div>
                      </td>

                      {/* Progress Bar */}
                      <td className="py-3.5 px-4">
                        <div className="w-24">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span>SaaS Activity</span>
                            <span className="font-semibold text-slate-200">
                              {user.progressPercent}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${user.progressPercent}%` }}
                              className="h-full bg-brand-500 rounded-full"
                            />
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Extend button */}
                          <button
                            onClick={() => setExtendUser(user)}
                            className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
                            title="Extend Subscription"
                          >
                            +Extend
                          </button>

                          {/* Change Plan button */}
                          <button
                            onClick={() => {
                              setChangePlanUser(user);
                              setNewPlanId(user.planId);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 rounded-lg transition-colors"
                            title="Upgrade / Downgrade Plan"
                          >
                            Plan
                          </button>

                          {/* Inspect drawer */}
                          <button
                            onClick={() => setSelectedUserForDrawer(user)}
                            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            title="View Profile Details"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXTEND SUBSCRIPTION MODAL */}
      {extendUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Extend Subscription</h3>
                <p className="text-xs text-slate-400">
                  Adding extra days for {extendUser.name}
                </p>
              </div>
              <button
                onClick={() => setExtendUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                  Select Days to Add
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '+7 Days', days: 7 },
                    { label: '+30 Days', days: 30 },
                    { label: '+90 Days', days: 90 },
                    { label: '+180 Days', days: 180 },
                    { label: '+365 Days', days: 365 },
                  ].map((preset) => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => setExtendDaysCount(preset.days)}
                      className={`p-2.5 text-xs font-bold rounded-xl border text-center transition-all ${
                        extendDaysCount === preset.days
                          ? 'border-brand-500 bg-brand-500/20 text-brand-300 ring-1 ring-brand-500'
                          : 'border-slate-800 bg-slate-800/50 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Expiration:</span>
                  <span className="font-medium">
                    {new Date(extendUser.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>New Expiration:</span>
                  <span>
                    {(() => {
                      const d = new Date(extendUser.endDate);
                      const base = d > new Date() ? d : new Date();
                      base.setDate(base.getDate() + extendDaysCount);
                      return base.toLocaleDateString();
                    })()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setExtendUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  extendSubscription(extendUser.id, extendDaysCount);
                  setExtendUser(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/30"
              >
                Confirm Extension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PLAN MODAL */}
      {changePlanUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Change Subscription Plan</h3>
                <p className="text-xs text-slate-400">
                  Update plan tier for {changePlanUser.name}
                </p>
              </div>
              <button
                onClick={() => setChangePlanUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase">
                Select New Plan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {plans.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setNewPlanId(p.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      newPlanId === p.id
                        ? 'border-brand-500 bg-brand-500/15 text-white ring-1 ring-brand-500'
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{p.name}</span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        ${p.priceUSD}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {p.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setChangePlanUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  changeUserPlan(changePlanUser.id, newPlanId);
                  setChangePlanUser(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/30"
              >
                Save New Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER DETAILS SLIDE-OVER DRAWER */}
      {selectedUserForDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl text-slate-100">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  User Subscription Inspector
                </span>
                <button
                  onClick={() => setSelectedUserForDrawer(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Card */}
              <div className="py-5 flex items-center gap-4">
                <img
                  src={selectedUserForDrawer.avatar}
                  alt={selectedUserForDrawer.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-brand-500"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedUserForDrawer.name}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedUserForDrawer.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {renderPlanBadge(selectedUserForDrawer.planId)}
                    {renderStatusBadge(
                      selectedUserForDrawer.status,
                      selectedUserForDrawer.endDate
                    )}
                  </div>
                </div>
              </div>

              {/* Lifecycle Info */}
              <div className="space-y-3 bg-slate-800/40 border border-slate-800 p-4 rounded-xl text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Billing Cycle:</span>
                  <span className="font-semibold text-white capitalize">
                    {selectedUserForDrawer.billingCycle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Auto-Renew:</span>
                  <span
                    className={`font-semibold ${
                      selectedUserForDrawer.autoRenew
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {selectedUserForDrawer.autoRenew ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Member Since:</span>
                  <span className="font-semibold text-white">
                    {new Date(selectedUserForDrawer.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Expiration:</span>
                  <span className="font-semibold text-white">
                    {new Date(selectedUserForDrawer.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Active:</span>
                  <span className="font-semibold text-white">
                    {selectedUserForDrawer.lastActive}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Platform Progress:</span>
                  <span className="font-semibold text-brand-400">
                    {selectedUserForDrawer.progressPercent}% Completed
                  </span>
                </div>
              </div>

              {/* Notes */}
              {selectedUserForDrawer.notes && (
                <div className="mt-4 p-3 bg-slate-800/30 border border-slate-800 rounded-xl text-xs">
                  <span className="font-semibold text-slate-300 block mb-1">
                    Internal Admin Note:
                  </span>
                  <p className="text-slate-400">{selectedUserForDrawer.notes}</p>
                </div>
              )}

              {/* User Payment History */}
              <div className="mt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-brand-400" /> Payment Ledger
                </h4>
                <div className="space-y-2">
                  {transactions
                    .filter(
                      (t) =>
                        t.userId === selectedUserForDrawer.id ||
                        t.userEmail === selectedUserForDrawer.email
                    )
                    .map((t) => (
                      <div
                        key={t.id}
                        className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">{t.invoiceNumber}</p>
                          <p className="text-[11px] text-slate-400">
                            {new Date(t.date).toLocaleDateString()} • {t.paymentMethod.toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-400">${t.amountUSD}</p>
                          <span className="text-[10px] text-slate-400 uppercase">
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Quick Lifecycle Controls */}
            <div className="pt-6 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
                Lifecycle Action Controls
              </span>
              <div className="grid grid-cols-2 gap-2">
                {selectedUserForDrawer.status === 'suspended' ? (
                  <button
                    onClick={() => {
                      toggleUserStatus(selectedUserForDrawer.id, 'active');
                      setSelectedUserForDrawer({
                        ...selectedUserForDrawer,
                        status: 'active',
                      });
                    }}
                    className="p-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors"
                  >
                    Reactivate User
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      toggleUserStatus(selectedUserForDrawer.id, 'suspended');
                      setSelectedUserForDrawer({
                        ...selectedUserForDrawer,
                        status: 'suspended',
                      });
                    }}
                    className="p-2 text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl transition-colors"
                  >
                    Suspend User
                  </button>
                )}

                <button
                  onClick={() => {
                    changeUserPlan(selectedUserForDrawer.id, 'free');
                    setSelectedUserForDrawer({
                      ...selectedUserForDrawer,
                      planId: 'free',
                      status: 'active',
                    });
                  }}
                  className="p-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition-colors"
                >
                  Downgrade to Free
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grant Pro Modal */}
      <GrantProModal
        isOpen={isGrantModalOpen}
        onClose={() => setIsGrantModalOpen(false)}
      />
    </div>
  );
}
