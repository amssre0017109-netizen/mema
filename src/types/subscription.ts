export type SubscriptionStatus = 'FREE' | 'TRIAL' | 'PREMIUM' | 'EXPIRED' | 'CANCELLED';

export type PlanId = 'monthly_89' | 'quarterly_199';

export type PaymentMethodType = 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET';

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  priceInr: number;
  monthlyEquivalentInr: number;
  intervalMonths: number;
  hasFreeTrial: boolean;
  trialDurationDays: number;
  renewalPriceInr: number;
  badge?: string;
  tagline: string;
  features: string[];
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: PlanId | null;
  status: SubscriptionStatus;
  startDate: string;
  trialStartDate?: string;
  trialEndDate?: string;
  renewalDate?: string;
  cancelledAt?: string;
  autoRenew: boolean;
  gatewaySubscriptionId?: string;
  amountPaidInr: number;
  paymentMethod?: PaymentMethodType;
}

export interface PaymentTransaction {
  id: string;
  subscriptionId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  planName: string;
  amountInr: number;
  currency: string;
  paymentMethod: PaymentMethodType;
  paymentMethodDetails?: string; // e.g. "UPI ID: samar@okhdfcbank" or "Visa ending in •••• 4242"
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  gatewayTxnId: string;
  createdAt: string;
  invoiceUrl?: string;
}

export interface IncomingRequest {
  id: string;
  sender: {
    id: string;
    name: string;
    age: number;
    avatar: string;
    verified: boolean;
    distanceDisplay: string;
    moodName: string;
    moodIcon: string;
    intention: string;
    sentAt: string;
  };
  note?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

export interface AdminAnalyticsMetrics {
  totalPremiumUsers: number;
  activeSubscriptions: number;
  freeTrialUsers: number;
  monthlySubscribers: number;
  quarterlySubscribers: number;
  totalRevenueInr: number;
  monthlyRecurringRevenueInr: number;
  failedPaymentsCount: number;
  cancelledSubscriptionsCount: number;
  trialConversionRatePercent: number;
  renewalRatePercent: number;
}
