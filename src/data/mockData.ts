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

export const CURRENT_USER: UserProfile = {
  id: 'me',
  name: 'Jamal Knox',
  age: 23,
  occupationType: 'working_professional',
  college: 'Creative Tech Studio',
  degree: 'Creative Design & Tech',
  year: 'Lead Designer',
  location: 'North Delhi Area',
  locationZone: 'North Delhi Area • Design Studio Block',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
  verifiedCollege: true,
  studentIdVerified: true,
  skills: ['Creative Designer', 'Visual Artist', 'Life Coach', 'Bhangra', 'React / Web Dev', 'Football'],
  interests: ['Editorial Art', 'Design Sprints', 'Photography', 'Fest Competitions', 'Acoustic Jamming'],
  activitiesCompleted: 24,
  requestsPosted: 8,
  recentActivities: [
    {
      id: 'act_1',
      title: '⚽ 6v6 Football Match',
      category: 'Sports',
      date: 'Yesterday • 6:00 PM',
      location: 'DTU Main Football Ground',
      status: 'completed'
    },
    {
      id: 'act_2',
      title: '💃 Zonal Fest Bhangra Rehearsal',
      category: 'Dance',
      date: '2 days ago • 4:00 PM',
      location: 'Main Auditorium Green Room',
      status: 'completed'
    },
    {
      id: 'act_3',
      title: '💻 AI Hackathon UI/UX Design Sprint',
      category: 'Coding',
      date: 'Last Weekend',
      location: 'Tech Commons Block B',
      status: 'completed'
    },
    {
      id: 'act_4',
      title: '📚 Physics & Circuits Midsem Study Group',
      category: 'Study',
      date: 'Ongoing this week',
      location: 'Central Library 2nd Floor',
      status: 'ongoing'
    }
  ],
  bio: 'Visual artist & creative designer. Building aesthetic digital experiences, campus fest visual identities, and interactive spaces.',
  onlineStatus: 'active_now',
  roleTags: ['Creative Designer', 'Visual Artist', 'Life Coach'],
  followersCount: 21348,
  sessionsCount: 5983,
  worksCount: 751,
  moodboardsCount: 38,
  promptsCount: 142,
  moodboardGallery: [
    {
      id: 'mb_1',
      title: 'red lips',
      subtitle: 'SIGNAL ECHO DATA • TOUCH INTERRUPTED',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      tag: 'POSTER 01'
    },
    {
      id: 'mb_2',
      title: 'warm silhouette',
      subtitle: 'CHROMA DATA • VISUAL IDENTITY',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      tag: 'EDITORIAL'
    },
    {
      id: 'mb_3',
      title: 'ethereal noise',
      subtitle: 'CAMPUS ART DIRECTION',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      tag: 'MOODBOARD'
    },
    {
      id: 'mb_4',
      title: 'neon horizon',
      subtitle: 'DIGITAL SCULPTING',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      tag: 'CONCEPT'
    }
  ]
};

