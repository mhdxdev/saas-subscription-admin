'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, User, Receipt, Layers, FileCheck, ArrowRight } from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { users, requests, transactions, plans } = useSubscription();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return { users: [], requests: [], transactions: [], plans: [] };
    }
    const q = searchTerm.toLowerCase();

    return {
      users: users
        .filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
        .slice(0, 4),
      requests: requests
        .filter(
          (r) =>
            r.userName.toLowerCase().includes(q) ||
            r.userEmail.toLowerCase().includes(q) ||
            (r.transactionRef && r.transactionRef.toLowerCase().includes(q))
        )
        .slice(0, 3),
      transactions: transactions
        .filter(
          (t) =>
            t.userName.toLowerCase().includes(q) ||
            t.userEmail.toLowerCase().includes(q) ||
            t.invoiceNumber.toLowerCase().includes(q)
        )
        .slice(0, 3),
      plans: plans
        .filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
        .slice(0, 3),
    };
  }, [searchTerm, users, requests, transactions, plans]);

  if (!isOpen) return null;

  const totalResults =
    filteredResults.users.length +
    filteredResults.requests.length +
    filteredResults.transactions.length +
    filteredResults.plans.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-800/40">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user name, email, invoice (INV-...), or transaction ref..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 mr-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-semibold bg-slate-800 text-slate-300 rounded-md border border-slate-700 hover:bg-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!searchTerm ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              Start typing to search users, subscription requests, invoices, and plans...
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No results found for &quot;<span className="text-white font-medium">{searchTerm}</span>&quot;
            </div>
          ) : (
            <>
              {/* Users */}
              {filteredResults.users.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <User className="w-3.5 h-3.5 text-brand-400" /> Users ({filteredResults.users.length})
                  </div>
                  <div className="space-y-1">
                    {filteredResults.users.map((u) => (
                      <Link
                        key={u.id}
                        href="/admin/subscriptions"
                        onClick={onClose}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">
                              {u.name}
                            </p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {u.planId.toUpperCase()}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-white transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Requests */}
              {filteredResults.requests.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <FileCheck className="w-3.5 h-3.5 text-amber-400" /> Pending Requests ({filteredResults.requests.length})
                  </div>
                  <div className="space-y-1">
                    {filteredResults.requests.map((r) => (
                      <Link
                        key={r.id}
                        href="/admin/requests"
                        onClick={onClose}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/80 transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-amber-300">
                            {r.userName} ({r.planName})
                          </p>
                          <p className="text-xs text-slate-400">
                            Via {r.paymentMethod.toUpperCase()} • Ref: {r.transactionRef || 'N/A'}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                          ${r.amountUSD} / {r.amountUZS.toLocaleString()} UZS
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Transactions */}
              {filteredResults.transactions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <Receipt className="w-3.5 h-3.5 text-emerald-400" /> Transactions ({filteredResults.transactions.length})
                  </div>
                  <div className="space-y-1">
                    {filteredResults.transactions.map((t) => (
                      <Link
                        key={t.id}
                        href="/admin/transactions"
                        onClick={onClose}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/80 transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-emerald-300">
                            {t.invoiceNumber} — {t.userName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {t.planName} • {new Date(t.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {t.status.toUpperCase()}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Plans */}
              {filteredResults.plans.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" /> Plans ({filteredResults.plans.length})
                  </div>
                  <div className="space-y-1">
                    {filteredResults.plans.map((p) => (
                      <Link
                        key={p.id}
                        href="/admin/plans"
                        onClick={onClose}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/80 transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-indigo-300">
                            {p.name}
                          </p>
                          <p className="text-xs text-slate-400">{p.description}</p>
                        </div>
                        <span className="text-xs font-bold text-indigo-400">
                          ${p.priceUSD} / {p.billingCycle}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
