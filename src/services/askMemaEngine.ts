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

  const skillDictionary: Array<{ name: string; icon: string; aliases: string[] }> = [
    {
      name: 'Badminton',
      icon: '🏸',
      aliases: ['badminton', 'shuttle', 'racket', 'court sparring', 'doubles partner']
    },
    {
      name: 'Football',
      icon: '⚽',
      aliases: ['football', 'soccer', 'striker', 'midfielder', 'goalkeeper', 'turf', '7v7', '6v6', 'fifa']
    },
    {
      name: 'Cricket',
      icon: '🏏',
      aliases: ['cricket', 'bowler', 'batsman', 'batting', 'bowling', 'nets', 'box cricket', 'fast bowling']
    },
    {
      name: 'React / Web Dev',
      icon: '💻',
      aliases: ['react', 'web dev', 'developer', 'frontend', 'coding', 'code', 'javascript', 'typescript', 'software', 'api', 'fullstack']
    },
    {
      name: 'UI/UX Design',
      icon: '🎨',
      aliases: ['ui/ux', 'ui', 'ux', 'figma', 'design', 'designer', 'product design', 'wireframe']
    },
    {
      name: 'Gym Training',
      icon: '🏋️',
      aliases: ['gym', 'spotter', 'workout', 'bench press', 'calisthenics', 'fitness', 'weight training', 'lifting', 'pr']
    },
    {
      name: 'Guitar',
      icon: '🎸',
      aliases: ['guitar', 'acoustic', 'guitarist', 'jamming', 'chords', 'fingerstyle']
    },
    {
      name: 'Vocals / Singing',
      icon: '🎤',
      aliases: ['singing', 'singer', 'vocals', 'vocalist', 'music', 'band']
    },
    {
      name: 'Bhangra',
      icon: '💃',
      aliases: ['bhangra', 'dance', 'dancer', 'folk dance', 'choreography', 'fest']
    },
    {
      name: 'Physics',
      icon: '📚',
      aliases: ['physics', 'electromagnetism', 'circuits', 'study partner', 'problem solving', 'math', 'calculus', 'midsem', 'exam']
    },
    {
      name: 'AI / ML',
      icon: '🤖',
      aliases: ['ai', 'ml', 'machine learning', 'deep learning', 'python', 'model']
    },
    {
      name: 'Hackathons',
      icon: '⚡',
      aliases: ['hackathon', 'sih', 'tech sprint', 'hackathon team', 'team builder']
    }
  ];

  for (const s of skillDictionary) {
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
  } else if (q.includes('two') || q.includes('pair') || q.includes('couple') || q.includes('2')) {
    peopleCount = 2;
  } else if (q.includes('three') || q.includes('trio') || q.includes('3')) {
    peopleCount = 3;
  } else if (q.includes('four') || q.includes('4')) {
    peopleCount = 4;
  } else if (q.includes('one') || q.includes('single') || q.includes('1') || q.includes('a partner') || q.includes('a spotter')) {
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

  // 7. Keywords breakdown
  const cleanTokens = q
    .replace(/[^\w\s]/gi, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !['find', 'me', 'the', 'for', 'and', 'with', 'are', 'you'].includes(t));

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
    : (activityOrSkill || cleanTokens.slice(0, 3).join(', '));

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
    keywords: cleanTokens,
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
  if (!intent.originalQuery.trim()) {
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

  for (const student of allStudents) {
    if (currentUser && student.id === currentUser.id) continue;

    let score = 0;
    const reasons: string[] = [];

    // A. Skill / Activity Match (Highest weight: 50 pts)
    if (intent.activityOrSkill) {
      const targetSkill = intent.activityOrSkill.toLowerCase();
      const hasExactSkill = student.skills.some(
        s => s.toLowerCase() === targetSkill || s.toLowerCase().includes(targetSkill) || targetSkill.includes(s.toLowerCase())
      );
      const hasInterest = student.interests.some(
        i => i.toLowerCase().includes(targetSkill) || targetSkill.includes(i.toLowerCase())
      );
      const hasBioMatch = (student.bio || '').toLowerCase().includes(targetSkill) ||
                          (student.degree || '').toLowerCase().includes(targetSkill);

      if (hasExactSkill) {
        score += 50;
        reasons.push(`${intent.activityIcon} Top Skill: ${intent.activityOrSkill}`);
      } else if (hasInterest) {
        score += 30;
        reasons.push(`Interested in ${intent.activityOrSkill}`);
      } else if (hasBioMatch) {
        score += 20;
        reasons.push(`Experience in ${intent.activityOrSkill}`);
      }
    }

    // B. Keyword Fallback Match (If no single activity recognized or for general keywords)
    if (intent.keywords.length > 0) {
      let matchedKeywordCount = 0;
      for (const kw of intent.keywords) {
        const inName = student.name.toLowerCase().includes(kw);
        const inSkills = student.skills.some(s => s.toLowerCase().includes(kw));
        const inInterests = student.interests.some(i => i.toLowerCase().includes(kw));
        const inBio = (student.bio || '').toLowerCase().includes(kw);
        const inLocation = (student.location || '').toLowerCase().includes(kw) || (student.college || '').toLowerCase().includes(kw);

        if (inName) { score += 35; matchedKeywordCount++; }
        else if (inSkills) { score += 30; matchedKeywordCount++; }
        else if (inInterests) { score += 20; matchedKeywordCount++; }
        else if (inBio || inLocation) { score += 15; matchedKeywordCount++; }
      }
    }

    // C. Proximity Scoring (Up to 35 pts)
    const dist = student.distanceKm ?? 99;
    if (intent.proximity === 'nearby' || intent.proximity === 'within_1km') {
      if (dist <= 0.8) {
        score += 35;
        reasons.push(`📍 Super Close (~${Math.round(dist * 1000)}m away)`);
      } else if (dist <= 1.2) {
        score += 25;
        reasons.push(`📍 Within 1 km`);
      } else if (dist <= 2.0) {
        score += 10;
      }
    } else if (intent.proximity === 'within_2km') {
      if (dist <= 2.0) {
        score += 30;
        reasons.push(`📍 Within 2 km`);
      }
    } else {
      // Default subtle proximity bonus
      if (dist <= 1.0) score += 15;
      else if (dist <= 2.0) score += 8;
    }

    // D. Location Zone / Campus Match (20 pts)
    if (intent.locationZone) {
      const zoneKey = intent.locationZone.toLowerCase();
      const inZone = (student.location || '').toLowerCase().includes(zoneKey) ||
                     (student.college || '').toLowerCase().includes(zoneKey) ||
                     (student.locationZone || '').toLowerCase().includes(zoneKey);
      if (inZone) {
        score += 20;
        reasons.push(`🏢 At ${intent.locationZone}`);
      }
    }

    // E. Role / Occupation Match (15 pts)
    if (intent.roleOrOccupation && student.occupationType === intent.roleOrOccupation) {
      score += 15;
      reasons.push(`Matched Profile Type`);
    }

    // F. Activity & Verification Bonuses
    if (student.verifiedCollege) score += 5;
    if (student.onlineStatus === 'active_now') score += 5;

    // Filter threshold: Must have some relevance if query was provided
    if (score > 0) {
      // Compute human-friendly match percentage (65% - 98%)
      const matchPercentage = Math.min(98, Math.max(68, Math.round(60 + (score / 120) * 38)));
      const matchReason = reasons.length > 0 ? reasons.slice(0, 2).join(' • ') : `📍 ${student.distanceDisplay || student.location || 'Nearby'}`;

      results.push({
        student,
        score,
        matchPercentage,
        matchReason,
        highlightPill: reasons[0]
      });
    }
  }

  // Sort by score descending, then distance
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (a.student.distanceKm ?? 99) - (b.student.distanceKm ?? 99);
  });

  // Flag top N choices if people count was requested
  const targetCount = intent.peopleCount || (results.length > 0 ? 1 : 0);
  results.forEach((res, index) => {
    if (index < targetCount && res.score >= 35) {
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
  if (!intent.originalQuery.trim()) {
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
    const reasons: string[] = [];

    // Match Activity / Skill
    if (intent.activityOrSkill) {
      const target = intent.activityOrSkill.toLowerCase();
      const inTitle = req.title.toLowerCase().includes(target);
      const inCategory = req.category.toLowerCase().includes(target);
      const inSkills = req.requiredSkills.some(s => s.toLowerCase().includes(target));

      if (inTitle || inCategory) {
        score += 50;
        reasons.push(`${intent.activityIcon} ${req.category} Plan`);
      } else if (inSkills) {
        score += 35;
        reasons.push(`Requires ${intent.activityOrSkill}`);
      }
    }

    // Keyword matching
    for (const kw of intent.keywords) {
      if (req.title.toLowerCase().includes(kw)) score += 30;
      else if (req.description.toLowerCase().includes(kw)) score += 20;
      else if (req.location.toLowerCase().includes(kw)) score += 15;
    }

    // Proximity
    const dist = req.distanceKm ?? 99;
    if (intent.proximity === 'nearby' && dist <= 1.0) {
      score += 25;
      reasons.push(`📍 On Campus Grounds`);
    }

    if (score > 0) {
      const matchPercentage = Math.min(98, Math.max(70, Math.round(65 + (score / 100) * 33)));
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
