'use client';

import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertTriangle,
  XCircle,
  Eye,
  Calendar,
  CreditCard,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';
import { Transaction, TransactionStatus } from '@/types/subscription';

export default function TransactionsBillingPage() {
  const {
    transactions,
    currency,
    issueRefund,
    exportTransactionsCSV,
  } = useSubscription();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TransactionStatus>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  // Modals state
  const [refundingTx, setRefundingTx] = useState<Transaction | null>(null);
  const [revokeAccessCheckbox, setRevokeAccessCheckbox] = useState(true);
  const [previewTx, setPreviewTx] = useState<Transaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered list
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        t.userName.toLowerCase().includes(q) ||
        t.userEmail.toLowerCase().includes(q) ||
        t.invoiceNumber.toLowerCase().includes(q) ||
        t.planName.toLowerCase().includes(q);
      if (!matchesSearch) return false;

      // Status
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;

      // Method
      if (methodFilter !== 'all' && t.paymentMethod !== methodFilter) return false;

      return true;
    });
  }, [transactions, searchQuery, statusFilter, methodFilter]);

  const handleRefundConfirm = () => {
    if (!refundingTx) return;
    issueRefund(refundingTx.id, revokeAccessCheckbox);
    setRefundingTx(null);
    showToast(`Refund issued for ${refundingTx.invoiceNumber}!`);
  };

  const renderStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <RotateCcw className="w-3 h-3" /> Refunded
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" /> Failed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-2xl border border-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            Transactions & Billing History
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {transactions.length} Records
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Comprehensive audit ledger of all completed, pending, refunded, and failed charges
          </p>
        </div>

        <button
          onClick={exportTransactionsCSV}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Table to CSV</span>
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
            placeholder="Search by invoice (INV-...), user, or plan..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-slate-800/80 border border-slate-700 rounded-xl text-xs font-semibold">
            {(['all', 'completed', 'pending', 'refunded', 'failed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                  statusFilter === s
                    ? 'bg-brand-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Payment Method Selector */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            aria-label="Filter by payment method"
            className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Methods</option>
            <option value="click">Click</option>
            <option value="payme">Payme</option>
            <option value="uzcard">Uzcard</option>
            <option value="humo">Humo</option>
            <option value="stripe">Stripe</option>
            <option value="wire">Bank Wire</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Plan Tier</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No transactions match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Invoice */}
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {tx.invoiceNumber}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-white">{tx.userName}</div>
                        <div className="text-[11px] text-slate-400">{tx.userEmail}</div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {tx.planName}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-white">
                        {currency === 'UZS'
                          ? `${tx.amountUZS.toLocaleString()} UZS`
                          : `$${tx.amountUSD}`}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {currency === 'UZS'
                          ? `$${tx.amountUSD} USD`
                          : `${tx.amountUZS.toLocaleString()} UZS`}
                      </div>
                    </td>

                    {/* Method */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-800 rounded border border-slate-700 uppercase">
                        {tx.paymentMethod}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">{renderStatusBadge(tx.status)}</td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewTx(tx)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Invoice Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {tx.status === 'completed' && (
                          <button
                            onClick={() => setRefundingTx(tx)}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors"
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REFUND MODAL */}
      {refundingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">Issue Payment Refund</h3>
              </div>
              <button
                onClick={() => setRefundingTx(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-300">
                You are about to issue a refund for invoice{' '}
                <span className="font-mono font-bold text-white">
                  {refundingTx.invoiceNumber}
                </span>{' '}
                belonging to{' '}
                <span className="font-bold text-white">{refundingTx.userName}</span>.
              </p>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Refund Amount:</span>
                  <span className="font-bold text-rose-400">
                    ${refundingTx.amountUSD} USD ({refundingTx.amountUZS.toLocaleString()} UZS)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Channel:</span>
                  <span className="font-mono uppercase text-slate-200">
                    {refundingTx.paymentMethod}
                  </span>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={revokeAccessCheckbox}
                  onChange={(e) => setRevokeAccessCheckbox(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-rose-600 focus:ring-0"
                />
                <span>Also revoke Pro access and downgrade user to Free starter tier</span>
              </label>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRefundingTx(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRefundConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/30"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRANSACTION INVOICE PREVIEW MODAL */}
      {previewTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-400" />
                <h3 className="text-base font-bold text-white">Invoice #{previewTx.invoiceNumber}</h3>
              </div>
              <button
                onClick={() => setPreviewTx(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 p-5 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="font-bold text-white text-sm">SAASIFY BILLING INVOICE</span>
                {renderStatusBadge(previewTx.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="text-white font-bold">{previewTx.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-slate-300">{previewTx.userEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Subscription Item:</span>
                <span className="text-brand-300 font-bold">{previewTx.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Gateway:</span>
                <span className="text-slate-200 uppercase">{previewTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Processed At:</span>
                <span className="text-slate-200">{new Date(previewTx.date).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700">
                <span className="text-slate-400">Total Settled:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  ${previewTx.amountUSD} USD / {previewTx.amountUZS.toLocaleString()} UZS
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewTx(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
              >
                Close Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
