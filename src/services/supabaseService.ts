import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { UserProfile, CampusRequest, Conversation, ChatMessage } from '../types';
import { MOCK_STUDENTS, MOCK_CAMPUS_REQUESTS, MOCK_CONVERSATIONS } from '../data/mockData';

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

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        age: row.age || 21,
        occupationType: row.occupation_type || 'working_professional',
        college: row.college || 'Delhi Technological University (DTU)',
        degree: row.degree || 'Student',
        year: row.year || '3rd Year',
        location: row.location || 'Nearby Area',
        distanceKm: row.distance_km ?? 0.8,
        distanceDisplay: row.distance_display || '~Within 1 km',
        avatar: row.avatar,
        coverImage: row.cover_image,
        verifiedCollege: Boolean(row.verified_college),
        studentIdVerified: Boolean(row.student_id_verified),
        skills: Array.isArray(row.skills) ? row.skills : [],
        interests: Array.isArray(row.interests) ? row.interests : [],
        activitiesCompleted: row.activities_completed || 0,
        requestsPosted: row.requests_posted || 0,
        bio: row.bio || '',
        locationZone: row.location_zone || row.location,
        onlineStatus: row.online_status || 'active_now'
      }));
    } catch (err) {
      console.error('Error fetching Supabase profiles:', err);
      return MOCK_STUDENTS;
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
  }
};
