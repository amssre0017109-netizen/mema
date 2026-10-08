import { UserProfile, CampusRequest } from '../types';

export interface ParsedIntent {
  originalQuery: string;
  isNaturalLanguage: boolean;
  activityOrSkill: string | null;
  activityIcon: string;
  peopleCount: number | null;
  proximity: 'nearby' | 'within_1km' | 'within_2km' | 'within_5km' | 'any';
  locationZone: string | null;
  roleOrOccupation: 'school_student' | 'creator_freelancer' | 'working_professional' | null;
  timeOrUrgency: string | null;
  keywords: string[];
  summaryText: string;
}

export interface RankedUserResult {
  student: UserProfile;
  score: number;
  matchPercentage: number;
  matchReason: string;
  highlightPill?: string;
  isTopChoice?: boolean;
  choiceRank?: number;
}

export interface RankedRequestResult {
  request: CampusRequest;
  score: number;
  matchPercentage: number;
  matchReason: string;
}

// =========================================================================
// 1. CONTROLLED BACKEND TOOL: Parse Natural Language Intent
// =========================================================================
const STOP_WORDS = new Set([
  'find', 'me', 'the', 'for', 'and', 'with', 'are', 'you', 'is', 'a', 'an',
  'in', 'at', 'to', 'of', 'some', 'any', 'who', 'please', 'can', 'looking',
  'look', 'needs', 'need', 'want', 'wants', 'partner', 'partners', 'buddy',
  'buddies', 'person', 'people', 'player', 'players', 'near', 'nearby',
  'close', 'around', 'about', 'someone', 'peers', 'two', 'three', 'four',
  '1', '2', '3', '4', 'play', 'plays', 'playing'
]);

const SKILL_DICTIONARY: Array<{ name: string; icon: string; aliases: string[] }> = [
  {
    name: 'Badminton',
    icon: '🏸',
    aliases: ['badminton', 'shuttle', 'racket', 'racquet', 'court sparring', 'doubles partner', 'badminton player', 'badminton players', 'badminton partner']
  },
  {
    name: 'Football',
    icon: '⚽',
    aliases: ['football', 'soccer', 'striker', 'midfielder', 'goalkeeper', 'turf', '7v7', '6v6', '11v11', 'fifa', 'football player', 'football players', 'footballer', 'footballers']
  },
  {
    name: 'Cricket',
    icon: '🏏',
    aliases: ['cricket', 'bowler', 'batsman', 'batting', 'bowling', 'nets', 'box cricket', 'fast bowling', 'cricketer', 'cricketers']
  },
  {
    name: 'React / Web Dev',
    icon: '💻',
    aliases: [
      'react', 'web dev', 'web development', 'developer', 'developers', 'frontend', 'front-end',
      'coding', 'coder', 'coders', 'code', 'javascript', 'typescript', 'software', 'api',
      'fullstack', 'full-stack', 'html', 'css', 'python', 'nextjs', 'node', 'programmer', 'programmers'
    ]
  },
  {
    name: 'UI/UX Design',
    icon: '🎨',
    aliases: [
      'ui/ux', 'ui', 'ux', 'figma', 'design', 'designer', 'designers', 'designing',
      'product design', 'product designer', 'wireframe', 'prototyping', 'visual design', 'creative design'
    ]
  },
  {
    name: 'Gym Training',
    icon: '🏋️',
    aliases: [
      'gym', 'gym training', 'spotter', 'workout', 'workouts', 'bench press', 'calisthenics',
      'fitness', 'weight training', 'powerlifting', 'lifting', 'bodybuilding', 'bodyweight',
      'handstand', 'trainer', 'trainers', 'gym buddy', 'gym partner'
    ]
  },
  {
    name: 'Guitar',
    icon: '🎸',
    aliases: ['guitar', 'acoustic', 'guitarist', 'guitarists', 'jamming', 'chords', 'fingerstyle', 'electric guitar', 'lead guitar']
  },
  {
    name: 'Vocals / Singing',
    icon: '🎤',
    aliases: ['singing', 'singer', 'singers', 'vocals', 'vocalist', 'vocalists', 'music', 'band', 'song', 'songwriter', 'music producer', 'music production']
  },
  {
    name: 'Bhangra',
    icon: '💃',
    aliases: ['bhangra', 'dance', 'dancer', 'dancers', 'dancing', 'folk dance', 'choreography', 'choreographer', 'fest performance']
  },
  {
    name: 'Physics',
    icon: '📚',
    aliases: ['physics', 'electromagnetism', 'circuits', 'study partner', 'problem solving', 'math', 'mathematics', 'calculus', 'midsem', 'exam', 'study', 'academics', 'research', 'robotics']
  },
  {
    name: 'AI / ML',
    icon: '🤖',
    aliases: ['ai', 'ml', 'machine learning', 'deep learning', 'model', 'data science', 'artificial intelligence', 'neural network']
  },
  {
    name: 'Hackathons',
    icon: '⚡',
    aliases: ['hackathon', 'hackathons', 'sih', 'tech sprint', 'hackathon team', 'team builder']
  },
  {
    name: 'Tennis',
    icon: '🎾',
    aliases: ['tennis', 'lawn tennis', 'tennis player', 'rallies']
  },
  {
    name: 'Photography',
    icon: '📸',
    aliases: ['photography', 'photographer', 'photo', 'photos', 'film photography', 'camera', 'portrait']
  },
  {
    name: 'Running',
    icon: '🏃',
    aliases: ['running', 'runner', 'runners', 'sprint', 'athletics', 'cardio']
  }
];

