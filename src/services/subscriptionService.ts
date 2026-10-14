import {
  SubscriptionPlan,
  UserSubscription,
  PaymentTransaction,
  IncomingRequest,
  AdminAnalyticsMetrics,
  PlanId,
  PaymentMethodType
} from '../types/subscription';

export interface FeatureComparisonItem {
  id: string;
  name: string;
  englishLabel: string;
  category: 'activities' | 'connections' | 'profile' | 'filters';
  categoryLabel: string;
  freeValue: string;
  premiumValue: string;
  icon: string;
}

export const PREMIUM_FEATURE_COMPARISON: FeatureComparisonItem[] = [
  {
    id: 'nearby_activities',
    name: 'View Nearby Activities',
    englishLabel: 'Discover local campus & nearby events',
    category: 'activities',
    categoryLabel: 'Activities & Discovery',
    freeValue: '1 / day',
    premiumValue: 'Unlimited',
    icon: '📍'
  },
  {
    id: 'create_post',
    name: 'Create Activities & Posts',
    englishLabel: 'Post sports, study, music & team requests',
    category: 'activities',
    categoryLabel: 'Activities & Discovery',
    freeValue: '1 active post',
    premiumValue: 'Unlimited',
    icon: '📝'
  },
  {
    id: 'join_activity',
    name: 'Join Activities & Events',
    englishLabel: 'Participate in peer requests & sessions',
    category: 'activities',
    categoryLabel: 'Activities & Discovery',
    freeValue: '✅ Included',
    premiumValue: '✅ Included',
    icon: '🤝'
  },
  {
    id: 'chat',
    name: 'Direct & Group Chat',
    englishLabel: 'Message teammates & activity partners',
    category: 'connections',
    categoryLabel: 'Direct Contact & Chat',
    freeValue: '❌ Locked',
    premiumValue: '✅ Unlimited',
    icon: '💬'
  },
  {
    id: 'direct_contact',
    name: 'Direct Contact Members',
    englishLabel: 'Reach out to activity hosts directly',
    category: 'connections',
    categoryLabel: 'Direct Contact & Chat',
    freeValue: '❌ Locked',
    premiumValue: '✅ Instant Access',
    icon: '⚡'
  },
  {
    id: 'activity_reservation',
    name: 'Activity Booking & Reservation',
    englishLabel: 'Reserve guaranteed spots in sessions',
    category: 'activities',
    categoryLabel: 'Activities & Discovery',
    freeValue: '❌ Locked',
    premiumValue: '✅ Instant Reserve',
    icon: '🎟️'
  },
  {
    id: 'profile_customization',
    name: 'Profile Customization',
    englishLabel: 'Full studio & visual moodboard customization',
    category: 'profile',
    categoryLabel: 'Profile & Branding',
    freeValue: 'Basic',
    premiumValue: 'Advanced Studio',
    icon: '🎨'
  },
  {
    id: 'profile_visibility',
    name: 'Profile Visibility',
    englishLabel: 'Discovery & radar presence across campus',
    category: 'profile',
    categoryLabel: 'Profile & Branding',
    freeValue: 'Basic',
    premiumValue: '🔥 10x Boosted',
    icon: '🔥'
  },
  {
    id: 'add_skills',
    name: 'Add Skills & Badges',
    englishLabel: 'Showcase skills, credentials & roles',
    category: 'profile',
    categoryLabel: 'Profile & Branding',
    freeValue: 'Limited (3)',
    premiumValue: 'Unlimited / Advanced',
    icon: '🏷️'
  },
  {
    id: 'premium_badge',
    name: 'VIP Premium Star Badge',
    englishLabel: 'Exclusive gold star verification badge',
    category: 'profile',
    categoryLabel: 'Profile & Branding',
    freeValue: '❌ None',
    premiumValue: '⭐ VIP Badge',
    icon: '⭐'
  },
  {
    id: 'advanced_filters',
    name: 'Advanced Search Filters',
    englishLabel: 'Filter by exact skills, campus & interests',
    category: 'filters',
    categoryLabel: 'Filters & Search',
    freeValue: '❌ Standard',
    premiumValue: '✅ Smart Filters',
    icon: '⚡'
  },
  {
    id: 'distance_time_filters',
    name: 'Distance & Time Filters',
    englishLabel: 'Proximity radiuses & schedule matching',
    category: 'filters',
    categoryLabel: 'Filters & Search',
    freeValue: 'Basic',
    premiumValue: 'Advanced',
    icon: '⏳'
  },
  {
    id: 'activity_boost',
    name: 'Activity Radar Boost',
    englishLabel: 'Pin your needs to the top of the feed',
    category: 'activities',
    categoryLabel: 'Activities & Discovery',
    freeValue: '❌ Standard',
    premiumValue: '✅ 3x Priority Boost',
    icon: '🚀'
  },
  {
    id: 'who_viewed_interested',
    name: 'Who Viewed / Interested Radar',
    englishLabel: 'See who visited your profile & expressed interest',
    category: 'connections',
    categoryLabel: 'Direct Contact & Chat',
    freeValue: '❌ Locked',
    premiumValue: '✅ Full Visitor Insights',
    icon: '👁️'
  },
  {
    id: 'priority_matching',
    name: 'Priority Skill Matchmaking',
    englishLabel: 'First in line for matching activity needs',
    category: 'connections',
    categoryLabel: 'Direct Contact & Chat',
    freeValue: '❌ Standard',
    premiumValue: '✅ Instant Priority Match',
    icon: '🎯'
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly_89',
    name: 'Monthly Plan',
    priceInr: 89,
    monthlyEquivalentInr: 89,
    intervalMonths: 1,
    hasFreeTrial: true,
    trialDurationDays: 30,
    renewalPriceInr: 89,
    tagline: '1 Month FREE Trial • Then ₹89/month',
    features: [
      '1 Month 100% Free Trial',
      'Unlimited activity & mood discovery',
      'See who sent you connection requests',
      'Advanced distance & activity filters',
      '1 Free Profile Boost per month',
      'Optional ✨ MEMA Premium profile badge',
      'Cancel anytime before trial ends'
    ]
  },
  {
    id: 'quarterly_199',
    name: '3-Month Plan',
    priceInr: 199,
    monthlyEquivalentInr: 66,
    intervalMonths: 3,
    hasFreeTrial: false,
    trialDurationDays: 0,
    renewalPriceInr: 199,
    badge: 'BEST VALUE',
    tagline: '₹199 for 3 months (Only ₹66/month)',
    features: [
      'Save 26% compared to monthly',
      'Unlimited activity & mood discovery',
      'See who sent you connection requests',
      'Advanced distance & activity filters',
      '3 Free Profile Boosts (1/month)',
      'Priority profile visibility in nearby radar',
      'Optional ✨ MEMA Premium profile badge',
      'No monthly payment hassle'
    ]
  }
];

export const INITIAL_USER_SUBSCRIPTION: UserSubscription = {
  id: 'sub_user_me',
  userId: 'me',
  planId: null,
  status: 'FREE',
  startDate: new Date().toISOString(),
  autoRenew: false,
  amountPaidInr: 0
};

export const INITIAL_INCOMING_REQUESTS: IncomingRequest[] = [];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [];

export const INITIAL_ADMIN_METRICS: AdminAnalyticsMetrics = {
  totalPremiumUsers: 0,
  activeSubscriptions: 0,
  freeTrialUsers: 0,
  monthlySubscribers: 0,
  quarterlySubscribers: 0,
  totalRevenueInr: 0,
  monthlyRecurringRevenueInr: 0,
  failedPaymentsCount: 0,
  cancelledSubscriptionsCount: 0,
  trialConversionRatePercent: 0,
  renewalRatePercent: 0
};
