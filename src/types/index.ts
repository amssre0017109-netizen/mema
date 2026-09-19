export type RequestCategory =
  | 'Sports'
  | 'Gym'
  | 'Dance'
  | 'Music'
  | 'Coding'
  | 'Study'
  | 'Team'
  | 'Gaming'
  | 'Other';

export type NeedType = 'Activity' | 'Person' | 'Skill' | 'Study' | 'Team' | 'Other';

export interface CampusRequest {
  id: string;
  title: string;
  category: RequestCategory;
  needType: NeedType;
  date: string; // e.g. "Today", "Tomorrow", "Saturday"
  time: string; // e.g. "6:00 PM"
  location: string; // e.g. "College Sports Ground", "Central Library"
  college: string; // e.g. "Delhi Technological University (DTU)"
  distanceKm: number;
  distanceDisplay: string;
  peopleNeeded: number;
  peopleJoined: number;
  requiredSkills: string[]; // e.g. ['Football', 'Striker']
  description: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
    college: string;
    degree?: string;
    year?: string;
    verifiedCollege: boolean;
  };
  interestedUsers: Array<{
    id: string;
    name: string;
    avatar: string;
    college: string;
    skills: string[];
    note?: string;
    time: string;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  }>;
  isUrgent?: boolean;
  createdAt: string;
  likesCount?: number;
  likedByMe?: boolean;
  commentsCount?: number;
}

export type DistanceFilter = 'nearby' | '1km' | '3km' | '5km' | '10km' | 'all';

export type OccupationType = 'school_student' | 'working_professional' | 'creator_freelancer' | 'college_student';

export interface ProfileActivity {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  status: 'completed' | 'ongoing';
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  occupationType?: OccupationType;
  college: string; // e.g. "Delhi Technological University (DTU)" or School or Company
  degree: string; // e.g. "B.Tech Computer Science" or "Class 12th" or "Senior UI Designer"
  year: string; // e.g. "3rd Year", "Science Stream", "3 Yrs Exp"
  location?: string; // e.g. "DTU Campus, Delhi" or "Hauz Khas, New Delhi"
  distanceKm?: number;
  distanceDisplay?: string;
  locationZone: string;
  avatar: string;
  coverImage?: string;
  verifiedCollege: boolean;
  studentIdVerified: boolean;
  skills: string[]; // e.g. ['Bhangra', 'Football', 'React', 'Physics', 'Guitar']
  interests: string[];
  activitiesCompleted: number;
  requestsPosted: number;
  recentActivities?: ProfileActivity[];
  bio: string;
  onlineStatus: 'active_now' | 'active_today' | 'away';
  roleTags?: string[];
  followersCount?: number;
  sessionsCount?: number;
  worksCount?: number;
  moodboardsCount?: number;
  promptsCount?: number;
  moodboardGallery?: Array<{
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    tag?: string;
  }>;
}

export interface CampusNotification {
  id: string;
  type: 'skill_match' | 'nearby_need' | 'interest_received' | 'interest_accepted';
  title: string;
  message: string;
  time: string;
  read: boolean;
  targetRequestId?: string;
  sender?: {
    name: string;
    avatar: string;
    college: string;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  isIcebreaker?: boolean;
  safeMeetupProposal?: {
    locationName: string;
    time: string;
    status: 'proposed' | 'accepted';
  };
}

export interface Conversation {
  id: string;
  partner: UserProfile;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  activityContext?: {
    requestTitle: string;
    matchedDate: string;
  };
  messages: ChatMessage[];
}
