'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  SubscriptionPlan,
  SubscriptionRequest,
  Transaction,
  ActivityLog,
  SubscriptionContextType,
  RevenueAnalytics,
  SubscriptionStatus,
} from '@/types/subscription';

const STORAGE_KEY = 'saas_subscription_admin_state_v1';

// Initial Plans
export const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Starter',
    description: 'Essential developer tools & free learning tracks for beginners.',
    priceUSD: 0,
    priceUZS: 0,
    billingCycle: 'free',
    durationDays: 0,
    popular: false,
    isActive: true,
    badge: 'Starter',
    features: [
      'Access to 25+ introductory modules',
      'Community discussion forums',
      '5 interactive code challenges per day',
      'Standard web IDE with basic playground',
      'Community-driven support',
    ],
  },
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    description: 'Full power for active builders, career switchers, and solo developers.',
    priceUSD: 19,
    priceUZS: 240000,
    billingCycle: 'monthly',
    durationDays: 30,
    popular: false,
    isActive: true,
    badge: 'Flexible',
    features: [
      'Unlimited access to all 300+ modules',
      'Unlimited cloud execution runtime',
      'AI Senior Dev code review & debugging assistant',
      'Verified Certificate of Completion',
      'Weekly live group Q&A office hours',
      'Priority ticket support (< 2hr SLA)',
    ],
  },
  {
    id: 'pro-annual',
    name: 'Pro Annual',
    description: 'Most popular! Save 35% with full-year commitment and VIP perks.',
    priceUSD: 149,
    priceUZS: 1890000,
    billingCycle: 'annual',
    durationDays: 365,
    popular: true,
    isActive: true,
    badge: 'Best Value',
    features: [
      'Everything in Pro Monthly included',
      'Save 35% compared to monthly billing',
      '2x 1-on-1 Senior Architect portfolio reviews',
      'Downloadable offline course videos & assets',
      'Exclusive GitHub starter repo templates',
      'Private Discord VIP channel access',
    ],
  },
  {
    id: 'lifetime',
    name: 'Founder Lifetime',
    description: 'Pay once, master engineering forever. Never pay a subscription again.',
    priceUSD: 399,
    priceUZS: 5100000,
    billingCycle: 'lifetime',
    durationDays: 36500,
    popular: false,
    isActive: true,
    badge: 'VIP Lifetime',
    features: [
      'Permanent lifetime access to all current & future courses',
      'Direct WhatsApp / Telegram hotline with mentors',
      'Unlimited AI code reviews for life',
      'Access to private Founder mastermind sessions',
      'Lifetime VIP badge on profile & community forum',
      'Early access to beta products & sandbox APIs',
    ],
  },
];