export const MOCK_STUDENTS: UserProfile[] = [
  {
    id: 'stu_7',
    name: 'Tanya Sharma',
    age: 21,
    occupationType: 'college_student',
    college: 'Delhi University',
    degree: 'Badminton Player & UI Designer',
    year: '3rd Year',
    location: 'North Delhi Area',
    distanceKm: 0.3,
    distanceDisplay: 'Nearby (~500m)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    verifiedCollege: true,
    studentIdVerified: true,
    skills: ['Badminton', 'UI/UX Design', 'Figma', 'Tennis', 'Photography'],
    interests: ['Badminton Rallies', 'Design Meetups', 'Weekend Tennis', 'Specialty Coffee'],
    activitiesCompleted: 27,
    requestsPosted: 10,
    bio: 'Badminton doubles player and product design student. Looking for morning/evening court sparring partners.',
    locationZone: 'North Delhi Area • Sports Complex',
    onlineStatus: 'active_now'
  },
  {
    id: 'stu_1',
    name: 'Aman Preet',
    age: 21,
    occupationType: 'working_professional',
    college: 'Performers Studio',
    degree: 'Folk Dancer & Fitness Coach',
    year: 'Lead Performer',
    location: 'North Delhi Area',
    distanceKm: 0.4,
    distanceDisplay: 'Nearby (~500m)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    verifiedCollege: true,
    studentIdVerified: true,
    skills: ['Bhangra', 'Folk Dance', 'Gym Training', 'Stage Performance'],
    interests: ['Cultural Fests', 'Powerlifting', 'Punjabi Folk', 'Volleyball'],
    activitiesCompleted: 22,
    requestsPosted: 7,
    bio: 'Lead dancer for Bhangra Troupe. Prepping for cultural fest. Need dancers and practice partners!',
    locationZone: 'North Delhi Area • Cultural Center',
    onlineStatus: 'active_now'
  },
  {
    id: 'stu_8',
    name: 'Dev Kapoor',
    age: 22,
    occupationType: 'working_professional',
    college: 'Calisthenics Delhi',
    degree: 'Strength & Bodyweight Coach',
    year: 'Athlete',
    location: 'North Delhi Area',
    distanceKm: 0.5,
    distanceDisplay: 'Nearby (~500m)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    verifiedCollege: true,
    studentIdVerified: true,
    skills: ['Gym Training', 'Calisthenics', 'Running', 'Handstand', 'Powerlifting'],
    interests: ['Outdoor Workouts', 'Park Calisthenics', 'Sprint Training', 'Nutrition'],
    activitiesCompleted: 35,
    requestsPosted: 14,
    bio: 'Calisthenics & bodyweight workout trainer. Organizing outdoor bar sessions and gym workout meetups.',
    locationZone: 'North Delhi Area • Open Fitness Park',
    onlineStatus: 'active_now'
  },
  {
    id: 'stu_3',
    name: 'Rohan Gupta',
    age: 22,
    occupationType: 'working_professional',
    college: 'Sports Club Delhi',
    degree: 'Football Striker & Athlete',
    year: 'Club Captain',
    location: 'North-West Delhi Area',
    distanceKm: 0.7,
    distanceDisplay: '~Within 1 km',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    verifiedCollege: true,
    studentIdVerified: true,
    skills: ['Football', 'Striker', 'FIFA', 'Running', 'Fitness'],
    interests: ['Football Tournaments', 'FPL', 'Evening Running', 'Turf Games'],
    activitiesCompleted: 31,
    requestsPosted: 12,
    bio: 'Captain for football squad. Organizing casual 7v7 evening matches and weekend turf bookings.',
    locationZone: 'North-West Delhi Area • Sports Hub',
    onlineStatus: 'active_now'
  },
  {
    id: 'stu_6',
    name: 'Siddharth Mehra',
    age: 20,
    occupationType: 'creator_freelancer',
    college: 'Acoustic Collective',
    degree: 'Vocalist & Indie Artist',
    year: 'Songwriter',
    location: 'North Campus Area',
    distanceKm: 0.9,
    distanceDisplay: '~Within 1 km',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    verifiedCollege: true,
    studentIdVerified: true,
    skills: ['Guitar', 'Vocals / Singing', 'Keyboard / Piano', 'Photography'],
    interests: ['Band Performances', 'Acoustic Sessions', 'Film Photography'],
    activitiesCompleted: 15,
    requestsPosted: 4,
    bio: 'Acoustic guitarist and vocalist looking for cajon/drummer and bass player for live music gigs.',
    locationZone: 'North Campus Area • Arts Commons',
    onlineStatus: 'active_now'
  },
  {
    id: 'stu_2',
    name: 'Priya Nair',
    age: 20,
    occupationType: 'creator_freelancer',
    college: 'Physics & Audio Lab',
    degree: 'Robotics & Audio Research',
    year: 'Researcher',
    location: 'South Delhi Area',
    distanceKm: 1.2,
    distanceDisplay: '~1-2 km away',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    verifiedCollege: true,
    studentIdVerified: true,
    skills: ['Physics', 'Electromagnetism', 'Calculus / Math', 'Python', 'Guitar'],
    interests: ['Robotics', 'Indie Music', 'Library Co-Work', 'Chess'],
    activitiesCompleted: 18,
    requestsPosted: 6,
    bio: 'Physics & circuits enthusiast. Organizing group problem-solving sprints for midsem exams at Central Library.',
    locationZone: 'South Delhi Area • Academic Commons',
    onlineStatus: 'active_now'
  },
  {
    id: 'stu_4',
    name: 'Ananya Roy',
    age: 21,
    occupationType: 'creator_freelancer',
    college: 'Design Sprint Studio',
    degree: 'Product Designer & Frontend',
    year: 'UI/UX Creator',
    location: 'West Delhi Area',
    distanceKm: 1.8,
    distanceDisplay: '~1-2 km away',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    verifiedCollege: true,
    studentIdVerified: true,
    skills: ['React / Web Dev', 'UI/UX Design', 'Figma', 'AI / ML', 'Hackathons'],
    interests: ['Hackathons', 'Tech Startups', 'Open Source', 'Matcha Cafe'],
    activitiesCompleted: 16,
    requestsPosted: 9,
    bio: 'Frontend dev & product designer. Building smart web apps. Need backend and AI builders for hackathons.',
    locationZone: 'West Delhi Area • Tech Incubator',
    onlineStatus: 'active_today'
  },
  {
    id: 'stu_5',
    name: 'Kabir Varma',
    age: 21,
    occupationType: 'school_student',
    college: 'Delhi Public School',
    degree: 'Cricket Athlete & Music Producer',
    year: 'Class 12th',
    location: 'NCR Region',
    distanceKm: 2.3,
    distanceDisplay: '~2-3 km away',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    verifiedCollege: true,
    studentIdVerified: true,
    skills: ['Cricket', 'Fast Bowling', 'Gym Training', 'Music Production'],
    interests: ['Cricket Leagues', 'Drumming', 'Audio Engineering', 'Badminton'],
    activitiesCompleted: 24,
    requestsPosted: 8,
    bio: 'Cricket fast bowler and music producer. Always ready for evening net sessions or jamming.',
    locationZone: 'NCR Region • Sports Ground',
    onlineStatus: 'active_today'
  }
];

