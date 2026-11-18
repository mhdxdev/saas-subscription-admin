'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Sparkles,
  Menu,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';
import { GrantProModal } from './GrantProModal';
import { GlobalSearchModal } from './GlobalSearchModal';

interface AdminTopbarProps {
  onMobileMenuToggle: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ onMobileMenuToggle }) => {
  const {
    analytics,
    requests,
    currency,
    setCurrency,
    resetToDefaults,
    activities,
  } = useSubscription();

  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const pendingRequests = requests.filter((r) => r.status === 'pending');

  const handleReset = () => {
    resetToDefaults();
    setResetConfirm(true);
    setTimeout(() => setResetConfirm(false), 2000);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-slate-100">
        {/* Left: Mobile hamburger + Global Search input trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 -ml-1 text-slate-400 hover:text-white rounded-lg lg:hidden hover:bg-slate-800"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 w-48 sm:w-72 md:w-80 text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 rounded-xl text-xs text-slate-400 transition-all shadow-inner"
          >
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate">Search user, email, invoice...</span>
            <kbd className="hidden sm:inline-block ml-auto px-1.5 py-0.5 text-[10px] font-semibold bg-slate-700/60 text-slate-300 rounded border border-slate-600">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Currency Toggle, Quick Actions, Notifications, Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Toggle */}
          <div className="flex items-center p-0.5 bg-slate-800 rounded-xl border border-slate-700/80 text-xs font-semibold">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                currency === 'USD'
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
            <button
              onClick={() => setCurrency('UZS')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                currency === 'UZS'
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              UZS
            </button>
          </div>

          {/* Quick "Grant Pro Access" Button */}
          <button
            onClick={() => setIsGrantModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Grant Pro</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={handleReset}
            title="Reset Mock Dataset to Default Seed"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-700"
          >
            <RotateCcw className={`w-4 h-4 ${resetConfirm ? 'text-emerald-400 animate-spin' : ''}`} />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {analytics.pendingRequestsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-40 overflow-hidden text-slate-100">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-800/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Admin Alerts
                      </span>
                      {analytics.pendingRequestsCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {analytics.pendingRequestsCount} Pending
                        </span>
                      )}
                    </div>
                    <Link
                      href="/admin/requests"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-brand-400 hover:underline flex items-center gap-1"
                    >
                      View all <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 p-1">
                    {pendingRequests.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-400" />
                        No pending approvals. You are completely caught up!
                      </div>
                    ) : (
                      pendingRequests.map((req) => (
                        <Link
                          key={req.id}
                          href="/admin/requests"
                          onClick={() => setShowNotifications(false)}
                          className="flex items-start gap-3 p-3 hover:bg-slate-800/70 rounded-xl transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/20">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white group-hover:text-brand-300">
                              {req.userName} requested {req.planName}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              Via {req.paymentMethod.toUpperCase()} • ${req.amountUSD} / {req.amountUZS.toLocaleString()} UZS
                            </p>
                            <p className="text-[10px] text-amber-400/90 font-medium mt-0.5">
                              Receipt attached & awaiting approval
                            </p>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>

                  {/* Recent Activity Footer Preview */}
                  <div className="p-2 border-t border-slate-800 bg-slate-900/90 text-center">
                    <span className="text-[11px] text-slate-400">
                      Recent Activity: {activities[0]?.title || 'System Operational'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Link to Main App */}
          <Link
            href="/"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-slate-700 transition-colors"
          >
            <span>Live App</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </header>

      {/* Grant Pro Modal */}
      <GrantProModal
        isOpen={isGrantModalOpen}
        onClose={() => setIsGrantModalOpen(false)}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};
