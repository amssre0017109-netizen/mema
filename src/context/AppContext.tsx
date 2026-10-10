import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CampusRequest,
  RequestCategory,
  UserProfile,
  Conversation,
  ChatMessage,
  CampusNotification,
  DistanceFilter
} from '../types';
import {
  SubscriptionPlan,
  UserSubscription,
  PaymentTransaction,
  IncomingRequest,
  AdminAnalyticsMetrics,
  PaymentMethodType
} from '../types/subscription';
import {
  MOCK_CAMPUS_REQUESTS,
  MOCK_STUDENTS,
  CURRENT_USER,
  GUEST_USER,
  MOCK_NOTIFICATIONS,
  MOCK_CONVERSATIONS,
  CAMPUS_OPTIONS
} from '../data/mockData';
import {
  SUBSCRIPTION_PLANS,
  INITIAL_USER_SUBSCRIPTION,
  INITIAL_INCOMING_REQUESTS,
  INITIAL_TRANSACTIONS,
  INITIAL_ADMIN_METRICS
} from '../services/subscriptionService';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { supabaseService } from '../services/supabaseService';


export type AppView = 'home' | 'discover' | 'activities' | 'messages' | 'profile' | 'admin';

interface ReportModalData {
  isOpen: boolean;
  type: 'user' | 'request';
  targetId: string;
  targetName: string;
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  allStudents: UserProfile[];

  // Campus & Category Filters
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
  selectedCategory: RequestCategory | 'all';
  setSelectedCategory: (category: RequestCategory | 'all') => void;
  myCampusOnly: boolean;
  setMyCampusOnly: (val: boolean) => void;
  distanceFilter: DistanceFilter;
  setDistanceFilter: (dist: DistanceFilter) => void;

  // Requests
  campusRequests: CampusRequest[];
  filteredRequests: CampusRequest[];
  addCampusRequest: (request: Omit<CampusRequest, 'id' | 'createdAt' | 'interestedUsers' | 'peopleJoined' | 'likesCount' | 'commentsCount'>) => void;
  expressInterest: (requestId: string, note?: string) => void;
  acceptInterest: (requestId: string, studentId: string) => void;
  declineInterest: (requestId: string, studentId: string) => void;
  toggleLikeRequest: (requestId: string) => void;
  activeInterestTargetRequest: CampusRequest | null;
  setActiveInterestTargetRequest: (req: CampusRequest | null) => void;

  // Modals & Drawers
  isCreateRequestModalOpen: boolean;
  setIsCreateRequestModalOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isSafetyModalOpen: boolean;
  setIsSafetyModalOpen: (open: boolean) => void;

  // Notifications
  notifications: CampusNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Conversations & Chat
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (convId: string, text: string, isIcebreaker?: boolean, safeMeetup?: ChatMessage['safeMeetupProposal']) => void;
  toggleMessageReaction: (convId: string, messageId: string, emoji: string) => void;
  respondToMeetupProposal: (convId: string, msgId: string, accept: boolean) => void;
  clearConversationMessages: (convId: string) => void;
  startConversationWithStudent: (student: UserProfile, contextTitle?: string, initialMessage?: string) => void;

  // Safety, Report & Block
  reportModalData: ReportModalData | null;
  openReportModal: (type: 'user' | 'request', targetId: string, targetName: string) => void;
  closeReportModal: () => void;
  submitReport: (reason: string, details?: string) => void;
  blockedUserIds: string[];
  blockUser: (userId: string, userName?: string) => void;
  // Follow System & Profile Dossier
  followedUserIds: string[];
  followLoadingUserIds: string[];
  toggleFollowUser: (userId: string) => Promise<void>;
  isFollowingUser: (userId: string) => boolean;
  isFollowLoading: (userId: string) => boolean;
  viewingProfileUser: UserProfile | null;
  openUserProfileModal: (user: UserProfile) => void;
  closeUserProfileModal: () => void;
  activeStoryUser: UserProfile | null;
  openStoryViewer: (user: UserProfile) => void;
  closeStoryViewer: () => void;

  // Toast & Celebrations
  notificationToast: { message: string; subtext?: string } | null;
  setNotificationToast: (toast: { message: string; subtext?: string } | null) => void;
  triggerMatchCelebration: () => void;

  // ✨ MEMA Premium System
  userSubscription: UserSubscription;
  isPremium: boolean;
  isTrial: boolean;
  isPremiumModalOpen: boolean;
  setIsPremiumModalOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  selectedPlanForCheckout: SubscriptionPlan | null;
  openCheckoutForPlan: (plan: SubscriptionPlan) => void;
  activateSubscription: (plan: SubscriptionPlan, method: PaymentMethodType, details: string) => void;
  cancelUserSubscription: () => void;
  toggleAutoRenew: () => void;
  showPremiumBadgeOnProfile: boolean;
  setShowPremiumBadgeOnProfile: (show: boolean) => void;