// Initial Users
export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Alisher Navoiy',
    email: 'alisher@navoiy.uz',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    planId: 'free',
    status: 'active',
    startDate: '2026-01-10T10:00:00.000Z',
    endDate: '2099-01-01T00:00:00.000Z',
    autoRenew: false,
    billingCycle: 'free',
    progressPercent: 32,
    lastActive: '10 minutes ago',
    notes: 'Active frontend learner exploring Next.js App Router.',
    role: 'user',
  },
  {
    id: 'usr-2',
    name: 'Malika Karimova',
    email: 'm.karimova@techcorp.uz',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    planId: 'pro-annual',
    status: 'active',
    startDate: '2026-03-15T08:30:00.000Z',
    endDate: '2027-03-15T08:30:00.000Z',
    autoRenew: true,
    billingCycle: 'annual',
    progressPercent: 78,
    lastActive: '2 hours ago',
    notes: 'Software engineer at Fintech startup. High engagement.',
    role: 'user',
  },
  {
    id: 'usr-3',
    name: 'Sardor Rakhimov',
    email: 'sardor.dev@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    planId: 'pro-monthly',
    status: 'expiring_soon',
    startDate: '2026-10-21T14:20:00.000Z',
    endDate: '2026-11-20T14:20:00.000Z',
    autoRenew: false,
    billingCycle: 'monthly',
    progressPercent: 64,
    lastActive: '3 hours ago',
    notes: 'Subscription expires in 3 days. Send renewal reminder.',
    role: 'user',
  },
  {
    id: 'usr-4',
    name: 'Dilnoza Umarova',
    email: 'dilnoza.u@edu.uz',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    planId: 'lifetime',
    status: 'active',
    startDate: '2026-02-01T11:00:00.000Z',
    endDate: '2126-02-01T11:00:00.000Z',
    autoRenew: false,
    billingCycle: 'lifetime',
    progressPercent: 95,
    lastActive: 'Just now',
    notes: 'Early VIP lifetime supporter from Tashkent IT Park.',
    role: 'user',
  },
  {
    id: 'usr-5',
    name: 'Bekzod Tursunov',
    email: 'bekzod@cloudsolutions.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    planId: 'pro-monthly',
    status: 'expired',
    startDate: '2026-09-12T09:00:00.000Z',
    endDate: '2026-10-12T09:00:00.000Z',
    autoRenew: false,
    billingCycle: 'monthly',
    progressPercent: 41,
    lastActive: '5 days ago',
    notes: 'Payment card Humo failed auto-charge last month.',
    role: 'user',
  },
  {
    id: 'usr-6',
    name: 'Shahzoda Mirzayeva',
    email: 'sh.mirzayeva@designstudio.uz',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    planId: 'pro-annual',
    status: 'active',
    startDate: '2026-05-18T16:45:00.000Z',
    endDate: '2027-05-18T16:45:00.000Z',
    autoRenew: true,
    billingCycle: 'annual',
    progressPercent: 82,
    lastActive: 'Yesterday',
    notes: 'UI/UX lead learning full-stack development.',
    role: 'user',
  },
  {
    id: 'usr-7',
    name: 'Bobur Ismoilov',
    email: 'bobur.ismoilov@samarkand.net',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    planId: 'free',
    status: 'active',
    startDate: '2026-04-05T12:00:00.000Z',
    endDate: '2099-01-01T00:00:00.000Z',
    autoRenew: false,
    billingCycle: 'free',
    progressPercent: 19,
    lastActive: '4 hours ago',
    notes: 'Requested Pro upgrade via Uzcard transfer today.',
    role: 'user',
  },
  {
    id: 'usr-8',
    name: 'Madina Kadyrova',
    email: 'madina.kad@banking.uz',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171ef2e2576?w=150&auto=format&fit=crop&q=80',
    planId: 'pro-monthly',
    status: 'expiring_soon',
    startDate: '2026-10-23T10:15:00.000Z',
    endDate: '2026-11-22T10:15:00.000Z',
    autoRenew: true,
    billingCycle: 'monthly',
    progressPercent: 55,
    lastActive: '30 minutes ago',
    notes: 'Expiring in 5 days, auto-renew with Click active.',
    role: 'user',
  },
  {
    id: 'usr-9',
    name: 'Ulugbek Normatov',
    email: 'normatov.u@itcenter.uz',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    planId: 'pro-annual',
    status: 'active',
    startDate: '2026-07-01T15:00:00.000Z',
    endDate: '2027-07-01T15:00:00.000Z',
    autoRenew: true,
    billingCycle: 'annual',
    progressPercent: 88,
    lastActive: '1 day ago',
    notes: 'Backend microservices track completed.',
    role: 'user',
  },
  {
    id: 'usr-10',
    name: 'Nodira Zokirova',
    email: 'nodira.z@startup.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    planId: 'pro-monthly',
    status: 'suspended',
    startDate: '2026-08-10T14:00:00.000Z',
    endDate: '2026-11-10T14:00:00.000Z',
    autoRenew: false,
    billingCycle: 'monthly',
    progressPercent: 12,
    lastActive: '2 weeks ago',
    notes: 'Suspended due to terms of service breach (multiple shared IPs).',
    role: 'user',
  },
  {
    id: 'usr-11',
    name: 'Anvar Toshpulatov',
    email: 'anvar.tosh@telecom.uz',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    planId: 'free',
    status: 'active',
    startDate: '2026-09-01T08:00:00.000Z',
    endDate: '2099-01-01T00:00:00.000Z',
    autoRenew: false,
    billingCycle: 'free',
    progressPercent: 44,
    lastActive: '6 hours ago',
    notes: 'Submitted manual payment via Payme for Pro Monthly.',
    role: 'user',
  },
  {
    id: 'usr-12',
    name: 'Feruza Ergasheva',
    email: 'feruza.e@globalcorp.com',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    planId: 'lifetime',
    status: 'active',
    startDate: '2026-01-20T11:30:00.000Z',
    endDate: '2126-01-20T11:30:00.000Z',
    autoRenew: false,
    billingCycle: 'lifetime',
    progressPercent: 99,
    lastActive: '50 minutes ago',
    notes: 'Lead Mentor and Top Community Contributor.',
    role: 'admin',
  },
  {
    id: 'usr-13',
    name: 'Javohir Kholiqov',
    email: 'javohir.khol@bukhara.uz',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    planId: 'pro-monthly',
    status: 'active',
    startDate: '2026-11-01T09:00:00.000Z',
    endDate: '2026-12-01T09:00:00.000Z',
    autoRenew: true,
    billingCycle: 'monthly',
    progressPercent: 28,
    lastActive: '45 minutes ago',
    notes: 'Upgraded recently via Payme receipt.',
    role: 'user',
  },
  {
    id: 'usr-14',
    name: 'Rayhona Yusupova',
    email: 'rayhona.y@andijan.uz',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    planId: 'pro-annual',
    status: 'active',
    startDate: '2026-06-10T12:00:00.000Z',
    endDate: '2027-06-10T12:00:00.000Z',
    autoRenew: true,
    billingCycle: 'annual',
    progressPercent: 71,
    lastActive: '1 hour ago',
    notes: 'Corporate sponsorship participant.',
    role: 'user',
  },
];

