import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { UserProfile, CampusRequest, Conversation, ChatMessage } from '../types';
import { MOCK_STUDENTS, MOCK_CAMPUS_REQUESTS, MOCK_CONVERSATIONS } from '../data/mockData';

function mapRowToProfile(row: any): UserProfile {
  return {
    id: row.id,
    name: row.name || 'Member',
    age: row.age || 21,
    occupationType: row.occupation_type || 'working_professional',
    college: row.college || row.location || 'Delhi Technological University (DTU)',
    degree: row.degree || 'Student',
    year: row.year || '3rd Year',
    location: row.location || 'Nearby Area',
    locationZone: row.location_zone || row.location || 'Nearby Area',
    distanceKm: row.distance_km ?? 0.8,
    distanceDisplay: row.distance_display || '~Within 1 km',
    avatar: row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: row.cover_image,
    verifiedCollege: Boolean(row.verified_college ?? true),
    studentIdVerified: Boolean(row.student_id_verified ?? true),
    skills: Array.isArray(row.skills) ? row.skills : [],
    interests: Array.isArray(row.interests) ? row.interests : [],
    activitiesCompleted: row.activities_completed || 0,
    requestsPosted: row.requests_posted || 0,
    bio: row.bio || '',
    onlineStatus: row.online_status || 'active_now'
  };
}

