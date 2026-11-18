'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Check,
  Edit2,
  Trash2,
  Sparkles,
  Eye,
  EyeOff,
  DollarSign,
  Calendar,
  X,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';
import { SubscriptionPlan } from '@/types/subscription';

export default function PlansPricingManagerPage() {
  const {
    plans,
    users,
    currency,
    updatePlan,
    createPlan,
    togglePlanActive,
  } = useSubscription();

  // Modals state
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New plan state
  const [newPlanForm, setNewPlanForm] = useState<{
    name: string;
    description: string;
    priceUSD: number;
    priceUZS: number;
    billingCycle: 'monthly' | 'annual' | 'lifetime' | 'free';
    durationDays: number;
    features: string[];
    popular: boolean;
    badge: string;
    isActive: boolean;
  }>({
    name: '',
    description: '',
    priceUSD: 49,
    priceUZS: 620000,
    billingCycle: 'monthly',
    durationDays: 30,
    features: ['Unlimited platform access', 'Dedicated API keys', 'Priority 24/7 support'],
    popular: false,
    badge: 'Pro Tier',
    isActive: true,
  });

  const [newFeatureText, setNewFeatureText] = useState('');
  const [editFeatureText, setEditFeatureText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanForm.name.trim()) return;

    createPlan({
      ...newPlanForm,
    });
    setIsCreateModalOpen(false);
    showToast(`Plan "${newPlanForm.name}" created successfully!`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    updatePlan(editingPlan.id, editingPlan);
    setEditingPlan(null);
    showToast(`Plan "${editingPlan.name}" updated successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
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
            Plans & Pricing Architecture
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {plans.length} Tiers
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Customize billing rates, feature bundles, visibility toggles, and create custom enterprise tiers
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/25 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const subscriberCount = users.filter(
            (u) => u.planId === plan.id && (u.status === 'active' || u.status === 'expiring_soon')
          ).length;

          return (
            <div
              key={plan.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'bg-gradient-to-b from-brand-950/30 to-slate-900 border-brand-500 shadow-xl shadow-brand-500/10 ring-1 ring-brand-500/40'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              } ${!plan.isActive ? 'opacity-60' : ''}`}
            >
              {/* Top Badges */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  {plan.badge && (
                    <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30">
                      {plan.badge}
                    </span>
                  )}
                  {plan.popular && (
                    <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" /> Most Popular
                    </span>
                  )}
                </div>

                {/* Active / Hidden visibility toggle */}
                <button
                  onClick={() => togglePlanActive(plan.id)}
                  title={plan.isActive ? 'Plan is publicly active (Click to hide)' : 'Plan is hidden (Click to publish)'}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  {plan.isActive ? (
                    <Eye className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-slate-500" />
                  )}
                </button>
              </div>

              {/* Plan Title & Pricing */}
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[36px]">{plan.description}</p>

                <div className="my-5 p-3.5 bg-slate-800/40 border border-slate-800 rounded-xl">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">
                      {currency === 'UZS'
                        ? `${(plan.priceUZS / 1000).toFixed(0)}k UZS`
                        : `$${plan.priceUSD}`}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      /{plan.billingCycle === 'free' ? 'forever' : plan.billingCycle}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {currency === 'UZS'
                      ? `$${plan.priceUSD} USD`
                      : `${plan.priceUZS.toLocaleString()} UZS`}
                  </div>
                </div>

                {/* Subscribers count chip */}
                <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-slate-300 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/60">
                  <Users className="w-3.5 h-3.5 text-brand-400" />
                  <span>{subscriberCount} Active Subscribers</span>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-2 mb-6">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    What&apos;s Included:
                  </span>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Plan Button */}
              <button
                onClick={() => setEditingPlan(plan)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Edit Plan & Features</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* EDIT PLAN MODAL */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Plan Configuration</h3>
              <button
                onClick={() => setEditingPlan(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Price (USD $)
                  </label>
                  <input
                    type="number"
                    value={editingPlan.priceUSD}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, priceUSD: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Price (UZS)
                  </label>
                  <input
                    type="number"
                    value={editingPlan.priceUZS}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, priceUZS: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={editingPlan.durationDays}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, durationDays: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={editingPlan.badge || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingPlan.popular || false}
                    onChange={(e) => setEditingPlan({ ...editingPlan, popular: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-800 text-brand-600 focus:ring-0"
                  />
                  <span>Mark as &quot;Most Popular&quot;</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingPlan.isActive}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-800 text-brand-600 focus:ring-0"
                  />
                  <span>Publicly Active</span>
                </label>
              </div>

              {/* Feature Management */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Features List
                </label>
                <div className="space-y-1.5 mb-2">
                  {editingPlan.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-xs"
                    >
                      <span className="truncate">{feat}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingPlan({
                            ...editingPlan,
                            features: editingPlan.features.filter((_, i) => i !== idx),
                          })
                        }
                        className="p-1 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editFeatureText}
                    onChange={(e) => setEditFeatureText(e.target.value)}
                    placeholder="Add new feature bullet..."
                    className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (editFeatureText.trim()) {
                        setEditingPlan({
                          ...editingPlan,
                          features: [...editingPlan.features, editFeatureText.trim()],
                        });
                        setEditFeatureText('');
                      }
                    }}
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW PLAN MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create New Subscription Plan</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Team"
                  value={newPlanForm.name}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary for this plan tier..."
                  value={newPlanForm.description}
                  onChange={(e) =>
                    setNewPlanForm({ ...newPlanForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Price (USD $)
                  </label>
                  <input
                    type="number"
                    value={newPlanForm.priceUSD}
                    onChange={(e) =>
                      setNewPlanForm({
                        ...newPlanForm,
                        priceUSD: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Price (UZS)
                  </label>
                  <input
                    type="number"
                    value={newPlanForm.priceUZS}
                    onChange={(e) =>
                      setNewPlanForm({
                        ...newPlanForm,
                        priceUZS: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Billing Cycle
                  </label>
                  <select
                    value={newPlanForm.billingCycle}
                    onChange={(e) =>
                      setNewPlanForm({
                        ...newPlanForm,
                        billingCycle: e.target.value as typeof newPlanForm.billingCycle,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                    <option value="lifetime">Lifetime</option>
                    <option value="free">Free</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={newPlanForm.durationDays}
                    onChange={(e) =>
                      setNewPlanForm({
                        ...newPlanForm,
                        durationDays: parseInt(e.target.value, 10) || 30,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Badge Text (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Teams, Premium, Special"
                  value={newPlanForm.badge}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, badge: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              {/* Features List */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Features List
                </label>
                <div className="space-y-1.5 mb-2">
                  {newPlanForm.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-xs"
                    >
                      <span className="truncate">{feat}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setNewPlanForm({
                            ...newPlanForm,
                            features: newPlanForm.features.filter((_, i) => i !== idx),
                          })
                        }
                        className="p-1 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    placeholder="Type a new feature..."
                    className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newFeatureText.trim()) {
                        setNewPlanForm({
                          ...newPlanForm,
                          features: [...newPlanForm.features, newFeatureText.trim()],
                        });
                        setNewFeatureText('');
                      }
                    }}
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/30"
                >
                  Create Plan Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