// Initial Pending Approval Requests
export const INITIAL_REQUESTS: SubscriptionRequest[] = [
  {
    id: 'req-101',
    userId: 'usr-7',
    userName: 'Bobur Ismoilov',
    userEmail: 'bobur.ismoilov@samarkand.net',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    planId: 'pro-monthly',
    planName: 'Pro Monthly',
    paymentMethod: 'uzcard',
    amountUSD: 19,
    amountUZS: 240000,
    submittedAt: '2026-11-17T11:45:00.000Z',
    status: 'pending',
    transactionRef: 'UZC-9824104921',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    notes: 'Transfer from Uzcard ****4321. Attached bank transaction receipt snapshot.',
  },
  {
    id: 'req-102',
    userId: 'usr-11',
    userName: 'Anvar Toshpulatov',
    userEmail: 'anvar.tosh@telecom.uz',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    planId: 'pro-annual',
    planName: 'Pro Annual',
    paymentMethod: 'click',
    amountUSD: 149,
    amountUZS: 1890000,
    submittedAt: '2026-11-17T09:15:00.000Z',
    status: 'pending',
    transactionRef: 'CLK-88371920',
    receiptUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
    notes: 'Click Premium checkout receipt. Please activate annual license.',
  },
  {
    id: 'req-103',
    userId: 'usr-1',
    userName: 'Alisher Navoiy',
    userEmail: 'alisher@navoiy.uz',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    planId: 'pro-monthly',
    planName: 'Pro Monthly',
    paymentMethod: 'payme',
    amountUSD: 19,
    amountUZS: 240000,
    submittedAt: '2026-11-16T18:30:00.000Z',
    status: 'pending',
    transactionRef: 'PAY-77192301',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80',
    notes: 'Payme p2p transfer confirmed with receipt slip.',
  },
  {
    id: 'req-104',
    userId: 'usr-5',
    userName: 'Bekzod Tursunov',
    userEmail: 'bekzod@cloudsolutions.io',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    planId: 'pro-annual',
    planName: 'Pro Annual',
    paymentMethod: 'humo',
    amountUSD: 149,
    amountUZS: 1890000,
    submittedAt: '2026-11-16T14:10:00.000Z',
    status: 'pending',
    transactionRef: 'HUM-33918204',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    notes: 'Humo terminal invoice paid. Requesting renewal of expired account.',
  },
  {
    id: 'req-105',
    userId: 'usr-3',
    userName: 'Sardor Rakhimov',
    userEmail: 'sardor.dev@gmail.com',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    planId: 'lifetime',
    planName: 'Founder Lifetime',
    paymentMethod: 'wire',
    amountUSD: 399,
    amountUZS: 5100000,
    submittedAt: '2026-11-15T16:00:00.000Z',
    status: 'pending',
    transactionRef: 'WIRE-9901428',
    receiptUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
    notes: 'Bank SWIFT / IBAN settlement order for Lifetime upgrade.',
  },
];

