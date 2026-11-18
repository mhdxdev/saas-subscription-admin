'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Code,
  Terminal,
  BookOpen,
  Layers,
  Clock,
  Play,
  RotateCcw,
  Check,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useSubscription } from '@/context/SubscriptionContext';

export default function HomePage() {
  const {
    currentUser,
    plans,
    analytics,
  } = useSubscription();

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const currentPlan = plans.find((p) => p.id === currentUser.planId) || plans[0];
  const isPaid = currentPlan.id !== 'free' && currentUser.status === 'active';
  const isExpiringSoon = currentUser.status === 'expiring_soon';

  const daysRemaining = (() => {
    if (currentUser.planId === 'free' || currentUser.planId === 'lifetime') return null;
    const diffMs = new Date(currentUser.endDate).getTime() - new Date().getTime();
    return Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 0);
  })();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* User Subscription Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-brand-500 shadow-xl"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    Welcome back, {currentUser.name}!
                  </h1>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                      isPaid
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : isExpiringSoon
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {currentPlan.name} Tier
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                  {isPaid ? (
                    <span>
                      You have full unlocked access to all senior engineering tracks, cloud execution, and AI mentors.
                      {daysRemaining !== null && ` (${daysRemaining} days remaining in current cycle)`}
                    </span>
                  ) : (
                    <span>
                      You are currently on the Free Starter tier with limited challenge executions. Upgrade to Pro to unlock 300+ modules and AI mentoring.
                    </span>
                  )}
                </p>

                {/* Progress bar */}
                <div className="mt-4 flex items-center gap-3 max-w-md">
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${currentUser.progressPercent}%` }}
                      className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-300">
                    {currentUser.progressPercent}% Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span>{isPaid ? 'Manage / Change Plan' : 'Upgrade to Pro'}</span>
              </button>

              <Link
                href="/admin"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>Open Admin Panel</span>
              </Link>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        </div>

        {/* Interactive Testing Workflow Guide Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-950/40 via-slate-900 to-slate-900 border border-brand-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center border border-brand-500/30 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                How to Test the Full Subscription Lifecycle:
              </h3>
              <p className="text-xs text-slate-300">
                1. Click &quot;Upgrade to Pro&quot; above & submit a payment receipt (Click, Payme, Uzcard).
                <br />
                2. Open <strong className="text-brand-300">/admin/requests</strong> to review the receipt and click &quot;Approve & Activate&quot;.
                <br />
                3. Return here to see your active Pro plan status update in real-time!
              </p>
            </div>
          </div>

          <Link
            href="/admin/requests"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow whitespace-nowrap self-stretch md:self-auto justify-center"
          >
            <span>Review Pending Requests ({analytics.pendingRequestsCount})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Feature Modules & Sandbox Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Code className="w-5 h-5" />
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Available
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Next.js 14 App Router Mastery
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Server components, parallel routes, intercepting modals, and streaming SSR architecture.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">18 Modules</span>
              <button className="text-brand-400 font-bold hover:underline flex items-center gap-1">
                <span>Start Lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Module 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Terminal className="w-5 h-5" />
                </span>
                {isPaid ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Unlocked
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Pro Tier
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white">
                Full-Stack Microservices & Go Runtime
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                High-concurrency microservices, gRPC protocol buffers, and distributed cache replication.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">32 Modules</span>
              {isPaid ? (
                <button className="text-brand-400 font-bold hover:underline flex items-center gap-1">
                  <span>Continue Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Unlock with Pro</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Module 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Sparkles className="w-5 h-5" />
                </span>
                {isPaid ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Unlocked
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Pro Tier
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white">
                AI Architect: RAG & Agentic Tool Calling
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Autonomous agents, vector embeddings with pgvector, and automated test synthesis.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">24 Modules</span>
              {isPaid ? (
                <button className="text-brand-400 font-bold hover:underline flex items-center gap-1">
                  <span>Open Playground</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Unlock with Pro</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Tiers Showcase Section */}
        <div className="py-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Transparent, Flexible Subscription Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Choose the tier that matches your engineering ambition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between ${
                  p.popular
                    ? 'bg-gradient-to-b from-brand-950/40 to-slate-900 border-brand-500 ring-1 ring-brand-500/40'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-extrabold text-white text-base">{p.name}</h4>
                    {p.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 min-h-[32px]">{p.description}</p>
                  <div className="my-4">
                    <div className="text-2xl font-black text-white">
                      ${p.priceUSD}{' '}
                      <span className="text-xs font-normal text-slate-400">
                        /{p.billingCycle}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {p.priceUZS.toLocaleString()} UZS
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    {p.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="w-full py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    Select Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">SaaSify Pro</span>
            <span>• Subscription Management Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-white transition-colors">
              Admin Overview
            </Link>
            <Link href="/admin/requests" className="hover:text-white transition-colors">
              Receipt Approvals
            </Link>
            <Link href="/admin/plans" className="hover:text-white transition-colors">
              Pricing Plans
            </Link>
            <Link href="/admin/transactions" className="hover:text-white transition-colors">
              Ledger
            </Link>
          </div>
        </div>
      </footer>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}