export const supabaseService = {
  /**
   * Fetch all member profiles
   */
  async getProfiles(): Promise<UserProfile[]> {
    if (!isSupabaseConfigured) {
      return MOCK_STUDENTS;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn('Using local fallback for profiles:', error?.message);
        return MOCK_STUDENTS;
      }

      return data.map(mapRowToProfile);
    } catch (err) {
      console.error('Error fetching Supabase profiles:', err);
      return MOCK_STUDENTS;
    }
  },

  /**
   * Fetch a single user profile by ID
   */
  async getProfileById(userId: string): Promise<UserProfile | null> {
    if (!userId || userId === 'guest') return null;
    if (!isSupabaseConfigured) {
      return MOCK_STUDENTS.find(s => s.id === userId) || null;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching profile by ID from Supabase:', error.message);
        return null;
      }

      if (!data) return null;
      return mapRowToProfile(data);
    } catch (err) {
      console.error('Exception fetching profile by ID:', err);
      return null;
    }
  },

  /**
   * Idempotently create or update a user profile in Supabase
   */
  async upsertProfile(profile: Partial<UserProfile> & { id: string; name: string }): Promise<{ success: boolean; data?: UserProfile; error?: string }> {
    if (!profile.id || profile.id === 'guest') {
      return { success: false, error: 'Invalid user ID' };
    }

    if (!isSupabaseConfigured) {
      return { success: true };
    }

    try {
      const payload: any = {
        id: profile.id,
        name: profile.name,
        updated_at: new Date().toISOString()
      };

      if (profile.age !== undefined) payload.age = profile.age;
      if (profile.occupationType !== undefined) payload.occupation_type = profile.occupationType;
      if (profile.college !== undefined) payload.college = profile.college;
      if (profile.degree !== undefined) payload.degree = profile.degree;
      if (profile.year !== undefined) payload.year = profile.year;
      if (profile.location !== undefined) {
        payload.location = profile.location;
        payload.location_zone = profile.locationZone || profile.location;
      }
      if (profile.avatar !== undefined) payload.avatar = profile.avatar;
      if (profile.bio !== undefined) payload.bio = profile.bio;
      if (profile.skills !== undefined) payload.skills = profile.skills;
      if (profile.interests !== undefined) payload.interests = profile.interests;
      if (profile.activitiesCompleted !== undefined) payload.activities_completed = profile.activitiesCompleted;
      if (profile.requestsPosted !== undefined) payload.requests_posted = profile.requestsPosted;
      if (profile.verifiedCollege !== undefined) payload.verified_college = profile.verifiedCollege;
      if (profile.studentIdVerified !== undefined) payload.student_id_verified = profile.studentIdVerified;

      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.warn('Supabase upsertProfile warning:', error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data: data ? mapRowToProfile(data) : undefined };
    } catch (err: any) {
      console.error('Exception in upsertProfile:', err);
      return { success: false, error: err.message || 'Failed to save profile' };
    }
  },

  /**
   * Fetch campus requests / activity needs
   */
  async getCampusRequests(): Promise<CampusRequest[]> {
    if (!isSupabaseConfigured) {
      return MOCK_CAMPUS_REQUESTS;
    }

    try {
      const { data, error } = await supabase
        .from('campus_requests')
        .select(`
          *,
          request_interests (*)
        `)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn('Using local fallback for campus requests:', error?.message);
        return MOCK_CAMPUS_REQUESTS;
      }

      return data.map((row: any) => ({
        id: row.id,
        title: row.title,
        category: row.category,
        needType: row.need_type || 'Activity',
        date: row.date || 'Today',
        time: row.time || '5:00 PM',
        location: row.location,
        college: row.college,
        distanceKm: row.distance_km ?? 0.5,
        distanceDisplay: row.distance_display || 'Nearby',
        peopleNeeded: row.people_needed || 1,
        peopleJoined: row.people_joined || 0,
        requiredSkills: Array.isArray(row.required_skills) ? row.required_skills : [],
        description: row.description,
        creator: {
          id: row.creator_id,
          name: row.creator_name || 'Member',
          avatar: row.creator_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
          college: row.college || 'Nearby',
          degree: row.creator_degree || 'Student',
          year: row.creator_year || '3rd Year',
          verifiedCollege: Boolean(row.creator_verified)
        },
        interestedUsers: (row.request_interests || []).map((i: any) => ({
          id: i.user_id,
          name: i.user_name,
          avatar: i.user_avatar,
          college: i.user_college,
          skills: i.user_skills || [],
          note: i.note,
          time: i.created_at ? 'Just now' : 'Earlier',
          status: i.status || 'PENDING'
        })),
        isUrgent: Boolean(row.is_urgent),
        createdAt: 'Just now',
        likesCount: row.likes_count || 0,
        likedByMe: false,
        commentsCount: row.comments_count || 0
      }));
    } catch (err) {
      console.error('Error fetching Supabase requests:', err);
      return MOCK_CAMPUS_REQUESTS;
    }
  },

  /**
   * Record Razorpay payment transaction in Supabase
   */
  async recordPaymentTransaction(payload: {
    userId: string;
    razorpayPaymentId: string;
    razorpayOrderId?: string;
    amountInr: number;
    planId: string;
    planName: string;
    paymentMethod: string;
  }) {
    if (!isSupabaseConfigured) {
      console.log('Payment recorded locally (Supabase not configured):', payload);
      return { success: true, id: `txn_${Date.now()}` };
    }

    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: payload.userId,
          razorpay_payment_id: payload.razorpayPaymentId,
          razorpay_order_id: payload.razorpayOrderId || null,
          amount_inr: payload.amountInr,
          plan_id: payload.planId,
          plan_name: payload.planName,
          payment_method: payload.paymentMethod,
          status: 'SUCCESS'
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error('Error saving payment transaction to Supabase:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Fetch IDs of users that the follower is currently following
   */
  async getFollowingUserIds(followerId: string): Promise<string[]> {
    if (!followerId) return [];

    let localIds: string[] = [];
    try {
      const saved = localStorage.getItem(`mema_follows_${followerId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          localIds = parsed;
        }
      }
    } catch {}

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('user_follows')
          .select('following_id')
          .eq('follower_id', followerId);

        if (!error && Array.isArray(data)) {
          const dbIds = data.map((r: any) => r.following_id);
          const merged = Array.from(new Set([...dbIds, ...localIds]));
          try {
            localStorage.setItem(`mema_follows_${followerId}`, JSON.stringify(merged));
          } catch {}
          return merged;
        } else if (error) {
          console.warn('Supabase getFollowingUserIds notice (using persistent store):', error.message || error);
        }
      } catch (err) {
        console.warn('Error fetching follows from Supabase, using persistent cache:', err);
      }
    }

    return localIds;
  },

  /**
   * Create follow relationship with resilient persistence
   */
  async followUser(followerId: string, followingId: string): Promise<{ success: boolean; error?: string }> {
    if (!followerId || !followingId) {
      return { success: false, error: 'Invalid user parameters.' };
    }

    if (followerId === followingId) {
      return { success: false, error: 'You cannot follow your own profile.' };
    }

    // Persist immediately in local storage so state is preserved across reloads
    try {
      const current: string[] = JSON.parse(localStorage.getItem(`mema_follows_${followerId}`) || '[]');
      if (!current.includes(followingId)) {
        current.push(followingId);
        localStorage.setItem(`mema_follows_${followerId}`, JSON.stringify(current));
      }
    } catch (e) {
      console.warn('Local follow storage warning:', e);
    }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('user_follows')
          .insert({
            follower_id: followerId,
            following_id: followingId
          });

        if (error) {
          // If duplicate key error (code 23505), relationship already exists
          if ((error as any).code === '23505' || error.message?.includes('duplicate')) {
            return { success: true };
          }
          console.warn('Supabase follow sync notice (saved to persistent local store):', error.message || error);
        }
        return { success: true };
      } catch (err: any) {
        console.warn('Supabase follow exception (saved to persistent local store):', err);
        return { success: true };
      }
    }

    return { success: true };
  },

  /**
   * Remove follow relationship with resilient persistence
   */
  async unfollowUser(followerId: string, followingId: string): Promise<{ success: boolean; error?: string }> {
    if (!followerId || !followingId) {
      return { success: false, error: 'Invalid user parameters.' };
    }

    // Persist removal immediately in local storage
    try {
      const current: string[] = JSON.parse(localStorage.getItem(`mema_follows_${followerId}`) || '[]');
      const updated = current.filter((id: string) => id !== followingId);
      localStorage.setItem(`mema_follows_${followerId}`, JSON.stringify(updated));
    } catch (e) {
      console.warn('Local unfollow storage warning:', e);
    }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('user_follows')
          .delete()
          .match({
            follower_id: followerId,
            following_id: followingId
          });

        if (error) {
          console.warn('Supabase unfollow notice (updated local store):', error.message || error);
        }
        return { success: true };
      } catch (err: any) {
        console.warn('Supabase unfollow exception (updated local store):', err);
        return { success: true };
      }
    }

    return { success: true };
  },

  /**
   * Get total followers and following counts for a profile
   */
  async getFollowCounts(userId: string): Promise<{ followersCount: number; followingCount: number }> {
    if (!userId) return { followersCount: 0, followingCount: 0 };

    if (isSupabaseConfigured) {
      try {
        const [followersRes, followingRes] = await Promise.all([
          supabase.from('user_follows').select('id', { count: 'exact', head: true }).eq('following_id', userId),
          supabase.from('user_follows').select('id', { count: 'exact', head: true }).eq('follower_id', userId)
        ]);

        if (!followersRes.error && !followingRes.error) {
          return {
            followersCount: followersRes.count || 0,
            followingCount: followingRes.count || 0
          };
        }
      } catch (err) {
        console.warn('Error fetching follow counts from Supabase:', err);
      }
    }

    return { followersCount: 0, followingCount: 0 };
  }
};