export const MOCK_CAMPUS_REQUESTS: CampusRequest[] = [
  {
    id: 'req_1',
    title: '⚽ Football Partner / Players Needed',
    category: 'Sports',
    needType: 'Activity',
    date: 'Today',
    time: '6:00 PM',
    location: 'Campus Sports Ground',
    college: 'Delhi Technological University (DTU)',
    distanceKm: 0.4,
    distanceDisplay: 'Campus Grounds • Nearby (~500m)',
    peopleNeeded: 2,
    peopleJoined: 4,
    requiredSkills: ['Football', 'Active Running'],
    description: 'We have 10 players for a 6v6 friendly match on the main turf. Need 2 more players (any position welcome). Boots recommended, bibs provided!',
    creator: {
      id: 'stu_3',
      name: 'Rohan Gupta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      college: 'DTU',
      degree: 'B.Tech IT',
      year: '4th Year',
      verifiedCollege: true
    },
    interestedUsers: [
      {
        id: 'me',
        name: 'Samar Sharma',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        college: 'DTU',
        skills: ['Football', 'Midfielder'],
        note: 'I play midfield! Will reach the ground by 5:55 PM.',
        time: '10m ago',
        status: 'PENDING'
      }
    ],
    isUrgent: true,
    createdAt: '15 mins ago',
    likesCount: 14,
    likedByMe: true,
    commentsCount: 3
  },
  {
    id: 'req_2',
    title: '💃 Bhangra Performer Needed for Fest',
    category: 'Dance',
    needType: 'Person',
    date: 'Tomorrow',
    time: '4:00 PM',
    location: 'Campus Main Auditorium',
    college: 'Delhi Technological University (DTU)',
    distanceKm: 0.2,
    distanceDisplay: 'Campus Grounds • Nearby (~500m)',
    peopleNeeded: 1,
    peopleJoined: 7,
    requiredSkills: ['Bhangra', 'Folk Dance', 'Stage Presence'],
    description: 'Our collegiate Bhangra team is competing in the Zonal Fest. 1 member had an emergency ankle sprain. We need 1 dancer familiar with basic Bhangra steps for final routine rehearsals.',
    creator: {
      id: 'stu_1',
      name: 'Aman Preet',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      college: 'DTU',
      degree: 'B.Tech Mechanical',
      year: '3rd Year',
      verifiedCollege: true
    },
    interestedUsers: [],
    isUrgent: true,
    createdAt: '30 mins ago',
    likesCount: 28,
    likedByMe: false,
    commentsCount: 6
  },
  {
    id: 'req_3',
    title: '📚 Physics & Electromagnetism Study Partner',
    category: 'Study',
    needType: 'Study',
    date: 'Today',
    time: '7:00 PM',
    location: 'Central Academic Library (Quiet Zone)',
    college: 'IIT Delhi',
    distanceKm: 1.8,
    distanceDisplay: 'South Delhi Area • ~1-2 km away',
    peopleNeeded: 2,
    peopleJoined: 1,
    requiredSkills: ['Physics', 'Calculus / Math', 'Problem Solving'],
    description: 'Working through Griffiths Electrodynamics problem sets for next weeks midsems. Looking for 1-2 focused study partners to discuss derivations and solve PYQs together.',
    creator: {
      id: 'stu_2',
      name: 'Priya Nair',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      college: 'IIT Delhi',
      degree: 'B.Tech Electrical',
      year: '2nd Year',
      verifiedCollege: true
    },
    interestedUsers: [],
    isUrgent: false,
    createdAt: '1 hour ago',
    likesCount: 19,
    likedByMe: false,
    commentsCount: 2
  },
  {
    id: 'req_4',
    title: '💻 React & Tailwind Dev for Smart India Hackathon',
    category: 'Coding',
    needType: 'Team',
    date: 'This Weekend',
    time: '10:00 AM',
    location: 'Tech Commons / Online Discord',
    college: 'NSUT Delhi',
    distanceKm: 3.2,
    distanceDisplay: 'West Delhi Area • ~3-4 km away',
    peopleNeeded: 1,
    peopleJoined: 3,
    requiredSkills: ['React / Web Dev', 'UI/UX Design', 'API Integration'],
    description: 'We have our backend (FastAPI + Postgres) and ML model ready for our AI campus navigation problem statement. Need 1 solid frontend builder in React to build clean dashboards.',
    creator: {
      id: 'stu_4',
      name: 'Ananya Roy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      college: 'NSUT Delhi',
      degree: 'B.Tech COE',
      year: '3rd Year',
      verifiedCollege: true
    },
    interestedUsers: [],
    isUrgent: true,
    createdAt: '2 hours ago',
    likesCount: 35,
    likedByMe: true,
    commentsCount: 8
  },
  {
    id: 'req_5',
    title: '🏋️ Gym Spotter for Heavy Chest & Bench Day',
    category: 'Gym',
    needType: 'Person',
    date: 'Today',
    time: '5:15 PM',
    location: 'Campus Fitness Center',
    college: 'Delhi Technological University (DTU)',
    distanceKm: 0.5,
    distanceDisplay: 'Campus Grounds • Nearby (~500m)',
    peopleNeeded: 1,
    peopleJoined: 0,
    requiredSkills: ['Weight Training', 'Bench Spotting'],
    description: 'Aiming for 100kg PR on flat barbell bench press today. Need a reliable lifting buddy/spotter who knows proper handoffs and spotting technique.',
    creator: {
      id: 'stu_1',
      name: 'Aman Preet',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      college: 'DTU',
      degree: 'B.Tech Mechanical',
      year: '3rd Year',
      verifiedCollege: true
    },
    interestedUsers: [],
    isUrgent: false,
    createdAt: '3 hours ago',
    likesCount: 12,
    likedByMe: false,
    commentsCount: 1
  },
  {
    id: 'req_6',
    title: '🏏 Box Cricket at Sports Pitch',
    category: 'Sports',
    needType: 'Activity',
    date: 'Today',
    time: '5:45 PM',
    location: 'Campus Cricket Practice Oval',
    college: 'BITS Pilani',
    distanceKm: 2.1,
    distanceDisplay: 'NCR Region • ~2-3 km away',
    peopleNeeded: 3,
    peopleJoined: 7,
    requiredSkills: ['Cricket', 'Bowling', 'Batting'],
    description: 'Casual 6-over tennis ball cricket match between Hostel 2 and Hostel 3. Need 3 all-rounders or batsmen to balance teams. Freshers warmly welcomed!',
    creator: {
      id: 'stu_5',
      name: 'Kabir Varma',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      college: 'BITS Pilani',
      degree: 'B.E. Computer Science',
      year: '3rd Year',
      verifiedCollege: true
    },
    interestedUsers: [],
    isUrgent: false,
    createdAt: '4 hours ago',
    likesCount: 22,
    likedByMe: false,
    commentsCount: 4
  }
];

