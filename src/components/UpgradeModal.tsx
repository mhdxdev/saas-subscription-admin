'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Sparkles,
  Check,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Upload,
  CheckCircle2,
  ExternalLink,
  Lock,
  Copy,
} from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';
import { PaymentMethod } from '@/types/subscription';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const {
    plans,
    currentUser,
    currency,
    submitSubscriptionRequest,
  } = useSubscription();

  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('pro-annual');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('payme');
  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80');
  const [userNotes, setUserNotes] = useState('');
  const [copiedCard, setCopiedCard] = useState(false);

  if (!isOpen) return null;

  const currentPlan = plans.find((p) => p.id === currentUser.planId) || plans[0];
  const targetPlan = plans.find((p) => p.id === selectedPlanId) || plans[2];

  const handleCopyCard = () => {
    navigator.clipboard?.writeText('8600 3124 9918 4512');
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    submitSubscriptionRequest({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userAvatar: currentUser.avatar,
      planId: targetPlan.id,
      planName: targetPlan.name,
      paymentMethod: selectedPaymentMethod,
      amountUSD: targetPlan.priceUSD,
      amountUZS: targetPlan.priceUZS,
      receiptUrl: receiptUrl || undefined,
      transactionRef: transactionRef || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: userNotes || undefined,
    });
    setStep('success');
  };

  const handleCloseAll = () => {
    setStep('select');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Unlock SaaSify Pro Access
              </h3>
              <p className="text-xs text-slate-400">
                Current Tier: <span className="text-brand-400 font-bold">{currentPlan.name}</span> ({currentUser.status.toUpperCase()})
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseAll}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'select' && (
            <div className="space-y-6">
              {/* Billing Toggle (Monthly / Annual) */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="inline-flex items-center p-1 bg-slate-800/90 rounded-2xl border border-slate-700/80">
                  <button
                    onClick={() => {
                      setBillingInterval('monthly');
                      setSelectedPlanId('pro-monthly');
                    }}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      billingInterval === 'monthly'
                        ? 'bg-brand-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    onClick={() => {
                      setBillingInterval('annual');
                      setSelectedPlanId('pro-annual');
                    }}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      billingInterval === 'annual'
                        ? 'bg-brand-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-black bg-emerald-500 text-slate-950 rounded-full">
                      SAVE 35%
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans
                  .filter((p) => p.id !== 'free')
                  .map((plan) => {
                    const isSelected = selectedPlanId === plan.id;

                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                          isSelected
                            ? 'bg-gradient-to-b from-brand-950/40 to-slate-900 border-brand-500 ring-2 ring-brand-500/50 shadow-xl shadow-brand-500/10'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-brand-500 text-white rounded-full shadow">
                            Most Popular
                          </span>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-extrabold text-white text-base">
                              {plan.name}
                            </h4>
                            {plan.badge && (
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                                {plan.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 min-h-[32px]">
                            {plan.description}
                          </p>

                          <div className="my-4 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-white">
                                {currency === 'UZS'
                                  ? `${(plan.priceUZS / 1000).toFixed(0)}k UZS`
                                  : `$${plan.priceUSD}`}
                              </span>
                              <span className="text-xs text-slate-400">
                                /{plan.billingCycle}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {currency === 'UZS'
                                ? `$${plan.priceUSD} USD equivalent`
                                : `${plan.priceUZS.toLocaleString()} UZS`}
                            </div>
                          </div>

                          <div className="space-y-2 text-xs">
                            {plan.features.map((feat, i) => (
                              <div key={i} className="flex items-start gap-2 text-slate-300">
                                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800">
                          <button
                            type="button"
                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {isSelected ? 'Selected Tier' : 'Choose Tier'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Next Step Action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  Selected:{' '}
                  <span className="text-white font-bold">{targetPlan.name}</span> —{' '}
                  <span className="text-emerald-400 font-bold">
                    ${targetPlan.priceUSD} USD / {targetPlan.priceUZS.toLocaleString()} UZS
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02]"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <form onSubmit={handleSubmitPayment} className="space-y-5 max-w-2xl mx-auto">
              {/* Target Plan Summary */}
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Upgrading to:</span>
                  <h4 className="text-base font-extrabold text-white">{targetPlan.name}</h4>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-emerald-400">
                    {targetPlan.priceUZS.toLocaleString()} UZS
                  </div>
                  <div className="text-xs text-slate-400">${targetPlan.priceUSD} USD</div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Payment Gateway / Transfer Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'payme', label: 'Payme', desc: 'Instant P2P / Invoice', color: 'border-emerald-500/40 text-emerald-400' },
                    { id: 'click', label: 'Click Up', desc: 'Click Pass & Card', color: 'border-sky-500/40 text-sky-400' },
                    { id: 'uzcard', label: 'Uzcard Transfer', desc: 'Direct 8600 Card Transfer', color: 'border-blue-500/40 text-blue-400' },
                    { id: 'humo', label: 'Humo Card', desc: 'Terminal / Humo Pay', color: 'border-orange-500/40 text-orange-400' },
                    { id: 'stripe', label: 'Visa / MasterCard', desc: 'International Stripe', color: 'border-indigo-500/40 text-indigo-400' },
                    { id: 'wire', label: 'Bank Wire / SWIFT', desc: 'Invoice Settlement', color: 'border-amber-500/40 text-amber-400' },
                  ].map((m) => {
                    const isSelected = selectedPaymentMethod === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedPaymentMethod(m.id as PaymentMethod)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-slate-800 border-brand-500 ring-2 ring-brand-500/50'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className={`text-xs font-extrabold ${m.color}`}>
                          {m.label}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{m.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Local Card Transfer Instructions */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-brand-400" />
                    Official Settlement Account Details
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    Official Merchant
                  </span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">
                      Uzcard / Humo Merchant Card
                    </span>
                    <span className="font-extrabold text-white text-sm">
                      8600 3124 9918 4512
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Recipient: SaaSify Technologies LLC
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCard}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCard ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Transfer the exact sum of{' '}
                  <strong className="text-white">
                    {targetPlan.priceUZS.toLocaleString()} UZS
                  </strong>{' '}
                  via your mobile app (Payme, Click, or Bank App) and attach your reference number below.
                </p>
              </div>

              {/* Verification Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Transaction ID / Reference Ref
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TRX-99218204 or Check #"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Receipt Slip Snapshot URL
                  </label>
                  <input
                    type="text"
                    value={receiptUrl}
                    onChange={(e) => setReceiptUrl(e.target.value)}
                    placeholder="https://... receipt image"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Optional Note for Approving Admin
                </label>
                <input
                  type="text"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g. Paid from card ending in 4512"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              {/* Submission Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Back to Plans
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                >
                  <Upload className="w-4 h-4" />
                  <span>Submit Payment for Approval</span>
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="py-8 px-4 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-extrabold text-white">
                Application Submitted!
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your payment verification for <strong className="text-white">{targetPlan.name}</strong> has been placed into the admin verification queue.
              </p>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Account:</span>
                  <span className="font-bold text-white">{currentUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="font-bold text-emerald-400">
                    ${targetPlan.priceUSD} USD / {targetPlan.priceUZS.toLocaleString()} UZS
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-amber-400">Pending Review</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  href="/admin/requests"
                  onClick={handleCloseAll}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/30"
                >
                  <span>Go to Admin Requests to Approve Now</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={handleCloseAll}
                  className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
