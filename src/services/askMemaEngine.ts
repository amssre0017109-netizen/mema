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
      aliases: ['react', 'web dev', 'developer', 'frontend', 'coding', 'code', 'javascript', 'typescript', 'software', 'api', 'fullstack', 'html', 'css', 'python']
    },
    {
      name: 'UI/UX Design',
      icon: '🎨',
      aliases: ['ui/ux', 'ui', 'ux', 'figma', 'design', 'designer', 'product design', 'wireframe']
    },
    {
      name: 'Gym Training',
      icon: '🏋️',
      aliases: ['gym', 'spotter', 'workout', 'bench press', 'calisthenics', 'fitness', 'weight training', 'lifting', 'pr', 'bodybuilding']
    },
    {
      name: 'Guitar',
      icon: '🎸',
      aliases: ['guitar', 'acoustic', 'guitarist', 'jamming', 'chords', 'fingerstyle']
    },
    {
      name: 'Vocals / Singing',
      icon: '🎤',
      aliases: ['singing', 'singer', 'vocals', 'vocalist', 'music', 'band', 'song']
    },
    {
      name: 'Bhangra',
      icon: '💃',
      aliases: ['bhangra', 'dance', 'dancer', 'folk dance', 'choreography', 'fest']
    },
    {
      name: 'Physics',
      icon: '📚',
      aliases: ['physics', 'electromagnetism', 'circuits', 'study partner', 'problem solving', 'math', 'calculus', 'midsem', 'exam', 'study']
    },
    {
      name: 'AI / ML',
      icon: '🤖',
      aliases: ['ai', 'ml', 'machine learning', 'deep learning', 'model', 'data science']
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

  // 7. Keywords breakdown
  const cleanTokens = q
    .replace(/[^\w\s]/gi, ' ')
    .split(/\s+/)
    .filter(t => t.length > 0 && !['find', 'me', 'the', 'for', 'and', 'with', 'are', 'you', 'is', 'a', 'in', 'at', 'to', 'of'].includes(t));

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

  for (const student of allStudents) {
    if (currentUser && student.id === currentUser.id) continue;

    let score = 0;
    let hasContentMatch = false;
    const reasons: string[] = [];

    const studentName = student.name.toLowerCase();
    const studentBio = (student.bio || '').toLowerCase();
    const studentDegree = (student.degree || '').toLowerCase();
    const studentCollege = (student.college || '').toLowerCase();
    const studentLocation = (student.location || '').toLowerCase();

    // 1. Direct Whole Query Match (Highest priority)
    if (studentName.includes(rawQ)) {
      score += 100;
      hasContentMatch = true;
      reasons.push(`Name Match`);
    } else if (student.skills.some(s => s.toLowerCase().includes(rawQ) || rawQ.includes(s.toLowerCase()))) {
      score += 90;
      hasContentMatch = true;
      const matchedSkill = student.skills.find(s => s.toLowerCase().includes(rawQ) || rawQ.includes(s.toLowerCase()));
      reasons.push(`Skill: ${matchedSkill}`);
    } else if (studentBio.includes(rawQ) || studentDegree.includes(rawQ) || studentCollege.includes(rawQ)) {
      score += 70;
      hasContentMatch = true;
      reasons.push(`Profile Match`);
    }

    // 2. Semantic Activity / Skill Match from Intent
    if (intent.activityOrSkill) {
      const targetSkill = intent.activityOrSkill.toLowerCase();
      const hasExactSkill = student.skills.some(
        s => s.toLowerCase() === targetSkill || s.toLowerCase().includes(targetSkill) || targetSkill.includes(s.toLowerCase())
      );
      const hasInterest = student.interests.some(
        i => i.toLowerCase().includes(targetSkill) || targetSkill.includes(i.toLowerCase())
      );
      const hasBioMatch = studentBio.includes(targetSkill) || studentDegree.includes(targetSkill);

      if (hasExactSkill) {
        score += 60;
        hasContentMatch = true;
        reasons.push(`${intent.activityIcon} Top Skill: ${intent.activityOrSkill}`);
      } else if (hasInterest) {
        score += 40;
        hasContentMatch = true;
        reasons.push(`Interested in ${intent.activityOrSkill}`);
      } else if (hasBioMatch) {
        score += 30;
        hasContentMatch = true;
        reasons.push(`Experience in ${intent.activityOrSkill}`);
      }
    }

    // 3. Keyword Match
    if (intent.keywords.length > 0) {
      for (const kw of intent.keywords) {
        if (studentName.includes(kw)) {
          score += 40;
          hasContentMatch = true;
        } else if (student.skills.some(s => s.toLowerCase().includes(kw))) {
          score += 35;
          hasContentMatch = true;
          const sk = student.skills.find(s => s.toLowerCase().includes(kw));
          if (!reasons.includes(`Skill: ${sk}`)) reasons.push(`Skill: ${sk}`);
        } else if (student.interests.some(i => i.toLowerCase().includes(kw))) {
          score += 25;
          hasContentMatch = true;
        } else if (studentBio.includes(kw) || studentDegree.includes(kw) || studentLocation.includes(kw) || studentCollege.includes(kw)) {
          score += 20;
          hasContentMatch = true;
        }
      }
    }

    // 4. Role Preference
    if (intent.roleOrOccupation && student.occupationType === intent.roleOrOccupation) {
      score += 15;
      if (hasContentMatch) reasons.push(`Matched Role`);
    }

    // 5. Proximity Boost (only added if student already matches the query)
    if (hasContentMatch) {
      const dist = student.distanceKm ?? 99;
      if (intent.proximity === 'nearby' || intent.proximity === 'within_1km') {
        if (dist <= 0.8) {
          score += 25;
          reasons.push(`📍 Nearby (~${Math.round(dist * 1000)}m)`);
        } else if (dist <= 1.2) {
          score += 15;
          reasons.push(`📍 Within 1 km`);
        }
      } else {
        if (dist <= 1.0) score += 10;
      }

      if (student.verifiedCollege) score += 5;
      if (student.onlineStatus === 'active_now') score += 5;

      const matchPercentage = Math.min(99, Math.max(72, Math.round(65 + (score / 140) * 34)));
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
    if (index < targetCount && res.score >= 40) {
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
