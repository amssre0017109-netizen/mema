import { CampusRequest, UserProfile, Conversation, CampusNotification } from '../types';

export const CAMPUS_OPTIONS = [
  'All Campuses & Nearby',
  'Delhi Technological University (DTU)',
  'IIT Delhi',
  'Netaji Subhas University of Technology (NSUT)',
  'BITS Pilani',
  'Delhi University (North Campus)',
  'IIIT Delhi',
  'Manipal University',
  'Christ University',
  'SRM University'
];

export const SKILL_CATEGORIES = [
  { id: 'Sports', name: 'Sports', icon: '⚽', tags: ['Football', 'Cricket', 'Badminton', 'Basketball', 'Table Tennis', 'Volleyball'] },
  { id: 'Gym', name: 'Gym / Fitness', icon: '🏋️', tags: ['Weight Training', 'Powerlifting', 'Calisthenics', 'Running', 'Crossfit'] },
  { id: 'Dance', name: 'Dance', icon: '💃', tags: ['Bhangra', 'Hip Hop', 'Contemporary', 'Kathak', 'Western Freestyle'] },
  { id: 'Music', name: 'Music', icon: '🎵', tags: ['Guitar', 'Vocals / Singing', 'Keyboard / Piano', 'Drums', 'Music Production'] },
  { id: 'Coding', name: 'Coding & Tech', icon: '💻', tags: ['React / Web Dev', 'Python', 'AI / ML', 'DSA & LeetCode', 'Flutter / Mobile', 'Smart Contracts'] },
  { id: 'Study', name: 'Study & Academics', icon: '📚', tags: ['Physics', 'Calculus / Math', 'Data Structures', 'Organic Chemistry', 'CAT / Gate Prep', 'Finance'] },
  { id: 'Team', name: 'Teams & Projects', icon: '🤝', tags: ['Hackathon Team', 'Fest Committee', 'Society Auditions', 'Case Competitions'] },
  { id: 'Gaming', name: 'Gaming', icon: '🎮', tags: ['Valorant', 'BGMI', 'FIFA', 'CS2', 'Chess'] },
  { id: 'Other', name: 'Other Skills', icon: '✨', tags: ['Photography', 'Video Editing', 'UI/UX Design', 'Public Speaking'] }
];

export const GUEST_USER: UserProfile = {
  id: 'guest',
  name: 'Guest Explorer',
  age: 20,
  occupationType: 'school_student',
  college: 'Campus Guest',
  degree: 'Visitor',
  year: 'Guest',
  location: 'Campus Area',
  locationZone: 'Campus Feed',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
  verifiedCollege: false,
  studentIdVerified: false,
  skills: ['Exploring MEMA'],
  interests: ['Campus Activities', 'Meetups'],
  activitiesCompleted: 0,
  requestsPosted: 0,
  recentActivities: [],
  bio: 'Exploring MEMA campus network.',
  onlineStatus: 'active_now',
  isGuest: true
};

export const CURRENT_USER: UserProfile = {
  id: 'me',
  name: 'Member',
  age: 21,
  occupationType: 'working_professional',
  college: 'Connaught Place, New Delhi',
  degree: 'Member',
  year: '1st Year',
  location: 'Connaught Place, New Delhi',
  locationZone: 'Connaught Place, New Delhi',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
  verifiedCollege: true,
  studentIdVerified: true,
  skills: [],
  interests: [],
  activitiesCompleted: 0,
  requestsPosted: 0,
  recentActivities: [],
  bio: '',
  onlineStatus: 'active_now',
  roleTags: [],
  followersCount: 0,
  sessionsCount: 0,
  worksCount: 0,
  moodboardsCount: 0,
  promptsCount: 0,
  moodboardGallery: []
};

export const MOCK_STUDENTS: UserProfile[] = [];

export const MOCK_CAMPUS_REQUESTS: CampusRequest[] = [];

export const MOCK_NOTIFICATIONS: CampusNotification[] = [];

export const MOCK_CONVERSATIONS: Conversation[] = [];
