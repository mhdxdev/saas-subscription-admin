'use client';

import React, { useState, useMemo } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  CreditCard,
  Calendar,
  AlertTriangle,
  X,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';
import { SubscriptionRequest, RequestStatus } from '@/types/subscription';

export default function SubscriptionRequestsPage() {
  const {
    requests,
    approveRequest,
    rejectRequest,
    currency,
  } = useSubscription();

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [previewReceiptRequest, setPreviewReceiptRequest] = useState<SubscriptionRequest | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<SubscriptionRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Tab filter
      if (activeTab !== 'all' && req.status !== activeTab) return false;

      // Search filter
      const q = searchQuery.toLowerCase();
      const matches =
        req.userName.toLowerCase().includes(q) ||
        req.userEmail.toLowerCase().includes(q) ||
        (req.transactionRef && req.transactionRef.toLowerCase().includes(q)) ||
        req.planName.toLowerCase().includes(q);

      return matches;
    });
  }, [requests, activeTab, searchQuery]);

  const handleApprove = (req: SubscriptionRequest) => {
    approveRequest(req.id, adminNotes || undefined);
    setAdminNotes('');
    setActionSuccessToast(`Approved and activated ${req.planName} for ${req.userName}!`);
    setTimeout(() => setActionSuccessToast(null), 3000);
  };

  const handleRejectConfirm = () => {
    if (!rejectingRequest) return;
    rejectRequest(rejectingRequest.id, rejectionReason || 'Payment could not be verified');
    setRejectingRequest(null);
    setRejectionReason('');
    setActionSuccessToast(`Rejected application for ${rejectingRequest.userName}.`);
    setTimeout(() => setActionSuccessToast(null), 3000);
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  const getMethodBadge = (method: string) => {
    const config: Record<string, { label: string; bg: string; text: string; border: string }> = {
      click: { label: 'Click', bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
      payme: { label: 'Payme', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
      uzcard: { label: 'Uzcard', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
      humo: { label: 'Humo', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
      stripe: { label: 'Stripe', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
      wire: { label: 'Bank Wire', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    };

    const c = config[method.toLowerCase()] || {
      label: method.toUpperCase(),
      bg: 'bg-slate-800',
      text: 'text-slate-300',
      border: 'border-slate-700',
    };

    return (
      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${c.bg} ${c.text} ${c.border}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-2xl border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-bold">{actionSuccessToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            Subscription Requests & Verification
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                {pendingCount} Awaiting Review
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Review manual card transfers, receipts, and activate paid subscriptions with a single click
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tab Filters */}
        <div className="flex items-center p-1 bg-slate-800/80 border border-slate-700 rounded-xl text-xs font-semibold w-full md:w-auto">
          {[
            { id: 'pending', label: 'Pending', count: pendingCount },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'all', label: 'All Requests' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500 text-white font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user, plan, reference..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-400">
            <FileCheck2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold text-white">No requests found</p>
            <p className="text-xs text-slate-400 mt-1">
              There are no subscription applications matching the current filter.
            </p>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const isPending = req.status === 'pending';
            const isApproved = req.status === 'approved';
            const isRejected = req.status === 'rejected';

            return (
              <div
                key={req.id}
                className={`p-5 bg-slate-900/90 border rounded-2xl transition-all ${
                  isPending
                    ? 'border-amber-500/30 hover:border-amber-500/60 bg-gradient-to-r from-slate-900/95 via-slate-900/95 to-amber-950/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* User & Request Details */}
                  <div className="flex items-start sm:items-center gap-4">
                    <img
                      src={req.userAvatar}
                      alt={req.userName}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white">
                          {req.userName}
                        </h3>
                        <span className="text-xs text-slate-400">({req.userEmail})</span>
                        {getMethodBadge(req.paymentMethod)}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                        <span className="font-semibold text-white">
                          Requested Plan: <span className="text-brand-400">{req.planName}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {new Date(req.submittedAt).toLocaleString()}
                        </span>
                        {req.transactionRef && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-slate-300">
                              Ref: {req.transactionRef}
                            </span>
                          </>
                        )}
                      </div>

                      {req.notes && (
                        <p className="text-xs text-slate-300 mt-2 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/60">
                          <span className="font-semibold text-slate-400">Note: </span>
                          {req.notes}
                        </p>
                      )}

                      {req.rejectionReason && (
                        <p className="text-xs text-rose-300 mt-2 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/30">
                          <span className="font-semibold text-rose-400">Rejection Reason: </span>
                          {req.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Financial Value & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <div className="text-left lg:text-right">
                      <div className="text-base font-black text-emerald-400">
                        {currency === 'UZS'
                          ? `${req.amountUZS.toLocaleString()} UZS`
                          : `$${req.amountUSD}`}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {currency === 'UZS'
                          ? `$${req.amountUSD} USD`
                          : `${req.amountUZS.toLocaleString()} UZS`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* View Receipt Button */}
                      <button
                        onClick={() => setPreviewReceiptRequest(req)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors"
                        title="Inspect receipt slip snapshot"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>Receipt</span>
                      </button>

                      {isPending ? (
                        <>
                          <button
                            onClick={() => setRejectingRequest(req)}
                            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                          <button
                            onClick={() => handleApprove(req)}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve & Activate</span>
                          </button>
                        </>
                      ) : isApproved ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-4 h-4" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <XCircle className="w-4 h-4" /> Rejected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RECEIPT PREVIEW MODAL */}
      {previewReceiptRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Payment Receipt Inspection</h3>
                  <p className="text-xs text-slate-400">{previewReceiptRequest.userName}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewReceiptRequest(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Realistic Payment Slip Card */}
            <div className="my-5 p-5 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="font-bold text-white uppercase tracking-wider text-sm">
                  {previewReceiptRequest.paymentMethod.toUpperCase()} TRANSACTION RECEIPT
                </span>
                <span className="text-emerald-400 font-bold">VERIFIED SLIP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reference No:</span>
                <span className="text-white font-bold">
                  {previewReceiptRequest.transactionRef || 'TRX-882910481'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Card Mask:</span>
                <span className="text-slate-200">8600 **** **** 4512</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient Account:</span>
                <span className="text-slate-200">SaaSify Technologies LLC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transferred Sum:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {previewReceiptRequest.amountUZS.toLocaleString()} UZS (${previewReceiptRequest.amountUSD} USD)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-200">
                  {new Date(previewReceiptRequest.submittedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Plan Tier:</span>
                <span className="text-brand-300 font-bold">
                  {previewReceiptRequest.planName}
                </span>
              </div>
            </div>

            {/* Receipt Image if available */}
            {previewReceiptRequest.receiptUrl && (
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Uploaded Document / Screenshot:
                </span>
                <div className="relative rounded-xl overflow-hidden border border-slate-800 h-44 bg-slate-950 flex items-center justify-center">
                  <img
                    src={previewReceiptRequest.receiptUrl}
                    alt="Receipt Screenshot"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[11px] text-slate-300 font-medium">
                      Bank slip verified with authorization seal
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewReceiptRequest(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close Preview
              </button>

              {previewReceiptRequest.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => {
                    handleApprove(previewReceiptRequest);
                    setPreviewReceiptRequest(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/30"
                >
                  <Check className="w-4 h-4" />
                  Approve This Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REJECT WITH REASON MODAL */}
      {rejectingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">Reject Subscription Request</h3>
              </div>
              <button
                onClick={() => setRejectingRequest(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-300">
                Are you sure you want to reject the subscription request for{' '}
                <span className="font-bold text-white">{rejectingRequest.userName}</span>?
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Reason for Rejection
                </label>
                <select
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full mb-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="Payment not found in bank statement">Payment not found in bank statement</option>
                  <option value="Transfer amount does not match plan price">Transfer amount does not match plan price</option>
                  <option value="Receipt screenshot is blurry or illegible">Receipt screenshot is blurry or illegible</option>
                  <option value="Duplicate submission detected">Duplicate submission detected</option>
                  <option value="Other">Custom reason (type below)</option>
                </select>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Optional custom rejection feedback sent to user..."
                  className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRejectingRequest(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/30"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
