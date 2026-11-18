'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  ChevronDown,
  User,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';
import { UpgradeModal } from './UpgradeModal';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    users,
    plans,
    analytics,
  } = useSubscription();

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const currentPlan = plans.find((p) => p.id === currentUser.planId) || plans[0];
  const isPaid = currentPlan.id !== 'free';

  const getStatusPill = () => {
    if (currentUser.status === 'expiring_soon') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <Clock className="w-3 h-3 text-amber-400" /> Expiring Soon
        </span>
      );
    }
    if (currentUser.status === 'expired') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-slate-800 text-slate-400 border border-slate-700">
          <AlertTriangle className="w-3 h-3 text-rose-400" /> Expired
        </span>
      );
    }
    if (currentUser.status === 'suspended') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
          Suspended
        </span>
      );
    }
    if (isPaid) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active Pro
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-slate-800 text-slate-400 border border-slate-700">
        Free Starter
      </span>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Navigation Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white leading-none">
                  SaaSify<span className="text-brand-400">Hub</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Developer Platform</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
              <Link href="/" className="text-white hover:text-brand-400 transition-colors">
                Platform
              </Link>
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="hover:text-white transition-colors"
              >
                Pricing & Plans
              </button>
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 font-bold transition-colors"
              >
                <span>Admin Dashboard</span>
                {analytics.pendingRequestsCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-black bg-amber-500 text-slate-950 rounded-full animate-pulse">
                    {analytics.pendingRequestsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* User Status, Upgrade Trigger, Switcher */}
          <div className="flex items-center gap-3">
            {/* Status Pill */}
            <div className="hidden sm:flex items-center gap-2">
              {getStatusPill()}
            </div>

            {/* Upgrade to Pro Button */}
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-md shadow-brand-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span>{isPaid ? 'Manage Subscription' : 'Upgrade to Pro'}</span>
            </button>

            {/* Direct Admin Link Button */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              <span className="hidden sm:inline">Admin Portal</span>
              {analytics.pendingRequestsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-black bg-amber-500 text-slate-950 rounded-full">
                  {analytics.pendingRequestsCount}
                </span>
              )}
            </Link>

            {/* User Switcher Dropdown (To test various user personas live) */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
                title="Switch User Persona to Test Different Subscription States"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-brand-500"
                />
                <span className="text-xs font-semibold text-slate-200 max-w-[80px] sm:max-w-[110px] truncate hidden sm:inline">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowUserDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-40 overflow-hidden text-slate-100 p-2">
                    <div className="px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      Simulate User Persona
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-1 py-1">
                      {users.map((u) => {
                        const isCurrent = u.id === currentUser.id;
                        return (
                          <div
                            key={u.id}
                            onClick={() => {
                              setCurrentUser(u);
                              setShowUserDropdown(false);
                            }}
                            className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-colors ${
                              isCurrent
                                ? 'bg-brand-600/20 text-white font-bold border border-brand-500/30'
                                : 'hover:bg-slate-800/80 text-slate-300'
                            }`}
                          >
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs truncate">{u.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {u.planId.toUpperCase()} • {u.status}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
};
