'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, UserCheck, Calendar } from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';

interface GrantProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrantProModal: React.FC<GrantProModalProps> = ({ isOpen, onClose }) => {
  const { users, plans, grantProAccess } = useSubscription();
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || '');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('pro-monthly');
  const [durationDays, setDurationDays] = useState<number>(30);
  const [customDays, setCustomDays] = useState<string>('30');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const paidPlans = plans.filter((p) => p.id !== 'free');

  const handleGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedPlanId) return;

    const days = parseInt(customDays, 10) || durationDays || 30;
    grantProAccess(selectedUserId, selectedPlanId, days);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Grant Instant Pro Access</h3>
              <p className="text-xs text-slate-400">Directly activate subscription without payment verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Pro Access Granted!</h4>
            <p className="text-sm text-slate-400">The user account has been successfully upgraded and activated.</p>
          </div>
        ) : (
          <form onSubmit={handleGrant} className="p-6 space-y-4">
            {/* User Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target User
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email}) — Current: {u.planId.toUpperCase()} ({u.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Plan Tier Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Subscription Plan Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {paidPlans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <button
                      type="button"
                      key={plan.id}
                      onClick={() => {
                        setSelectedPlanId(plan.id);
                        if (plan.id === 'lifetime') {
                          setCustomDays('36500');
                        } else if (plan.id === 'pro-annual') {
                          setCustomDays('365');
                        } else {
                          setCustomDays('30');
                        }
                      }}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-500/10 text-white ring-1 ring-brand-500'
                          : 'border-slate-800 bg-slate-800/50 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{plan.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        ${plan.priceUSD} / {plan.billingCycle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration Days Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Duration (Days)
              </label>
              <div className="flex gap-2 mb-2">
                {[
                  { label: '+7 Days', days: '7' },
                  { label: '+30 Days', days: '30' },
                  { label: '+90 Days', days: '90' },
                  { label: '+365 Days', days: '365' },
                  { label: 'Lifetime', days: '36500' },
                ].map((preset) => (
                  <button
                    type="button"
                    key={preset.days}
                    onClick={() => {
                      setDurationDays(parseInt(preset.days, 10));
                      setCustomDays(preset.days);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                      customDays === preset.days
                        ? 'border-brand-500 bg-brand-500/20 text-brand-300 font-semibold'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="40000"
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  className="w-full px-3 py-2 pl-9 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                  placeholder="Custom days count"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserCheck className="w-4 h-4" />
                Confirm & Grant
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
