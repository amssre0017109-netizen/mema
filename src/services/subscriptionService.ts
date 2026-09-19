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

export const INITIAL_INCOMING_REQUESTS: IncomingRequest[] = [
  {
    id: 'req_1',
    sender: {
      id: 'stu_inc_1',
      name: 'Riddhi',
      age: 23,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      verified: true,
      distanceDisplay: '0.6 km away',
      moodName: 'Study & Co-Work',
      moodIcon: '📚',
      intention: 'Looking for someone to co-work with at the local cafe this afternoon!',
      sentAt: '20 mins ago'
    },
    note: 'Hey! Saw your profile on the nearby radar. Up for a co-working session today?',
    status: 'PENDING'
  },
  {
    id: 'req_2',
    sender: {
      id: 'stu_inc_2',
      name: 'Yash',
      age: 24,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      verified: true,
      distanceDisplay: '1.4 km away',
      moodName: 'Gym Partner',
      moodIcon: '🏋️',
      intention: 'Hitting shoulder press and deadlifts at 5:30 PM. Need a spotter!',
      sentAt: '1 hour ago'
    },
    note: 'Hey, saw you are into lifting. Let us train together at the gym!',
    status: 'PENDING'
  },
  {
    id: 'req_3',
    sender: {
      id: 'stu_inc_3',
      name: 'Kavya',
      age: 22,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      verified: true,
      distanceDisplay: '0.9 km away',
      moodName: 'Coffee & Chill',
      moodIcon: '☕',
      intention: 'Free between 3 PM and 5 PM for iced coffee and banter at the cafe.',
      sentAt: '3 hours ago'
    },
    note: 'Hey! You have great taste in indie music. Let us grab coffee sometime!',
    status: 'PENDING'
  }
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'txn_109281',
    subscriptionId: 'sub_901',
    userId: 'stu_1',
    userName: 'Aman',
    userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    planName: '3-Month Plan (₹199)',
    amountInr: 199,
    currency: 'INR',
    paymentMethod: 'UPI',
    paymentMethodDetails: 'Google Pay • aman@okhdfcbank',
    status: 'SUCCESS',
    gatewayTxnId: 'pay_MEMA_92817264',
    createdAt: 'Today, 2:45 PM'
  },
  {
    id: 'txn_109280',
    subscriptionId: 'sub_902',
    userId: 'stu_2',
    userName: 'Priya',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    planName: 'Monthly Plan (Trial ₹0)',
    amountInr: 0,
    currency: 'INR',
    paymentMethod: 'UPI',
    paymentMethodDetails: 'PhonePe • priya@ybl (1-Mo Trial Auth)',
    status: 'SUCCESS',
    gatewayTxnId: 'pay_MEMA_83719283',
    createdAt: 'Today, 1:12 PM'
  },
  {
    id: 'txn_109279',
    subscriptionId: 'sub_903',
    userId: 'stu_3',
    userName: 'Rohan',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    planName: 'Monthly Plan (₹89)',
    amountInr: 89,
    currency: 'INR',
    paymentMethod: 'CARD',
    paymentMethodDetails: 'HDFC Mastercard ending •••• 5821',
    status: 'SUCCESS',
    gatewayTxnId: 'pay_MEMA_74829104',
    createdAt: 'Today, 11:30 AM'
  },
  {
    id: 'txn_109278',
    subscriptionId: 'sub_904',
    userId: 'stu_4',
    userName: 'Ananya',
    userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    planName: '3-Month Plan (₹199)',
    amountInr: 199,
    currency: 'INR',
    paymentMethod: 'NETBANKING',
    paymentMethodDetails: 'ICICI Bank Net Banking',
    status: 'SUCCESS',
    gatewayTxnId: 'pay_MEMA_63910283',
    createdAt: 'Yesterday, 8:15 PM'
  },
  {
    id: 'txn_109277',
    subscriptionId: 'sub_905',
    userId: 'stu_7',
    userName: 'Dev',
    userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    planName: 'Monthly Plan (₹89)',
    amountInr: 89,
    currency: 'INR',
    paymentMethod: 'UPI',
    paymentMethodDetails: 'Paytm UPI • dev@paytm',
    status: 'FAILED',
    gatewayTxnId: 'pay_MEMA_55102938',
    createdAt: 'Yesterday, 4:20 PM'
  }
];

export const INITIAL_ADMIN_METRICS: AdminAnalyticsMetrics = {
  totalPremiumUsers: 482,
  activeSubscriptions: 428,
  freeTrialUsers: 184,
  monthlySubscribers: 156,
  quarterlySubscribers: 142,
  totalRevenueInr: 58240,
  monthlyRecurringRevenueInr: 23280,
  failedPaymentsCount: 14,
  cancelledSubscriptionsCount: 19,
  trialConversionRatePercent: 68.4,
  renewalRatePercent: 88.2
};