// Initial Transactions
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-201',
    userId: 'usr-2',
    userName: 'Malika Karimova',
    userEmail: 'm.karimova@techcorp.uz',
    planId: 'pro-annual',
    planName: 'Pro Annual',
    amountUSD: 149,
    amountUZS: 1890000,
    paymentMethod: 'stripe',
    status: 'completed',
    date: '2026-03-15T08:30:00.000Z',
    invoiceNumber: 'INV-2026-001',
  },
  {
    id: 'tx-202',
    userId: 'usr-4',
    userName: 'Dilnoza Umarova',
    userEmail: 'dilnoza.u@edu.uz',
    planId: 'lifetime',
    planName: 'Founder Lifetime',
    amountUSD: 399,
    amountUZS: 5100000,
    paymentMethod: 'payme',
    status: 'completed',
    date: '2026-02-01T11:00:00.000Z',
    invoiceNumber: 'INV-2026-002',
  },
  {
    id: 'tx-203',
    userId: 'usr-6',
    userName: 'Shahzoda Mirzayeva',
    userEmail: 'sh.mirzayeva@designstudio.uz',
    planId: 'pro-annual',
    planName: 'Pro Annual',
    amountUSD: 149,
    amountUZS: 1890000,
    paymentMethod: 'click',
    status: 'completed',
    date: '2026-05-18T16:45:00.000Z',
    invoiceNumber: 'INV-2026-003',
  },
  {
    id: 'tx-204',
    userId: 'usr-8',
    userName: 'Madina Kadyrova',
    userEmail: 'madina.kad@banking.uz',
    planId: 'pro-monthly',
    planName: 'Pro Monthly',
    amountUSD: 19,
    amountUZS: 240000,
    paymentMethod: 'uzcard',
    status: 'completed',
    date: '2026-10-23T10:15:00.000Z',
    invoiceNumber: 'INV-2026-004',
  },
  {
    id: 'tx-205',
    userId: 'usr-9',
    userName: 'Ulugbek Normatov',
    userEmail: 'normatov.u@itcenter.uz',
    planId: 'pro-annual',
    planName: 'Pro Annual',
    amountUSD: 149,
    amountUZS: 1890000,
    paymentMethod: 'stripe',
    status: 'completed',
    date: '2026-07-01T15:00:00.000Z',
    invoiceNumber: 'INV-2026-005',
  },
  {
    id: 'tx-206',
    userId: 'usr-12',
    userName: 'Feruza Ergasheva',
    userEmail: 'feruza.e@globalcorp.com',
    planId: 'lifetime',
    planName: 'Founder Lifetime',
    amountUSD: 399,
    amountUZS: 5100000,
    paymentMethod: 'wire',
    status: 'completed',
    date: '2026-01-20T11:30:00.000Z',
    invoiceNumber: 'INV-2026-006',
  },
  {
    id: 'tx-207',
    userId: 'usr-13',
    userName: 'Javohir Kholiqov',
    userEmail: 'javohir.khol@bukhara.uz',
    planId: 'pro-monthly',
    planName: 'Pro Monthly',
    amountUSD: 19,
    amountUZS: 240000,
    paymentMethod: 'payme',
    status: 'completed',
    date: '2026-11-01T09:00:00.000Z',
    invoiceNumber: 'INV-2026-007',
  },
  {
    id: 'tx-208',
    userId: 'usr-14',
    userName: 'Rayhona Yusupova',
    userEmail: 'rayhona.y@andijan.uz',
    planId: 'pro-annual',
    planName: 'Pro Annual',
    amountUSD: 149,
    amountUZS: 1890000,
    paymentMethod: 'humo',
    status: 'completed',
    date: '2026-06-10T12:00:00.000Z',
    invoiceNumber: 'INV-2026-008',
  },
  {
    id: 'tx-209',
    userId: 'usr-3',
    userName: 'Sardor Rakhimov',
    userEmail: 'sardor.dev@gmail.com',
    planId: 'pro-monthly',
    planName: 'Pro Monthly',
    amountUSD: 19,
    amountUZS: 240000,
    paymentMethod: 'click',
    status: 'completed',
    date: '2026-10-21T14:20:00.000Z',
    invoiceNumber: 'INV-2026-009',
  },
  {
    id: 'tx-210',
    userId: 'usr-5',
    userName: 'Bekzod Tursunov',
    userEmail: 'bekzod@cloudsolutions.io',
    planId: 'pro-monthly',
    planName: 'Pro Monthly',
    amountUSD: 19,
    amountUZS: 240000,
    paymentMethod: 'uzcard',
    status: 'failed',
    date: '2026-10-12T09:00:00.000Z',
    invoiceNumber: 'INV-2026-010',
  },
  {
    id: 'tx-211',
    userId: 'usr-10',
    userName: 'Nodira Zokirova',
    userEmail: 'nodira.z@startup.io',
    planId: 'pro-monthly',
    planName: 'Pro Monthly',
    amountUSD: 19,
    amountUZS: 240000,
    paymentMethod: 'payme',
    status: 'refunded',
    date: '2026-08-10T14:00:00.000Z',
    invoiceNumber: 'INV-2026-011',
  },
  {
    id: 'tx-212',
    userId: 'usr-7',
    userName: 'Bobur Ismoilov',
    userEmail: 'bobur.ismoilov@samarkand.net',
    planId: 'pro-monthly',
    planName: 'Pro Monthly',
    amountUSD: 19,
    amountUZS: 240000,
    paymentMethod: 'uzcard',
    status: 'pending',
    date: '2026-11-17T11:45:00.000Z',
    invoiceNumber: 'INV-2026-012',
  },
  {
    id: 'tx-213',
    userId: 'usr-11',
    userName: 'Anvar Toshpulatov',
    userEmail: 'anvar.tosh@telecom.uz',
    planId: 'pro-annual',
    planName: 'Pro Annual',
    amountUSD: 149,
    amountUZS: 1890000,
    paymentMethod: 'click',
    status: 'pending',
    date: '2026-11-17T09:15:00.000Z',
    invoiceNumber: 'INV-2026-013',
  },
  {
    id: 'tx-214',
    userId: 'usr-1',
    userName: 'Alisher Navoiy',
    userEmail: 'alisher@navoiy.uz',
    planId: 'pro-monthly',
    planName: 'Pro Monthly',
    amountUSD: 19,
    amountUZS: 240000,
    paymentMethod: 'payme',
    status: 'pending',
    date: '2026-11-16T18:30:00.000Z',
    invoiceNumber: 'INV-2026-014',
  },
  {
    id: 'tx-215',
    userId: 'usr-3',
    userName: 'Sardor Rakhimov',
    userEmail: 'sardor.dev@gmail.com',
    planId: 'lifetime',
    planName: 'Founder Lifetime',
    amountUSD: 399,
    amountUZS: 5100000,
    paymentMethod: 'wire',
    status: 'pending',
    date: '2026-11-15T16:00:00.000Z',
    invoiceNumber: 'INV-2026-015',
  },
  {
    id: 'tx-216',
    userId: 'usr-2',
    userName: 'Malika Karimova',
    userEmail: 'm.karimova@techcorp.uz',
    planId: 'pro-monthly',
    planName: 'Pro Monthly',
    amountUSD: 19,
    amountUZS: 240000,
    paymentMethod: 'stripe',
    status: 'completed',
    date: '2026-02-15T08:30:00.000Z',
    invoiceNumber: 'INV-2026-016',
  },
];

