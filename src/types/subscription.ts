export type PlanTier = 'free' | 'monthly' | 'annual' | 'lifetime' | string;

export type SubscriptionStatus = 'active' | 'expiring_soon' | 'expired' | 'suspended';

export type PaymentMethod = 'click' | 'payme' | 'uzcard' | 'humo' | 'stripe' | 'wire';

export type TransactionStatus = 'completed' | 'pending' | 'refunded' | 'failed';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  billingCycle: 'monthly' | 'annual' | 'lifetime' | 'free';
  progressPercent: number;
  lastActive: string;
  notes?: string;
  role?: 'user' | 'admin';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceUSD: number;
  priceUZS: number;
  billingCycle: 'monthly' | 'annual' | 'lifetime' | 'free';
  durationDays: number;
  features: string[];
  popular?: boolean;
  isActive: boolean;
  badge?: string;
}

export interface SubscriptionRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  planId: string;
  planName: string;
  paymentMethod: PaymentMethod;
  amountUSD: number;
  amountUZS: number;
  submittedAt: string;
  status: RequestStatus;
  receiptUrl?: string;
  transactionRef?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  amountUSD: number;
  amountUZS: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  date: string;
  receiptUrl?: string;
  invoiceNumber: string;
}

export interface ActivityLog {
  id: string;
  type: 'upgrade' | 'approval' | 'rejection' | 'cancellation' | 'extension' | 'refund' | 'plan_created';
  title: string;
  description: string;
  timestamp: string;
  adminName: string;
}

export interface RevenueAnalytics {
  mrrUSD: number;
  mrrUZS: number;
  activeSubscribers: number;
  freeUsers: number;
  pendingRequestsCount: number;
  expiringSoonCount: number;
  monthlyRevenueData: {
    month: string;
    usd: number;
    uzs: number;
    subscribers: number;
  }[];
  planDistribution: {
    planId: string;
    name: string;
    count: number;
    percentage: number;
    color: string;
  }[];
}

export interface SubscriptionContextType {
  // State
  users: User[];
  plans: SubscriptionPlan[];
  requests: SubscriptionRequest[];
  transactions: Transaction[];
  activities: ActivityLog[];
  currentUser: User;
  currency: 'USD' | 'UZS';
  
  // Analytics
  analytics: RevenueAnalytics;

  // Actions
  setCurrency: (currency: 'USD' | 'UZS') => void;
  setCurrentUser: (user: User) => void;
  
  // Requests Management
  approveRequest: (requestId: string, adminNotes?: string) => void;
  rejectRequest: (requestId: string, reason: string) => void;
  submitSubscriptionRequest: (
    data: Omit<SubscriptionRequest, 'id' | 'submittedAt' | 'status'>
  ) => void;

  // Subscriptions & Users
  extendSubscription: (userId: string, days: number) => void;
  changeUserPlan: (userId: string, newPlanId: string, customDurationDays?: number) => void;
  toggleUserStatus: (userId: string, newStatus: SubscriptionStatus) => void;
  toggleAutoRenew: (userId: string) => void;
  grantProAccess: (userId: string, planId: string, durationDays: number) => void;

  // Plans Management
  updatePlan: (planId: string, updatedPlan: Partial<SubscriptionPlan>) => void;
  createPlan: (newPlan: Omit<SubscriptionPlan, 'id'>) => void;
  togglePlanActive: (planId: string) => void;

  // Transactions & Billing
  issueRefund: (transactionId: string, revokeAccess?: boolean) => void;
  exportTransactionsCSV: () => void;
  
  // Helpers
  getPlanById: (planId: string) => SubscriptionPlan | undefined;
  getUserById: (userId: string) => User | undefined;
  resetToDefaults: () => void;
}