export const MOCK_NOTIFICATIONS: CampusNotification[] = [
  {
    id: 'notif_1',
    type: 'skill_match',
    title: '⚡ Skill Match: Bhangra',
    message: 'Aman Preet posted: "💃 Bhangra Performer Needed for Fest" matching your profile skill.',
    time: '25m ago',
    read: false,
    targetRequestId: 'req_2',
    sender: {
      name: 'Aman Preet',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      college: 'DTU'
    }
  },
  {
    id: 'notif_2',
    type: 'nearby_need',
    title: '🔔 Nearby Activity Need',
    message: 'Rohan Gupta needs 2 players for 6:00 PM Football at DTU Sports Ground.',
    time: '1h ago',
    read: false,
    targetRequestId: 'req_1',
    sender: {
      name: 'Rohan Gupta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      college: 'DTU'
    }
  },
  {
    id: 'notif_3',
    type: 'skill_match',
    title: '⚡ Skill Match: Physics',
    message: 'Priya Nair at IIT Delhi is looking for a Physics & Electromagnetism study partner.',
    time: '2h ago',
    read: true,
    targetRequestId: 'req_3',
    sender: {
      name: 'Priya Nair',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      college: 'IIT Delhi'
    }
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    partner: MOCK_STUDENTS[0], // Aman
    lastMessage: 'Awesome! Can you come by Auditorium stage at 4:30 PM for the Bhangra setup?',
    lastMessageTime: '15m ago',
    unreadCount: 1,
    activityContext: {
      requestTitle: '💃 Bhangra Performer Needed',
      matchedDate: 'Today'
    },
    messages: [
      {
        id: 'msg_1',
        senderId: 'stu_1',
        text: 'Hey Samar! Saw you have Bhangra and folk dance listed in your skills.',
        timestamp: '3:10 PM',
        isMine: false,
        isIcebreaker: true
      },
      {
        id: 'msg_2',
        senderId: 'me',
        text: 'Hey Aman! Yes, was part of our school troupe and done zonal fests.',
        timestamp: '3:15 PM',
        isMine: true
      },
      {
        id: 'msg_3',
        senderId: 'stu_1',
        text: 'Awesome! Can you come by Auditorium stage at 4:30 PM for the Bhangra setup?',
        timestamp: '3:18 PM',
        isMine: false,
        safeMeetupProposal: {
          locationName: 'DTU Main Auditorium Green Room',
          time: 'Tomorrow @ 4:30 PM',
          status: 'proposed'
        }
      }
    ]
  },
  {
    id: 'conv_2',
    partner: MOCK_STUDENTS[2], // Rohan
    lastMessage: 'Perfect! See you at the football ground near the bleachers at 5:55 PM.',
    lastMessageTime: '1h ago',
    unreadCount: 0,
    activityContext: {
      requestTitle: '⚽ Football Partner Needed',
      matchedDate: 'Today'
    },
    messages: [
      {
        id: 'msg_101',
        senderId: 'stu_3',
        text: 'Hey! Bringing bibs and 2 match balls. Need you in central midfield!',
        timestamp: '2:15 PM',
        isMine: false
      },
      {
        id: 'msg_102',
        senderId: 'me',
        text: 'Sounds great Rohan, I will warm up by 5:50 PM.',
        timestamp: '2:20 PM',
        isMine: true
      },
      {
        id: 'msg_103',
        senderId: 'stu_3',
        text: 'Perfect! See you at the football ground near the bleachers at 5:55 PM.',
        timestamp: '2:25 PM',
        isMine: false
      }
    ]
  }
];