// Initial Activities
export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    type: 'upgrade',
    title: 'New Subscription Request',
    description: 'Bobur Ismoilov submitted Uzcard transfer of 240,000 UZS for Pro Monthly.',
    timestamp: '2026-11-17T11:45:00.000Z',
    adminName: 'System',
  },
  {
    id: 'act-2',
    type: 'upgrade',
    title: 'New Annual Subscription Request',
    description: 'Anvar Toshpulatov submitted Click payment of 1,890,000 UZS for Pro Annual.',
    timestamp: '2026-11-17T09:15:00.000Z',
    adminName: 'System',
  },
  {
    id: 'act-3',
    type: 'approval',
    title: 'Subscription Approved & Activated',
    description: 'Javohir Kholiqov was activated on Pro Monthly via Payme.',
    timestamp: '2026-11-01T09:10:00.000Z',
    adminName: 'Admin Team',
  },
  {
    id: 'act-4',
    type: 'extension',
    title: 'Manual Plan Extension',
    description: 'Extended subscription by +30 days for Madina Kadyrova.',
    timestamp: '2026-10-23T10:30:00.000Z',
    adminName: 'Senior Admin',
  },
  {
    id: 'act-5',
    type: 'refund',
    title: 'Subscription Refund Issued',
    description: 'Refunded 240,000 UZS to Nodira Zokirova and suspended account.',
    timestamp: '2026-08-11T12:00:00.000Z',
    adminName: 'Finance Admin',
  },
  {
    id: 'act-6',
    type: 'plan_created',
    title: 'Founder Lifetime Tier Launched',
    description: 'Added Lifetime Plan ($399 / 5,100,000 UZS) to available public offerings.',
    timestamp: '2026-01-15T10:00:00.000Z',
    adminName: 'Super Admin',
  },
];

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [plans, setPlans] = useState<SubscriptionPlan[]>(INITIAL_PLANS);
  const [requests, setRequests] = useState<SubscriptionRequest[]>(INITIAL_REQUESTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITIES);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Alisher Navoiy (Free User)
  const [currency, setCurrency] = useState<'USD' | 'UZS'>('USD');
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.plans) setPlans(parsed.plans);
        if (parsed.requests) setRequests(parsed.requests);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.activities) setActivities(parsed.activities);
        if (parsed.currentUser) setCurrentUser(parsed.currentUser);
        if (parsed.currency) setCurrency(parsed.currency);
      }
    } catch (e) {
      console.error('Failed to load subscription state from localStorage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const state = {
        users,
        plans,
        requests,
        transactions,
        activities,
        currentUser,
        currency,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save subscription state to localStorage', e);
    }
  }, [users, plans, requests, transactions, activities, currentUser, currency, isHydrated]);

  // Keep currentUser in sync if updated in users list
  useEffect(() => {
    const updated = users.find((u) => u.id === currentUser.id);
    if (updated && JSON.stringify(updated) !== JSON.stringify(currentUser)) {
      setCurrentUser(updated);
    }
  }, [users, currentUser]);

  // Dynamic Revenue Analytics
  const analytics: RevenueAnalytics = useMemo(() => {
    const now = new Date();

    // Calculate MRR
    let mrrUSD = 0;
    let mrrUZS = 0;
    let activeSubscribers = 0;
    let freeUsers = 0;

    users.forEach((user) => {
      if (user.status === 'active' || user.status === 'expiring_soon') {
        const plan = plans.find((p) => p.id === user.planId);
        if (plan) {
          if (plan.billingCycle === 'monthly') {
            mrrUSD += plan.priceUSD;
            mrrUZS += plan.priceUZS;
            activeSubscribers++;
          } else if (plan.billingCycle === 'annual') {
            mrrUSD += plan.priceUSD / 12;
            mrrUZS += plan.priceUZS / 12;
            activeSubscribers++;
          } else if (plan.billingCycle === 'lifetime') {
            // Amortize lifetime over 24 months for MRR model
            mrrUSD += plan.priceUSD / 24;
            mrrUZS += plan.priceUZS / 24;
            activeSubscribers++;
          } else {
            freeUsers++;
          }
        }
      } else {
        freeUsers++;
      }
    });

    const pendingRequestsCount = requests.filter((r) => r.status === 'pending').length;

    // Subscriptions expiring within next 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const expiringSoonCount = users.filter((u) => {
      if (u.planId === 'free' || u.status === 'expired' || u.status === 'suspended') return false;
      const end = new Date(u.endDate);
      return end > now && end <= sevenDaysFromNow;
    }).length;

    // Monthly revenue simulation (Last 6 months)
    const monthlyRevenueData = [
      { month: 'Jun', usd: 840, uzs: 10700000, subscribers: 5 },
      { month: 'Jul', usd: 1060, uzs: 13500000, subscribers: 7 },
      { month: 'Aug', usd: 1220, uzs: 15600000, subscribers: 8 },
      { month: 'Sep', usd: 1390, uzs: 17800000, subscribers: 10 },
      { month: 'Oct', usd: 1580, uzs: 20200000, subscribers: 12 },
      { month: 'Nov', usd: Math.round(mrrUSD), uzs: Math.round(mrrUZS), subscribers: activeSubscribers },
    ];

    // Plan distribution
    const colors = {
      'free': '#64748b',
      'pro-monthly': '#3b82f6',
      'pro-annual': '#8b5cf6',
      'lifetime': '#f59e0b',
    };

    const planDistribution = plans.map((plan) => {
      const count = users.filter((u) => u.planId === plan.id && (u.status === 'active' || u.status === 'expiring_soon')).length;
      const percentage = users.length > 0 ? Math.round((count / users.length) * 100) : 0;
      return {
        planId: plan.id,
        name: plan.name,
        count,
        percentage,
        color: (colors as Record<string, string>)[plan.id] || '#10b981',
      };
    });

    return {
      mrrUSD: Math.round(mrrUSD),
      mrrUZS: Math.round(mrrUZS),
      activeSubscribers,
      freeUsers,
      pendingRequestsCount,
      expiringSoonCount,
      monthlyRevenueData,
      planDistribution,
    };
  }, [users, plans, requests]);

  // Helper getters
  const getPlanById = (planId: string) => plans.find((p) => p.id === planId);
  const getUserById = (userId: string) => users.find((u) => u.id === userId);

  // Approve a subscription request
  const approveRequest = (requestId: string, adminNotes?: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    const plan = plans.find((p) => p.id === req.planId) || plans[1];
    const durationDays = plan.durationDays || 30;

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + durationDays);

    // Update request
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'approved', notes: adminNotes ? `${r.notes || ''} [Admin: ${adminNotes}]` : r.notes }
          : r
      )
    );

    // Update or activate user
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === req.userId || u.email === req.userEmail) {
          return {
            ...u,
            planId: plan.id,
            status: 'active',
            startDate: now.toISOString(),
            endDate: endDate.toISOString(),
            billingCycle: plan.billingCycle,
            autoRenew: true,
          };
        }
        return u;
      })
    );

    // Create completed Transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: req.userId,
      userName: req.userName,
      userEmail: req.userEmail,
      planId: plan.id,
      planName: plan.name,
      amountUSD: req.amountUSD,
      amountUZS: req.amountUZS,
      paymentMethod: req.paymentMethod,
      status: 'completed',
      date: now.toISOString(),
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      receiptUrl: req.receiptUrl,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Add Activity Log
    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      type: 'approval',
      title: 'Subscription Request Approved',
      description: `Approved ${plan.name} for ${req.userName} via ${req.paymentMethod.toUpperCase()} (${req.amountUSD} USD / ${req.amountUZS.toLocaleString()} UZS).`,
      timestamp: now.toISOString(),
      adminName: 'Super Admin',
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Reject a subscription request
  const rejectRequest = (requestId: string, reason: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'rejected', rejectionReason: reason } : r
      )
    );

    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      type: 'rejection',
      title: 'Subscription Request Rejected',
      description: `Rejected ${req.planName} request for ${req.userName}. Reason: ${reason}`,
      timestamp: new Date().toISOString(),
      adminName: 'Super Admin',
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Regular user submits upgrade request from frontend modal
  const submitSubscriptionRequest = (
    data: Omit<SubscriptionRequest, 'id' | 'submittedAt' | 'status'>
  ) => {
    const newReq: SubscriptionRequest = {
      ...data,
      id: `req-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    setRequests((prev) => [newReq, ...prev]);

    // Also add pending transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      planId: data.planId,
      planName: data.planName,
      amountUSD: data.amountUSD,
      amountUZS: data.amountUZS,
      paymentMethod: data.paymentMethod,
      status: 'pending',
      date: new Date().toISOString(),
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      receiptUrl: data.receiptUrl,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Add Activity Log
    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      type: 'upgrade',
      title: 'New Subscription Application',
      description: `${data.userName} submitted application for ${data.planName} via ${data.paymentMethod.toUpperCase()}.`,
      timestamp: new Date().toISOString(),
      adminName: 'User Submission',
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Extend subscription by days
  const extendSubscription = (userId: string, days: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    let baseDate = new Date();
    const currentEnd = new Date(user.endDate);
    if (currentEnd > baseDate) {
      baseDate = currentEnd;
    }
    baseDate.setDate(baseDate.getDate() + days);

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            endDate: baseDate.toISOString(),
            status: 'active',
          };
        }
        return u;
      })
    );

    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      type: 'extension',
      title: 'Subscription Extended',
      description: `Added +${days} days to subscription for ${user.name}. New end date: ${baseDate.toLocaleDateString()}.`,
      timestamp: new Date().toISOString(),
      adminName: 'Admin Team',
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Change user plan
  const changeUserPlan = (userId: string, newPlanId: string, customDurationDays?: number) => {
    const user = users.find((u) => u.id === userId);
    const plan = plans.find((p) => p.id === newPlanId);
    if (!user || !plan) return;

    const days = customDurationDays ?? (plan.durationDays || 30);
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + days);

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            planId: plan.id,
            status: plan.id === 'free' ? 'active' : 'active',
            startDate: now.toISOString(),
            endDate: plan.id === 'free' ? '2099-01-01T00:00:00.000Z' : endDate.toISOString(),
            billingCycle: plan.billingCycle,
          };
        }
        return u;
      })
    );

    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      type: 'upgrade',
      title: 'Plan Tier Changed',
      description: `Assigned plan "${plan.name}" to ${user.name}.`,
      timestamp: now.toISOString(),
      adminName: 'Super Admin',
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Toggle user status
  const toggleUserStatus = (userId: string, newStatus: SubscriptionStatus) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );

    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      type: 'cancellation',
      title: 'User Subscription Status Updated',
      description: `Changed status of ${user.name} to "${newStatus}".`,
      timestamp: new Date().toISOString(),
      adminName: 'Admin Team',
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Toggle auto renew
  const toggleAutoRenew = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, autoRenew: !u.autoRenew } : u))
    );
  };

  // Direct grant pro access
  const grantProAccess = (userId: string, planId: string, durationDays: number) => {
    const user = users.find((u) => u.id === userId);
    const plan = plans.find((p) => p.id === planId) || plans[1];
    if (!user) return;

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + durationDays);

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            planId: plan.id,
            status: 'active',
            startDate: now.toISOString(),
            endDate: endDate.toISOString(),
            billingCycle: plan.billingCycle,
            autoRenew: true,
          };
        }
        return u;
      })
    );

    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      type: 'upgrade',
      title: 'Pro Access Granted Direct',
      description: `Admin directly granted ${plan.name} (${durationDays} days) to ${user.name}.`,
      timestamp: now.toISOString(),
      adminName: 'Super Admin',
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Update Plan
  const updatePlan = (planId: string, updatedPlan: Partial<SubscriptionPlan>) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, ...updatedPlan } : p))
    );

    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      type: 'plan_created',
      title: 'Plan Updated',
      description: `Updated plan configuration for ID "${planId}".`,
      timestamp: new Date().toISOString(),
      adminName: 'Super Admin',
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Create Plan
  const createPlan = (newPlan: Omit<SubscriptionPlan, 'id'>) => {
    const id = newPlan.name.toLowerCase().replace(/\s+/g, '-');
    const fullPlan: SubscriptionPlan = {
      ...newPlan,
      id,
    };
    setPlans((prev) => [...prev, fullPlan]);

    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      type: 'plan_created',
      title: 'New Subscription Plan Created',
      description: `Created new subscription tier "${newPlan.name}".`,
      timestamp: new Date().toISOString(),
      adminName: 'Super Admin',
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Toggle Plan Active
  const togglePlanActive = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, isActive: !p.isActive } : p))
    );
  };

  // Issue Refund
  const issueRefund = (transactionId: string, revokeAccess: boolean = false) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: 'refunded' } : t))
    );

    if (revokeAccess) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === tx.userId) {
            return {
              ...u,
              planId: 'free',
              status: 'active',
              billingCycle: 'free',
              endDate: '2099-01-01T00:00:00.000Z',
            };
          }
          return u;
        })
      );
    }

    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      type: 'refund',
      title: 'Refund Processed',
      description: `Issued refund for ${tx.invoiceNumber} (${tx.userName}) - ${tx.amountUSD} USD. Access revoked: ${revokeAccess ? 'Yes' : 'No'}.`,
      timestamp: new Date().toISOString(),
      adminName: 'Finance Admin',
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Export Transactions to CSV
  const exportTransactionsCSV = () => {
    const headers = [
      'Invoice Number',
      'Customer Name',
      'Customer Email',
      'Plan',
      'Amount USD',
      'Amount UZS',
      'Payment Method',
      'Status',
      'Date',
    ];

    const rows = transactions.map((t) => [
      t.invoiceNumber,
      `"${t.userName.replace(/"/g, '""')}"`,
      t.userEmail,
      `"${t.planName}"`,
      t.amountUSD,
      t.amountUZS,
      t.paymentMethod.toUpperCase(),
      t.status.toUpperCase(),
      new Date(t.date).toLocaleDateString(),
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `saas_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset to defaults
  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUsers(INITIAL_USERS);
    setPlans(INITIAL_PLANS);
    setRequests(INITIAL_REQUESTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setActivities(INITIAL_ACTIVITIES);
    setCurrentUser(INITIAL_USERS[0]);
    setCurrency('USD');
  };

  return (
    <SubscriptionContext.Provider
      value={{
        users,
        plans,
        requests,
        transactions,
        activities,
        currentUser,
        currency,
        analytics,
        setCurrency,
        setCurrentUser,
        approveRequest,
        rejectRequest,
        submitSubscriptionRequest,
        extendSubscription,
        changeUserPlan,
        toggleUserStatus,
        toggleAutoRenew,
        grantProAccess,
        updatePlan,
        createPlan,
        togglePlanActive,
        issueRefund,
        exportTransactionsCSV,
        getPlanById,
        getUserById,
        resetToDefaults,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