export function tool_parse_intent(rawQuery: string): ParsedIntent {
  const q = (rawQuery || '').trim().toLowerCase();

  if (!q) {
    return {
      originalQuery: '',
      isNaturalLanguage: false,
      activityOrSkill: null,
      activityIcon: '🔍',
      peopleCount: null,
      proximity: 'any',
      locationZone: null,
      roleOrOccupation: null,
      timeOrUrgency: null,
      keywords: [],
      summaryText: ''
    };
  }

  // Detect Natural Language vs Single Keyword
  const nlTriggers = [
    'find', 'look', 'need', 'search', 'want', 'partner', 'buddy', 'near',
    'who', 'where', 'anyone', 'for', 'with', 'me', 'two', 'three', 'pair', 'team'
  ];
  const wordCount = q.split(/\s+/).length;
  const hasNlTrigger = nlTriggers.some(t => q.includes(t));
  const isNaturalLanguage = wordCount >= 3 || hasNlTrigger;

  // 1. Skill & Activity Extraction
  let activityOrSkill: string | null = null;
  let activityIcon = '✨';

  for (const s of SKILL_DICTIONARY) {
    if (s.aliases.some(alias => q.includes(alias))) {
      activityOrSkill = s.name;
      activityIcon = s.icon;
      break;
    }
  }

  // 2. People Count Extraction
  let peopleCount: number | null = null;
  const countRegex = /(?:(\d+)\s*(?:people|partners?|players?|buddies|buddy|devs?|coders?|members?|person|freelancers?))|(?:find\s*(?:me)?\s*(\d+))/i;
  const countMatch = q.match(countRegex);
  if (countMatch) {
    const num = parseInt(countMatch[1] || countMatch[2], 10);
    if (!isNaN(num) && num > 0 && num <= 10) {
      peopleCount = num;
    }
  } else if (q.includes('two') || q.includes('pair') || q.includes('couple') || q.includes(' 2 ') || q.startsWith('2 ') || q.endsWith(' 2')) {
    peopleCount = 2;
  } else if (q.includes('three') || q.includes('trio') || q.includes(' 3 ') || q.startsWith('3 ') || q.endsWith(' 3')) {
    peopleCount = 3;
  } else if (q.includes('four') || q.includes(' 4 ') || q.startsWith('4 ') || q.endsWith(' 4')) {
    peopleCount = 4;
  } else if (q.includes('one') || q.includes('single') || q.includes(' 1 ') || q.includes('a partner') || q.includes('a spotter')) {
    peopleCount = 1;
  }

  // 3. Proximity & Distance Radius Extraction
  let proximity: ParsedIntent['proximity'] = 'any';
  if (q.includes('near me') || q.includes('nearby') || q.includes('close by') || q.includes('around me') || q.includes('near')) {
    proximity = 'nearby';
  } else if (q.includes('within 1km') || q.includes('1km') || q.includes('1 km') || q.includes('< 1km')) {
    proximity = 'within_1km';
  } else if (q.includes('within 2km') || q.includes('2km') || q.includes('2 km')) {
    proximity = 'within_2km';
  } else if (q.includes('within 5km') || q.includes('5km') || q.includes('5 km')) {
    proximity = 'within_5km';
  }

  // 4. Location Zone Extraction
  let locationZone: string | null = null;
  const zones = [
    { key: 'dtu', label: 'Delhi Technological University (DTU)' },
    { key: 'nsut', label: 'NSUT Delhi' },
    { key: 'iit', label: 'IIT Delhi' },
    { key: 'north campus', label: 'North Campus Area' },
    { key: 'south delhi', label: 'South Delhi Area' },
    { key: 'west delhi', label: 'West Delhi Area' },
    { key: 'library', label: 'Central Library' },
    { key: 'ground', label: 'Sports Ground' },
    { key: 'turf', label: 'Sports Turf' }
  ];
  for (const z of zones) {
    if (q.includes(z.key)) {
      locationZone = z.label;
      break;
    }
  }

  // 5. Role / Occupation Preference
  let roleOrOccupation: ParsedIntent['roleOrOccupation'] = null;
  if (q.includes('school') || q.includes('student')) {
    roleOrOccupation = 'school_student';
  } else if (q.includes('freelancer') || q.includes('creator')) {
    roleOrOccupation = 'creator_freelancer';
  } else if (q.includes('pro') || q.includes('professional') || q.includes('working')) {
    roleOrOccupation = 'working_professional';
  }

  // 6. Time / Urgency
  let timeOrUrgency: string | null = null;
  if (q.includes('today') || q.includes('tonight') || q.includes('now') || q.includes('urgent') || q.includes('asap')) {
    timeOrUrgency = 'Today / Urgent';
  } else if (q.includes('tomorrow')) {
    timeOrUrgency = 'Tomorrow';
  } else if (q.includes('weekend') || q.includes('saturday') || q.includes('sunday')) {
    timeOrUrgency = 'This Weekend';
  }

  // 7. Meaningful Keywords breakdown (filtering out stop words)
  const allTokens = q
    .replace(/[^\w\s]/gi, ' ')
    .split(/\s+/)
    .filter(t => t.length > 0);

  const cleanTokens = allTokens.filter(t => !STOP_WORDS.has(t));
  const finalKeywords = cleanTokens.length > 0 ? cleanTokens : allTokens;

  // 8. Natural Summary Pill
  const summaryParts: string[] = [];
  if (activityOrSkill) summaryParts.push(`${activityIcon} ${activityOrSkill}`);
  if (peopleCount) summaryParts.push(`👥 ${peopleCount} Partner${peopleCount > 1 ? 's' : ''}`);
  if (proximity === 'nearby' || proximity === 'within_1km') summaryParts.push(`📍 Near you (< 1km)`);
  else if (proximity === 'within_2km') summaryParts.push(`📍 Within 2km`);
  if (locationZone) summaryParts.push(`🏢 ${locationZone}`);
  if (timeOrUrgency) summaryParts.push(`⏰ ${timeOrUrgency}`);

  const summaryText = summaryParts.length > 0
    ? summaryParts.join(' • ')
    : (activityOrSkill || finalKeywords.slice(0, 3).join(', '));

  return {
    originalQuery: rawQuery,
    isNaturalLanguage,
    activityOrSkill,
    activityIcon,
    peopleCount,
    proximity,
    locationZone,
    roleOrOccupation,
    timeOrUrgency,
    keywords: finalKeywords,
    summaryText
  };
}