  // Profile Boost
  isProfileBoostActive: boolean;
  profileBoostSecondsLeft: number;
  triggerProfileBoost: () => void;

  // Admin Telemetry
  transactions: PaymentTransaction[];
  adminMetrics: AdminAnalyticsMetrics;

  // 🎨 Theme & Appearance (Bright & Dark)
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // 🚀 Loading Splash Screen (2s)
  showLoadingScreen: boolean;
  setShowLoadingScreen: (show: boolean) => void;
  triggerLoadingScreen: () => void;

  // 🔐 Authentication & Session
  authUser: any;
  setAuthUser: React.Dispatch<React.SetStateAction<any>>;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'signin' | 'signup' | 'demo';
  openAuthModal: (mode?: 'signin' | 'signup' | 'demo') => void;
  closeAuthModal: () => void;

  // ⚙️ Settings Modal
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  settingsInitialTab: 'appearance' | 'help' | 'privacy' | 'preferences' | 'location' | 'premium' | 'terms' | 'logout' | 'auth' | 'mema_auth';
  openSettingsModal: (tab?: 'appearance' | 'help' | 'privacy' | 'preferences' | 'location' | 'premium' | 'terms' | 'logout' | 'auth' | 'mema_auth') => void;
  closeSettingsModal: () => void;
  unblockUser: (userId: string) => void;
  logoutUser: () => void;
}

const getInitialAuthUser = () => {
  try {
    const sessionStr = localStorage.getItem('mema_auth_session');
    if (sessionStr) {
      return JSON.parse(sessionStr);
    }
  } catch {}
  return null;
};

