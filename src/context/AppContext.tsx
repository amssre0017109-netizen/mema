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
  toggleFollowUser: (userId: string) => void;
  isFollowingUser: (userId: string) => boolean;
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
  settingsInitialTab: 'appearance' | 'help' | 'privacy' | 'preferences' | 'location' | 'premium' | 'terms' | 'logout';
  openSettingsModal: (tab?: 'appearance' | 'help' | 'privacy' | 'preferences' | 'location' | 'premium' | 'terms' | 'logout') => void;
  closeSettingsModal: () => void;
  unblockUser: (userId: string) => void;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [allStudents, setAllStudents] = useState<UserProfile[]>(MOCK_STUDENTS);
  const [campusRequests, setCampusRequests] = useState<CampusRequest[]>(MOCK_CAMPUS_REQUESTS);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<CampusNotification[]>(MOCK_NOTIFICATIONS);

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
  const [followedUserIds, setFollowedUserIds] = useState<string[]>(['stu_1', 'stu_2', 'stu_4']);
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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
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

  // 🔐 Authentication & Session States
  const [authUser, setAuthUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'demo'>('signin');

  const openAuthModal = (mode: 'signin' | 'signup' | 'demo' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Listen to Supabase Auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthUser(session.user);
        if (session.user.user_metadata?.name) {
          setCurrentUser(prev => ({
            ...prev,
            id: session.user.id,
            name: session.user.user_metadata.name || prev.name,
            college: session.user.user_metadata.college || prev.college,
            avatar: session.user.user_metadata.avatar || prev.avatar
          }));
        }
      }
    });

    // Subscribe to auth events (SIGN_IN, SIGN_OUT, TOKEN_REFRESHED)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthUser(session.user);
        if (session.user.user_metadata?.name) {
          setCurrentUser(prev => ({
            ...prev,
            id: session.user.id,
            name: session.user.user_metadata.name || prev.name,
            college: session.user.user_metadata.college || prev.college,
            avatar: session.user.user_metadata.avatar || prev.avatar
          }));
        }
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 🚀 Loading Splash Screen (2s)
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const triggerLoadingScreen = () => {
    setShowLoadingScreen(true);
  };

  // ⚙️ Settings Modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'appearance' | 'help' | 'privacy' | 'preferences' | 'location' | 'premium' | 'terms' | 'logout'>('appearance');

  const openSettingsModal = (tab?: 'appearance' | 'help' | 'privacy' | 'preferences' | 'location' | 'premium' | 'terms' | 'logout') => {
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
    setAuthUser(null);
    setCurrentView('home');
    setIsSettingsModalOpen(false);
    setNotificationToast({
      message: '👋 Logged Out Successfully',
      subtext: 'You have been safely signed out of your MEMA session.'
    });
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
  const toggleFollowUser = (userId: string) => {
    setFollowedUserIds(prev => {
      const isFollowed = prev.includes(userId);
      const updated = isFollowed ? prev.filter(id => id !== userId) : [...prev, userId];
      const targetUser = allStudents.find(s => s.id === userId);
      const targetName = targetUser?.name || 'Member';
      setNotificationToast({
        message: isFollowed ? `Unfollowed ${targetName}` : `Following ${targetName} 🌟`,
        subtext: isFollowed ? `You won't see their updates in your followed stories.` : `You can now see their stories & full profile dossier.`
      });
      return updated;
    });
  };

  const isFollowingUser = (userId: string) => {
    return followedUserIds.includes(userId);
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
        toggleFollowUser,
        isFollowingUser,
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
        isAuthenticated: Boolean(authUser),
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