// =========================================================================
// 2. CONTROLLED BACKEND TOOL: Search & Rank Users Inside Find People UI
// =========================================================================
export function tool_search_and_rank_users(
  intent: ParsedIntent,
  allStudents: UserProfile[],
  currentUser?: UserProfile
): RankedUserResult[] {
  const rawQ = intent.originalQuery.trim().toLowerCase();

  if (!rawQ) {
    return allStudents
      .filter(s => s.id !== currentUser?.id)
      .sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99))
      .map(student => ({
        student,
        score: 50,
        matchPercentage: 90,
        matchReason: `📍 ${student.distanceDisplay || student.location || 'Nearby Area'}`
      }));
  }

  const results: RankedUserResult[] = [];
  const searchTokens = intent.keywords;

  for (const student of allStudents) {
    if (currentUser && student.id === currentUser.id) continue;

    let score = 0;
    let hasContentMatch = false;
    const reasons: string[] = [];

    const studentName = student.name.toLowerCase();
    const nameWords = studentName.split(/\s+/);
    const studentBio = (student.bio || '').toLowerCase();
    const studentDegree = (student.degree || '').toLowerCase();
    const studentCollege = (student.college || '').toLowerCase();
    const studentLocation = (student.location || '').toLowerCase();
    const studentLocationZone = (student.locationZone || '').toLowerCase();
    const studentSkillsLower = student.skills.map(s => s.toLowerCase());
    const studentInterestsLower = (student.interests || []).map(i => i.toLowerCase());

    // -----------------------------------------------------------------------
    // A. EXACT & PARTIAL NAME MATCHING (Top Priority: e.g. "Tanya", "tanya", "Tan")
    // -----------------------------------------------------------------------
    if (studentName === rawQ) {
      score += 250;
      hasContentMatch = true;
      reasons.push(`👤 ${student.name}`);
    } else if (studentName.includes(rawQ)) {
      score += 200;
      hasContentMatch = true;
      reasons.push(`👤 ${student.name}`);
    } else if (nameWords.some(w => w.startsWith(rawQ))) {
      score += 180;
      hasContentMatch = true;
      reasons.push(`👤 ${student.name}`);
    }

    // Check each search token against name
    for (const token of searchTokens) {
      if (token.length >= 2) {
        if (studentName.includes(token)) {
          score += 120;
          hasContentMatch = true;
          if (!reasons.some(r => r.includes(student.name))) reasons.push(`👤 ${student.name}`);
        } else if (nameWords.some(w => w.startsWith(token))) {
          score += 100;
          hasContentMatch = true;
          if (!reasons.some(r => r.includes(student.name))) reasons.push(`👤 ${student.name}`);
        }
      }
    }

    // -----------------------------------------------------------------------
    // B. DIRECT SKILL & ALIAS MATCHING (e.g. "badminton", "football", "designer")
    // -----------------------------------------------------------------------
    const matchedDirectSkill = student.skills.find(s => {
      const sLow = s.toLowerCase();
      if (rawQ.length <= 3) {
        return sLow.split(/[\s/]+/).some(w => w.startsWith(rawQ));
      }
      return sLow === rawQ || sLow.includes(rawQ) || rawQ.includes(sLow);
    });

    if (matchedDirectSkill) {
      score += 150;
      hasContentMatch = true;
      reasons.push(`⚡ Skill: ${matchedDirectSkill}`);
    }

    // Check tokens against student skills
    for (const token of searchTokens) {
      if (token.length >= 2) {
        const foundSkill = student.skills.find(s => {
          const sLow = s.toLowerCase();
          if (token.length <= 3) {
            return sLow.split(/[\s/]+/).some(w => w.startsWith(token));
          }
          return sLow.includes(token) || sLow.split(/[\s/]+/).some(w => w.startsWith(token));
        });
        if (foundSkill) {
          score += 100;
          hasContentMatch = true;
          const label = `⚡ Skill: ${foundSkill}`;
          if (!reasons.includes(label)) reasons.push(label);
        }
      }
    }

    // -----------------------------------------------------------------------
    // C. SEMANTIC SKILL / NLP ACTIVITY INTENT (e.g. "find me 2 badminton partners")
    // -----------------------------------------------------------------------
    if (intent.activityOrSkill) {
      const targetSkill = intent.activityOrSkill.toLowerCase();
      const hasExactSkill = studentSkillsLower.some(
        s => s === targetSkill || s.includes(targetSkill) || targetSkill.includes(s)
      );
      const hasInterest = studentInterestsLower.some(
        i => i.includes(targetSkill) || targetSkill.includes(i)
      );
      const hasDegreeOrBio = studentDegree.includes(targetSkill) || studentBio.includes(targetSkill);

      if (hasExactSkill) {
        score += 140;
        hasContentMatch = true;
        const pill = `${intent.activityIcon} Skill: ${intent.activityOrSkill}`;
        if (!reasons.includes(pill)) reasons.push(pill);
      } else if (hasInterest) {
        score += 80;
        hasContentMatch = true;
        const pill = `✨ Interested in ${intent.activityOrSkill}`;
        if (!reasons.includes(pill)) reasons.push(pill);
      } else if (hasDegreeOrBio) {
        score += 60;
        hasContentMatch = true;
        const pill = `🎓 ${intent.activityOrSkill} Background`;
        if (!reasons.includes(pill)) reasons.push(pill);
      }
    }

    // -----------------------------------------------------------------------
    // D. DEGREE, PROFESSION & ROLE MATCHING (e.g. "Product Designer", "Striker")
    // -----------------------------------------------------------------------
    const degreeMatches = rawQ.length <= 3
      ? studentDegree.split(/\s+/).some(w => w.startsWith(rawQ))
      : studentDegree.includes(rawQ);

    if (degreeMatches) {
      score += 110;
      hasContentMatch = true;
      reasons.push(`🎓 ${student.degree}`);
    } else {
      for (const token of searchTokens) {
        if (token.length >= 3 && studentDegree.includes(token)) {
          score += 70;
          hasContentMatch = true;
          const label = `🎓 ${student.degree}`;
          if (!reasons.includes(label)) reasons.push(label);
          break;
        }
      }
    }

    // -----------------------------------------------------------------------
    // E. INTERESTS MATCHING
    // -----------------------------------------------------------------------
    const matchedInterest = student.interests.find(i => {
      const iLow = i.toLowerCase();
      if (rawQ.length <= 3) {
        return iLow.split(/\s+/).some(w => w.startsWith(rawQ));
      }
      return iLow.includes(rawQ) || (searchTokens.length > 0 && searchTokens.some(t => t.length >= 3 && iLow.includes(t)));
    });
    if (matchedInterest) {
      score += 75;
      hasContentMatch = true;
      const label = `✨ ${matchedInterest}`;
      if (!reasons.includes(label)) reasons.push(label);
    }

    // -----------------------------------------------------------------------
    // F. BIO & LOCATION MATCHING
    // -----------------------------------------------------------------------
    if (rawQ.length > 3 && studentBio.includes(rawQ)) {
      score += 60;
      hasContentMatch = true;
      reasons.push(`📝 Bio Match`);
    }

    if (intent.locationZone) {
      const zLow = intent.locationZone.toLowerCase();
      if (studentLocation.includes(zLow) || studentLocationZone.includes(zLow) || studentCollege.includes(zLow)) {
        score += 50;
        hasContentMatch = true;
        reasons.push(`🏢 ${intent.locationZone}`);
      }
    }

    // -----------------------------------------------------------------------
    // G. ROLE / OCCUPATION FILTER BOOST
    // -----------------------------------------------------------------------
    if (intent.roleOrOccupation && student.occupationType === intent.roleOrOccupation) {
      score += 20;
    }

    // -----------------------------------------------------------------------
    // H. PROXIMITY BOOST (Only applied if the user already has a content match)
    // -----------------------------------------------------------------------
    if (hasContentMatch && score > 0) {
      const dist = student.distanceKm ?? 99;
      if (intent.proximity === 'nearby' || intent.proximity === 'within_1km') {
        if (dist <= 0.8) {
          score += 35;
          reasons.push(`📍 Nearby (~${Math.round(dist * 1000)}m)`);
        } else if (dist <= 1.2) {
          score += 20;
          reasons.push(`📍 Within 1 km`);
        }
      } else {
        if (dist <= 1.0) score += 10;
      }

      if (student.verifiedCollege) score += 5;
      if (student.onlineStatus === 'active_now') score += 5;

      const matchPercentage = Math.min(99, Math.max(75, Math.round(70 + (score / 280) * 29)));
      const matchReason = reasons.length > 0
        ? reasons.slice(0, 2).join(' • ')
        : `📍 ${student.distanceDisplay || student.location || 'Nearby'}`;

      results.push({
        student,
        score,
        matchPercentage,
        matchReason,
        highlightPill: reasons[0]
      });
    }
  }

  // Sort strictly by relevance score descending, secondary by distance
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (a.student.distanceKm ?? 99) - (b.student.distanceKm ?? 99);
  });

  // Flag top N choices
  const targetCount = intent.peopleCount || (results.length > 0 ? 1 : 0);
  results.forEach((res, index) => {
    if (index < targetCount && res.score >= 50) {
      res.isTopChoice = true;
      res.choiceRank = index + 1;
    }
  });

  return results;
}