const getInitialCurrentUser = (): UserProfile => {
  try {
    const userStr = localStorage.getItem('mema_user_profile');
    if (userStr) {
      const parsed = JSON.parse(userStr);
      if (parsed && parsed.id && parsed.id !== 'guest') {
        return parsed;
      }
    }
    const sessionStr = localStorage.getItem('mema_auth_session');
    if (sessionStr) {
      const parsedSession = JSON.parse(sessionStr);
      if (parsedSession && parsedSession.id) {
        return {
          ...CURRENT_USER,
          id: parsedSession.id,
          name: parsedSession.user_metadata?.name || parsedSession.email?.split('@')[0] || 'Campus Student',
          college: parsedSession.user_metadata?.college || 'Delhi Technological University (DTU)',
          isGuest: false
        };
      }
    }
  } catch {}
  return GUEST_USER;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [authUser, setAuthUser] = useState<any>(getInitialAuthUser);
  const [currentUser, setCurrentUser] = useState<UserProfile>(getInitialCurrentUser);
  const [allStudents, setAllStudents] = useState<UserProfile[]>(MOCK_STUDENTS);
  const [campusRequests, setCampusRequests] = useState<CampusRequest[]>(MOCK_CAMPUS_REQUESTS);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<CampusNotification[]>(MOCK_NOTIFICATIONS);

  const isAuthenticated = Boolean(
    authUser &&
    currentUser &&
    currentUser.id !== 'guest' &&
    !currentUser.isGuest
  );

  // Filters
  const [selectedCampus, setSelectedCampus] = useState<string>('Delhi Technological University (DTU)');
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory | 'all'>('all');
  const [myCampusOnly, setMyCampusOnly] = useState<boolean>(true);
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>('5km');

  // Modals & UI States
  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] = useState(false);
  const [activeInterestTargetRequest, setActiveInterestTargetRequest] = useState<CampusRequest | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [notificationToast, setNotificationToast] = useState<{ message: string; subtext?: string } | null>(null);

  // Safety: Report & Block
  const [reportModalData, setReportModalData] = useState<ReportModalData | null>(null);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);

  // Follow & Dossier Profile Viewer
  const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);
  const [followLoadingUserIds, setFollowLoadingUserIds] = useState<string[]>([]);
  const [viewingProfileUser, setViewingProfileUser] = useState<UserProfile | null>(null);
  const [activeStoryUser, setActiveStoryUser] = useState<UserProfile | null>(null);

  // Premium
  const [userSubscription, setUserSubscription] = useState<UserSubscription>(INITIAL_USER_SUBSCRIPTION);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlan | null>(null);
  const [showPremiumBadgeOnProfile, setShowPremiumBadgeOnProfile] = useState(true);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [adminMetrics, setAdminMetrics] = useState<AdminAnalyticsMetrics>(INITIAL_ADMIN_METRICS);

  // Boost
  const [isProfileBoostActive, setIsProfileBoostActive] = useState(false);
  const [profileBoostSecondsLeft, setProfileBoostSecondsLeft] = useState(0);

  // 🎨 Theme (Bright / Dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('mema_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {}
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      body.classList.remove('dark');
    }
    try {
      localStorage.setItem('mema_theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      setNotificationToast({
        message: next === 'dark' ? '🌙 Dark Mode Activated' : '☀️ Bright Mode Activated',
        subtext: next === 'dark' ? 'Obsidian Midnight theme enabled.' : 'Light Sky Blue theme enabled.'
      });
      return next;
    });
  };

  // 🔐 Authentication & Session Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'demo'>('signin');

  const openAuthModal = (mode: 'signin' | 'signup' | 'demo' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Helper to rehydrate/sync profile from Supabase or user metadata
  const syncProfileFromAuthUser = async (user: any) => {
    if (!user) return;
    try {
      // 1. Try to fetch existing profile from Supabase
      const existingProfile = await supabaseService.getProfileById(user.id);
      if (existingProfile) {
        setCurrentUser(existingProfile);
        try {
          localStorage.setItem('mema_user_profile', JSON.stringify(existingProfile));
        } catch {}
        return;
      }

      // 2. Fallback: construct profile from session metadata
      const profileData: UserProfile = {
        ...CURRENT_USER,
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Campus Student',
        college: user.user_metadata?.college || user.user_metadata?.location || 'Connaught Place, New Delhi',
        location: user.user_metadata?.location || user.user_metadata?.college || 'Connaught Place, New Delhi',
        locationZone: user.user_metadata?.location || user.user_metadata?.college || 'Connaught Place, New Delhi',
        avatar: user.user_metadata?.avatar || CURRENT_USER.avatar,
        isGuest: false
      };
      setCurrentUser(profileData);
      try {
        localStorage.setItem('mema_user_profile', JSON.stringify(profileData));
      } catch {}

      // Persist profile to Supabase database so future queries find it
      await supabaseService.upsertProfile(profileData);
    } catch (err) {
      console.warn('Error syncing profile from auth user:', err);
    }
  };

  // Listen to Supabase Auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthUser(session.user);
        try {
          localStorage.setItem('mema_auth_session', JSON.stringify(session.user));
        } catch {}
        syncProfileFromAuthUser(session.user);
      } else {
        const localAuth = localStorage.getItem('mema_auth_session');
        if (!localAuth) {
          setAuthUser(null);
          setCurrentUser(GUEST_USER);
        }
      }
    });

    // Subscribe to auth events (SIGN_IN, SIGN_OUT, TOKEN_REFRESHED, USER_UPDATED)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setAuthUser(session.user);
        try {
          localStorage.setItem('mema_auth_session', JSON.stringify(session.user));
        } catch {}
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
          syncProfileFromAuthUser(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setAuthUser(null);
        setCurrentUser(GUEST_USER);
        try {
          localStorage.removeItem('mema_auth_session');
          localStorage.removeItem('mema_user_profile');
        } catch {}
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 👥 Load live profiles and campus requests from database / Supabase if configured
  useEffect(() => {
    let isMounted = true;
    if (isSupabaseConfigured) {
      supabaseService.getProfiles().then(profiles => {
        if (isMounted && Array.isArray(profiles) && profiles.length > 0) {
          setAllStudents(profiles);
        }
      });
      supabaseService.getCampusRequests().then(requests => {
        if (isMounted && Array.isArray(requests) && requests.length > 0) {
          setCampusRequests(requests);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  // 👥 Synchronize follow relationships from database on user/session initialization
  useEffect(() => {
    if (!isAuthenticated || !authUser) {
      setFollowedUserIds([]);
      return;
    }
    const activeFollowerId = authUser.id || currentUser.id;
    if (!activeFollowerId || activeFollowerId === 'guest') return;

    let isMounted = true;
    supabaseService.getFollowingUserIds(activeFollowerId).then(ids => {
      if (isMounted && Array.isArray(ids)) {
        setFollowedUserIds(ids);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, authUser?.id, currentUser?.id]);

  // 🚀 Loading Splash Screen (2s)
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const triggerLoadingScreen = () => {
    setShowLoadingScreen(true);
  };

  // ⚙️ Settings Modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'appearance' | 'help' | 'privacy' | 'preferences' | 'location' | 'premium' | 'terms' | 'logout' | 'auth' | 'mema_auth'>('appearance');

  const openSettingsModal = (tab?: 'appearance' | 'help' | 'privacy' | 'preferences' | 'location' | 'premium' | 'terms' | 'logout' | 'auth' | 'mema_auth') => {
    if (tab) setSettingsInitialTab(tab);
    setIsSettingsModalOpen(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  const unblockUser = (userId: string) => {
    setBlockedUserIds(prev => prev.filter(id => id !== userId));
    setNotificationToast({
      message: 'User Unblocked',
      subtext: 'You will now be able to see their activity updates and requests.'
    });
  };

  const logoutUser = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }

    // 1. Reset in-memory session and user profile
    setAuthUser(null);
    setCurrentUser(GUEST_USER);
    setFollowedUserIds([]);
    setActiveConversationId(null);

    // 2. Clear all persistent auth storage
    try {
      localStorage.removeItem('mema_auth_session');
      localStorage.removeItem('mema_user_profile');
      localStorage.removeItem('mema_followed_users');

      // Clear any cached Supabase tokens
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase.auth')) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();
    } catch (err) {
      console.warn('Storage cleanup error:', err);
    }

    // 3. Dismiss modals
    setIsSettingsModalOpen(false);
    setIsAuthModalOpen(false);

    // 4. Force view back to home and replace browser history to prevent Back button re-entry
    setCurrentView('home');
    try {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch {}

    // 5. Automatically refresh the page for a completely clean reload
    try {
      window.location.reload();
    } catch {
      window.location.href = window.location.origin + window.location.pathname;
    }
  };

  const isPremium = userSubscription.status === 'PREMIUM' || userSubscription.status === 'TRIAL';
  const isTrial = userSubscription.status === 'TRIAL';

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Boost countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isProfileBoostActive && profileBoostSecondsLeft > 0) {
      timer = setInterval(() => {
        setProfileBoostSecondsLeft(prev => {
          if (prev <= 1) {
            setIsProfileBoostActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isProfileBoostActive, profileBoostSecondsLeft]);

  const triggerMatchCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0A84FF', '#00F2FE', '#10B981', '#FFB800', '#F43F5E']
      });
    } catch {}
  };

  // Add Request
  const addCampusRequest = (
    reqData: Omit<CampusRequest, 'id' | 'createdAt' | 'interestedUsers' | 'peopleJoined' | 'likesCount' | 'commentsCount'>
  ) => {
    if (!isAuthenticated) {
      openAuthModal('signin');
      setNotificationToast({
        message: '🔐 Sign In Required',
        subtext: 'Please sign in or create an account to post campus requests.'
      });
      return;
    }

    const newReq: CampusRequest = {
      ...reqData,
      id: `req_${Date.now()}`,
      createdAt: 'Just now',
      interestedUsers: [],
      peopleJoined: 0,
      likesCount: 0,
      likedByMe: false,
      commentsCount: 0
    };

    setCampusRequests(prev => [newReq, ...prev]);
    setCurrentUser(prev => ({
      ...prev,
      requestsPosted: (prev.requestsPosted || 0) + 1
    }));

    setNotificationToast({
      message: '🚀 Request Posted!',
      subtext: `Nearby peers with matching skills in ${newReq.location} will be notified.`
    });

    triggerMatchCelebration();
  };

  // Express Interest in a Request
  const expressInterest = (requestId: string, note?: string) => {
    if (!isAuthenticated) {
      openAuthModal('signin');
      setNotificationToast({
        message: '🔐 Sign In Required',
        subtext: 'Please sign in or create an account to express interest in campus requests.'
      });
      return;
    }

    const target = campusRequests.find(r => r.id === requestId);
    if (!target) return;

    setCampusRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          const alreadyExpressed = r.interestedUsers.some(u => u.id === currentUser.id);
          if (alreadyExpressed) return r;
          return {
            ...r,
            interestedUsers: [
              ...r.interestedUsers,
              {
                id: currentUser.id,
                name: currentUser.name,
                avatar: currentUser.avatar,
                college: currentUser.college,
                skills: currentUser.skills,
                note: note?.trim(),
                time: 'Just now',
                status: 'PENDING'
              }
            ]
          };
        }
        return r;
      })
    );

    // Auto-create/open conversation with requester
    const existingConv = conversations.find(c => c.partner.id === target.creator.id);
    if (!existingConv) {
      const partnerProfile = allStudents.find(s => s.id === target.creator.id) || {
        id: target.creator.id,
        name: target.creator.name,
        age: 21,
        college: target.creator.college,
        degree: target.creator.degree || 'B.Tech',
        year: target.creator.year || 'Student',
        avatar: target.creator.avatar,
        verifiedCollege: target.creator.verifiedCollege,
        studentIdVerified: true,
        skills: target.requiredSkills,
        interests: target.requiredSkills,
        activitiesCompleted: 10,
        requestsPosted: 3,
        bio: `Student at ${target.creator.college}`,
        locationZone: target.location,
        onlineStatus: 'active_now'
      };

      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        partner: partnerProfile,
        lastMessage: note?.trim() || `Hey! I am interested in your request: "${target.title}"`,
        lastMessageTime: 'Just now',
        unreadCount: 0,
        activityContext: {
          requestTitle: target.title,
          matchedDate: 'Today'
        },
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderId: 'me',
            text: note?.trim() ? `Hey! Interested in: "${target.title}". ${note.trim()}` : `Hey! I am interested in your request: "${target.title}"`,
            timestamp: 'Just now',
            isMine: true
          }
        ]
      };

      setConversations(prev => [newConv, ...prev]);
    }

    setNotificationToast({
      message: '✨ Interest Sent!',
      subtext: `${target.creator.name} received your profile & skills.`
    });

    triggerMatchCelebration();
  };

  // Accept Interest
  const acceptInterest = (requestId: string, studentId: string) => {
    setCampusRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            peopleJoined: Math.min(r.peopleNeeded, r.peopleJoined + 1),
            interestedUsers: r.interestedUsers.map(u =>
              u.id === studentId ? { ...u, status: 'ACCEPTED' } : u
            )
          };
        }
        return r;
      })
    );

    setNotificationToast({
      message: '✓ Student Accepted!',
      subtext: 'You can now message and plan the meetup.'
    });
  };

  // Decline Interest
  const declineInterest = (requestId: string, studentId: string) => {
    setCampusRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            interestedUsers: r.interestedUsers.map(u =>
              u.id === studentId ? { ...u, status: 'DECLINED' } : u
            )
          };
        }
        return r;
      })
    );
  };

  // Toggle Like Request
  const toggleLikeRequest = (requestId: string) => {
    setCampusRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          const isLiked = !r.likedByMe;
          return {
            ...r,
            likedByMe: isLiked,
            likesCount: isLiked ? (r.likesCount || 0) + 1 : Math.max(0, (r.likesCount || 1) - 1)
          };
        }
        return r;
      })
    );
  };

  // Mark Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Chat message send
  const sendMessage = (
    convId: string,
    text: string,
    isIcebreaker: boolean = false,
    safeMeetup?: ChatMessage['safeMeetupProposal']
  ) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      text,
      timestamp: 'Just now',
      isMine: true,
      isIcebreaker,
      safeMeetupProposal: safeMeetup
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );

    // Realistic peer reply simulation
    setTimeout(() => {
      const peerResponses = [
        'Awesome, looking forward to it!',
        'Sounds like a solid plan. See you there!',
        'Got it! Reaching the spot on time.',
        'Great! Let me know when you reach.'
      ];
      const randomResponse = peerResponses[Math.floor(Math.random() * peerResponses.length)];

      const peerMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        senderId: 'peer',
        text: randomResponse,
        timestamp: 'Just now',
        isMine: false
      };

      setConversations(prev =>
        prev.map(c => {
          if (c.id === convId) {
            return {
              ...c,
              lastMessage: randomResponse,
              lastMessageTime: 'Just now',
              messages: [...c.messages, peerMsg]
            };
          }
          return c;
        })
      );
    }, 1500);
  };

  // Toggle emoji reaction on message
  const toggleMessageReaction = (convId: string, messageId: string, emoji: string) => {
    const currentUserId = authUser?.id || currentUser?.id || 'me';
    setConversations(prev =>
      prev.map(c => {
        if (c.id === convId) {
          const updatedMessages = c.messages.map(m => {
            if (m.id === messageId) {
              const currentReactions = m.reactions || [];
              const existingReaction = currentReactions.find(r => r.emoji === emoji);
              let newReactions;
              if (existingReaction) {
                if (existingReaction.users.includes(currentUserId)) {
                  const updatedUsers = existingReaction.users.filter(u => u !== currentUserId);
                  if (updatedUsers.length === 0) {
                    newReactions = currentReactions.filter(r => r.emoji !== emoji);
                  } else {
                    newReactions = currentReactions.map(r =>
                      r.emoji === emoji
                        ? { ...r, count: updatedUsers.length, users: updatedUsers }
                        : r
                    );
                  }
                } else {
                  newReactions = currentReactions.map(r =>
                    r.emoji === emoji
                      ? { ...r, count: r.count + 1, users: [...r.users, currentUserId] }
                      : r
                  );
                }
              } else {
                newReactions = [...currentReactions, { emoji, count: 1, users: [currentUserId] }];
              }
              return { ...m, reactions: newReactions };
            }
            return m;
          });
          return { ...c, messages: updatedMessages };
        }
        return c;
      })
    );
  };

  // Respond to Safe Meetup Proposal
  const respondToMeetupProposal = (convId: string, msgId: string, accept: boolean) => {
    let proposalLocation = 'Campus Safe Spot';
    let proposalTime = 'Scheduled Time';

    setConversations(prev =>
      prev.map(c => {
        if (c.id === convId) {
          const updatedMessages = c.messages.map(m => {
            if (m.id === msgId && m.safeMeetupProposal) {
              proposalLocation = m.safeMeetupProposal.locationName;
              proposalTime = m.safeMeetupProposal.time;
              return {
                ...m,
                safeMeetupProposal: {
                  ...m.safeMeetupProposal,
                  status: accept ? ('accepted' as const) : ('proposed' as const)
                }
              };
            }
            return m;
          });

          return {
            ...c,
            messages: updatedMessages
          };
        }
        return c;
      })
    );

    if (accept) {
      sendMessage(
        convId,
        `✓ Meetup confirmed! I will be at ${proposalLocation} (${proposalTime}).`
      );
      setNotificationToast({
        message: '🤝 Safe Meetup Confirmed!',
        subtext: `Meeting at ${proposalLocation} • ${proposalTime}`
      });
    } else {
      sendMessage(
        convId,
        `Let's coordinate an alternative time or campus spot for our meetup.`
      );
      setNotificationToast({
        message: 'Proposal Updated',
        subtext: 'You can suggest an alternative spot or time.'
      });
    }
  };

  // Clear conversation history
  const clearConversationMessages = (convId: string) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: 'Chat history cleared.',
            lastMessageTime: 'Just now',
            messages: []
          };
        }
        return c;
      })
    );
    setNotificationToast({
      message: 'Chat Cleared',
      subtext: 'Message history for this conversation was reset.'
    });
  };

  // Start chat with a student
  const startConversationWithStudent = (student: UserProfile, contextTitle?: string, initialMessage?: string) => {
    if (!isAuthenticated) {
      openAuthModal('signin');
      setNotificationToast({
        message: '🔐 Sign In Required',
        subtext: 'Please sign in or create an account to start chatting with students.'
      });
      return;
    }

    const existing = conversations.find(c => c.partner.id === student.id);
    if (existing) {
      setActiveConversationId(existing.id);
      setCurrentView('messages');
      return;
    }

    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      partner: student,
      lastMessage: initialMessage || `Hey ${student.name.split(' ')[0]}! Connected via MEMA.`,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      activityContext: contextTitle
        ? { requestTitle: contextTitle, matchedDate: 'Today' }
        : undefined,
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: 'me',
          text: initialMessage || `Hey ${student.name.split(' ')[0]}! Connected via MEMA.`,
          timestamp: 'Just now',
          isMine: true
        }
      ]
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setCurrentView('messages');
  };

  // Safety Modal Handlers
  const openReportModal = (type: 'user' | 'request', targetId: string, targetName: string) => {
    setReportModalData({
      isOpen: true,
      type,
      targetId,
      targetName
    });
  };

  const closeReportModal = () => {
    setReportModalData(null);
  };

  const submitReport = (reason: string, details?: string) => {
    if (!reportModalData) return;
    setNotificationToast({
      message: '🛡️ Report Submitted',
      subtext: `Our student safety moderators will review ${reportModalData.targetName}.`
    });
    closeReportModal();
  };

  const blockUser = (userId: string, userName?: string) => {
    setBlockedUserIds(prev => [...prev, userId]);
    // Filter out conversations with blocked user
    setConversations(prev => prev.filter(c => c.partner.id !== userId));
    // Filter out requests created by blocked user
    setCampusRequests(prev => prev.filter(r => r.creator.id !== userId));

    setNotificationToast({
      message: '🚫 User Blocked',
      subtext: `${userName || 'Student'} has been blocked and will no longer see your requests.`
    });
  };

  // Follow & Profile Dossier Handlers
  const isFollowLoading = (userId: string) => {
    return followLoadingUserIds.includes(userId);
  };

  const isFollowingUser = (userId: string) => {
    return followedUserIds.includes(userId);
  };

  const toggleFollowUser = async (userId: string) => {
    if (!isAuthenticated || !authUser || currentUser.id === 'guest' || currentUser.isGuest) {
      openAuthModal('signin');
      setNotificationToast({
        message: '🔐 Sign In Required',
        subtext: 'Please sign in or create an account to follow students.'
      });
      return;
    }

    const activeFollowerId = authUser.id || currentUser.id;

    if (!activeFollowerId || !userId) return;

    // Prevent self-follow
    if (activeFollowerId === userId || currentUser?.id === userId || userId === 'me') {
      setNotificationToast({
        message: '⚠️ Action Not Allowed',
        subtext: 'You cannot follow your own profile.'
      });
      return;
    }

    // Prevent duplicate concurrent requests
    if (followLoadingUserIds.includes(userId)) return;

    setFollowLoadingUserIds(prev => [...prev, userId]);

    const isCurrentlyFollowed = followedUserIds.includes(userId);
    const targetUser = allStudents.find(s => s.id === userId);
    const targetName = targetUser?.name || 'Member';

    try {
      if (isCurrentlyFollowed) {
        // Unfollow
        const res = await supabaseService.unfollowUser(activeFollowerId, userId);
        if (res.success) {
          setFollowedUserIds(prev => prev.filter(id => id !== userId));
          setNotificationToast({
            message: `Unfollowed ${targetName}`,
            subtext: `You won't see their updates in your followed stories.`
          });
        } else {
          setNotificationToast({
            message: 'Unfollow Failed',
            subtext: res.error || 'Could not update follow status. Please try again.'
          });
        }
      } else {
        // Follow
        const res = await supabaseService.followUser(activeFollowerId, userId);
        if (res.success) {
          setFollowedUserIds(prev => (prev.includes(userId) ? prev : [...prev, userId]));
          setNotificationToast({
            message: `Following ${targetName} 🌟`,
            subtext: `You can now see their stories & full profile dossier.`
          });
          triggerMatchCelebration();
        } else {
          setNotificationToast({
            message: 'Follow Failed',
            subtext: res.error || 'Could not update follow status. Please try again.'
          });
        }
      }
    } catch (err: any) {
      console.error('Follow toggle error:', err);
      setNotificationToast({
        message: 'Network Error',
        subtext: 'Failed to communicate with server. Please try again.'
      });
    } finally {
      setFollowLoadingUserIds(prev => prev.filter(id => id !== userId));
    }
  };

  const openUserProfileModal = (user: UserProfile) => {
    setViewingProfileUser(user);
  };

  const closeUserProfileModal = () => {
    setViewingProfileUser(null);
  };

  const openStoryViewer = (user: UserProfile) => {
    setActiveStoryUser(user);
  };

  const closeStoryViewer = () => {
    setActiveStoryUser(null);
  };

  // Premium Activation Handlers
  const openCheckoutForPlan = (plan: SubscriptionPlan) => {
    setSelectedPlanForCheckout(plan);
    setIsPremiumModalOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const activateSubscription = (
    plan: SubscriptionPlan,
    method: PaymentMethodType,
    methodDetails: string
  ) => {
    const isTrialStart = plan.hasFreeTrial && userSubscription.status === 'FREE';
    const newStatus = isTrialStart ? 'TRIAL' : 'PREMIUM';

    const now = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(now.getDate() + 30);

    const renewalDate = new Date();
    renewalDate.setMonth(now.getMonth() + plan.intervalMonths);

    const updatedSub: UserSubscription = {
      id: `sub_${Date.now()}`,
      userId: currentUser.id,
      planId: plan.id,
      status: newStatus,
      startDate: now.toISOString(),
      trialStartDate: isTrialStart ? now.toISOString() : undefined,
      trialEndDate: isTrialStart ? trialEndDate.toISOString() : undefined,
      renewalDate: renewalDate.toISOString(),
      autoRenew: true,
      amountPaidInr: isTrialStart ? 0 : plan.priceInr,
      paymentMethod: method,
      gatewaySubscriptionId: `sub_gwy_${Date.now()}`
    };

    setUserSubscription(updatedSub);
    setIsCheckoutModalOpen(false);

    const newTxn: PaymentTransaction = {
      id: `txn_${Date.now()}`,
      subscriptionId: updatedSub.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      planName: `${plan.name} (${isTrialStart ? '1-Mo Free Trial' : `₹${plan.priceInr}`})`,
      amountInr: isTrialStart ? 0 : plan.priceInr,
      currency: 'INR',
      paymentMethod: method,
      paymentMethodDetails: methodDetails,
      status: 'SUCCESS',
      gatewayTxnId: `pay_MEMA_${Date.now()}`,
      createdAt: 'Just now',
      invoiceUrl: `#invoice_${Date.now()}`
    };

    setTransactions(prev => [newTxn, ...prev]);

    setAdminMetrics(prev => ({
      ...prev,
      totalPremiumUsers: prev.totalPremiumUsers + 1,
      activeSubscriptions: prev.activeSubscriptions + 1,
      freeTrialUsers: isTrialStart ? prev.freeTrialUsers + 1 : prev.freeTrialUsers,
      totalRevenueInr: prev.totalRevenueInr + (isTrialStart ? 0 : plan.priceInr)
    }));

    setNotificationToast({
      message: '✨ MEMA VIP Activated!',
      subtext: isTrialStart ? 'Enjoy 1 Month Free Trial with priority request boost.' : 'Your VIP plan is active.'
    });

    triggerMatchCelebration();
  };

  const cancelUserSubscription = () => {
    setUserSubscription(prev => ({
      ...prev,
      status: 'CANCELLED',
      autoRenew: false,
      cancelledAt: new Date().toISOString()
    }));
    setNotificationToast({
      message: 'Subscription Cancelled',
      subtext: 'Your VIP perks will expire at the end of the billing period.'
    });
  };

  const toggleAutoRenew = () => {
    setUserSubscription(prev => ({
      ...prev,
      autoRenew: !prev.autoRenew
    }));
  };

  const triggerProfileBoost = () => {
    setIsProfileBoostActive(true);
    setProfileBoostSecondsLeft(3600); // 1 hour boost
    setNotificationToast({
      message: '⚡ Radar & Request Boosted!',
      subtext: 'Your campus requests will stay pinned at the top for 1 hour.'
    });
    triggerMatchCelebration();
  };

  // Filtered requests based on campus and category
  const filteredRequests = useMemo(() => {
    return campusRequests.filter(req => {
      // 1. Exclude blocked users
      if (blockedUserIds.includes(req.creator.id)) return false;

      // 2. Nearby only filter
      if (myCampusOnly) {
        if (req.distanceKm > 5.0) return false;
      }

      // 3. Category filter
      if (selectedCategory !== 'all') {
        if (req.category !== selectedCategory) return false;
      }

      // 4. Distance filter
      const maxDistanceKm: Record<DistanceFilter, number> = {
        'nearby': 5.0,
        '1km': 1.0,
        '3km': 3.0,
        '5km': 5.0,
        '10km': 10.0,
        'all': 999
      };

      const limit = maxDistanceKm[distanceFilter] || 999;
      if (req.distanceKm > limit) return false;

      return true;
    });
  }, [campusRequests, selectedCategory, myCampusOnly, distanceFilter, blockedUserIds]);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentUser,
        setCurrentUser,
        allStudents,

        // Filters
        selectedCampus,
        setSelectedCampus,
        selectedCategory,
        setSelectedCategory,
        myCampusOnly,
        setMyCampusOnly,
        distanceFilter,
        setDistanceFilter,

        // Requests
        campusRequests,
        filteredRequests,
        addCampusRequest,
        expressInterest,
        acceptInterest,
        declineInterest,
        toggleLikeRequest,
        activeInterestTargetRequest,
        setActiveInterestTargetRequest,

        // Modals & UI
        isCreateRequestModalOpen,
        setIsCreateRequestModalOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isSafetyModalOpen,
        setIsSafetyModalOpen,

        // Notifications
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        // Conversations
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        toggleMessageReaction,
        respondToMeetupProposal,
        clearConversationMessages,
        startConversationWithStudent,

        // Safety
        reportModalData,
        openReportModal,
        closeReportModal,
        submitReport,
        blockedUserIds,
        blockUser,
        // Follow & Dossier Profile Viewer
        followedUserIds,
        followLoadingUserIds,
        toggleFollowUser,
        isFollowingUser,
        isFollowLoading,
        viewingProfileUser,
        openUserProfileModal,
        closeUserProfileModal,
        activeStoryUser,
        openStoryViewer,
        closeStoryViewer,

        // Toast & Celebrations
        notificationToast,
        setNotificationToast,
        triggerMatchCelebration,

        // VIP Premium
        userSubscription,
        isPremium,
        isTrial,
        isPremiumModalOpen,
        setIsPremiumModalOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        selectedPlanForCheckout,
        openCheckoutForPlan,
        activateSubscription,
        cancelUserSubscription,
        toggleAutoRenew,
        showPremiumBadgeOnProfile,
        setShowPremiumBadgeOnProfile,

        // Boost
        isProfileBoostActive,
        profileBoostSecondsLeft,
        triggerProfileBoost,

        // Telemetry
        transactions,
        adminMetrics,

        // Theme & Appearance
        theme,
        setTheme,
        toggleTheme,

        // Loading Splash Screen (2s)
        showLoadingScreen,
        setShowLoadingScreen,
        triggerLoadingScreen,

        // 🔐 Authentication & Session
        authUser,
        setAuthUser,
        isAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,

        // Settings Modal
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        settingsInitialTab,
        openSettingsModal,
        closeSettingsModal,
        unblockUser,
        logoutUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
