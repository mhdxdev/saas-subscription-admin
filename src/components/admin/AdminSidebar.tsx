'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileCheck2,
  Layers,
  Receipt,
  ArrowLeft,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const pathname = usePathname();
  const { analytics } = useSubscription();

  const navItems = [
    {
      label: 'Overview & Analytics',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Subscriptions & Users',
      href: '/admin/subscriptions',
      icon: Users,
    },
    {
      label: 'Requests & Approvals',
      href: '/admin/requests',
      icon: FileCheck2,
      badge: analytics.pendingRequestsCount,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      label: 'Plans & Pricing',
      href: '/admin/plans',
      icon: Layers,
    },
    {
      label: 'Transactions & Invoices',
      href: '/admin/transactions',
      icon: Receipt,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-200 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <Link
            href="/admin"
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold shadow-md shadow-brand-500/20 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-white tracking-tight text-base leading-none">
                  SaaSify<span className="text-brand-400">Admin</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1">
                  Subscription Control
                </span>
              </div>
            )}
          </Link>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 mb-2">
            {!collapsed && (
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Management
              </span>
            )}
          </div>

          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
                      item.badgeColor || 'bg-brand-500 text-white'
                    } ${collapsed ? 'absolute top-1 right-1 px-1.5 py-0 text-[10px]' : ''}`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-800/80 px-3">
            {!collapsed && (
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Navigation
              </span>
            )}
          </div>

          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all group"
            title={collapsed ? 'Back to Main App' : undefined}
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0 transition-transform group-hover:-translate-x-1" />
            {!collapsed && <span>Back to Main App</span>}
          </Link>
        </div>

        {/* Admin User Footer Card */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 ${
              collapsed ? 'justify-center p-1.5' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Admin"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-white truncate">Admin Portal</p>
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                </div>
                <p className="text-xs text-slate-400 truncate">Super Admin Role</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