// =========================================================================
// 3. CONTROLLED BACKEND TOOL: Search & Rank Requests (Home Feed)
// =========================================================================
export function tool_search_and_rank_requests(
  intent: ParsedIntent,
  requests: CampusRequest[]
): RankedRequestResult[] {
  const rawQ = intent.originalQuery.trim().toLowerCase();

  if (!rawQ) {
    return requests.map(req => ({
      request: req,
      score: 50,
      matchPercentage: 90,
      matchReason: `📍 ${req.location}`
    }));
  }

  const results: RankedRequestResult[] = [];

  for (const req of requests) {
    let score = 0;
    let hasContentMatch = false;
    const reasons: string[] = [];

    const reqTitle = req.title.toLowerCase();
    const reqDesc = req.description.toLowerCase();
    const reqCategory = req.category.toLowerCase();
    const reqLocation = req.location.toLowerCase();
    const reqCollege = (req.college || '').toLowerCase();
    const reqCreator = (req.creator?.name || '').toLowerCase();

    // 1. Direct Whole Query Match
    if (reqTitle.includes(rawQ)) {
      score += 100;
      hasContentMatch = true;
      reasons.push(`Title Match`);
    } else if (reqCategory.includes(rawQ)) {
      score += 90;
      hasContentMatch = true;
      reasons.push(`${req.category} Plan`);
    } else if (req.requiredSkills.some(s => s.toLowerCase().includes(rawQ) || rawQ.includes(s.toLowerCase()))) {
      score += 85;
      hasContentMatch = true;
      const sk = req.requiredSkills.find(s => s.toLowerCase().includes(rawQ) || rawQ.includes(s.toLowerCase()));
      reasons.push(`Skill: ${sk}`);
    } else if (reqDesc.includes(rawQ) || reqLocation.includes(rawQ) || reqCollege.includes(rawQ) || reqCreator.includes(rawQ)) {
      score += 70;
      hasContentMatch = true;
      reasons.push(`Activity Match`);
    }

    // 2. Semantic Activity / Skill Match from Intent
    if (intent.activityOrSkill) {
      const target = intent.activityOrSkill.toLowerCase();
      const inTitle = reqTitle.includes(target);
      const inCategory = reqCategory.includes(target);
      const inSkills = req.requiredSkills.some(s => s.toLowerCase().includes(target));

      if (inTitle || inCategory) {
        score += 60;
        hasContentMatch = true;
        reasons.push(`${intent.activityIcon} ${req.category} Plan`);
      } else if (inSkills) {
        score += 45;
        hasContentMatch = true;
        reasons.push(`Requires ${intent.activityOrSkill}`);
      }
    }

    // 3. Keywords Match
    if (intent.keywords.length > 0) {
      for (const kw of intent.keywords) {
        if (reqTitle.includes(kw)) {
          score += 40;
          hasContentMatch = true;
        } else if (reqCategory.includes(kw)) {
          score += 35;
          hasContentMatch = true;
        } else if (req.requiredSkills.some(s => s.toLowerCase().includes(kw))) {
          score += 30;
          hasContentMatch = true;
        } else if (reqDesc.includes(kw) || reqLocation.includes(kw) || reqCreator.includes(kw)) {
          score += 20;
          hasContentMatch = true;
        }
      }
    }

    // 4. Proximity Boost (only if content matched)
    if (hasContentMatch) {
      const dist = req.distanceKm ?? 99;
      if (intent.proximity === 'nearby' && dist <= 1.0) {
        score += 20;
        reasons.push(`📍 On Campus Grounds`);
      }

      const matchPercentage = Math.min(99, Math.max(72, Math.round(65 + (score / 130) * 34)));
      results.push({
        request: req,
        score,
        matchPercentage,
        matchReason: reasons[0] || `📍 ${req.location}`
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}
