// =========================================================================
// Supabase Authentication Service for MEMA
// =========================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { UserProfile } from '../types';
import { CURRENT_USER, MOCK_STUDENTS } from '../data/mockData';

export interface AuthResponse {
  success: boolean;
  user?: any;
  error?: string;
  session?: any;
}

export interface SignUpData {
  email: string;
  password?: string;
  name: string;
  college?: string;
  degree?: string;
  year?: string;
  occupationType?: 'school_student' | 'creator_freelancer' | 'working_professional';
  avatar?: string;
  skills?: string[];
}

/**
 * Sign up a new campus user with Email and Password
 */
export async function signUpWithEmail(data: SignUpData): Promise<AuthResponse> {
  if (!isSupabaseConfigured) {
    // Local demo / simulated registration
    const simulatedProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: data.name,
      age: 21,
      college: data.college || 'Delhi Technological University (DTU)',
      degree: data.degree || 'Student',
      year: data.year || '3rd Year',
      location: 'Campus Area',
      locationZone: 'Campus Area',
      distanceKm: 0.5,
      distanceDisplay: 'Nearby (~500m)',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      verifiedCollege: true,
      studentIdVerified: true,
      skills: data.skills || ['React', 'Sports', 'Study'],
      interests: ['Campus Activities', 'Meetups'],
      activitiesCompleted: 0,
      requestsPosted: 0,
      bio: `Student at ${data.college || 'DTU'}`,
      onlineStatus: 'active_now'
    };

    return {
      success: true,
      user: {
        id: simulatedProfile.id,
        email: data.email,
        user_metadata: { name: data.name, college: data.college }
      }
    };
  }

  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password || 'MemaStudent2026!',
      options: {
        data: {
          name: data.name,
          college: data.college || 'Delhi Technological University (DTU)',
          degree: data.degree || 'Student',
          year: data.year || '3rd Year',
          occupation_type: data.occupationType || 'working_professional',
          avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          skills: data.skills || []
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      user: authData.user,
      session: authData.session
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to sign up' };
  }
}

/**
 * Sign in existing user with Email and Password
 */
export async function signInWithEmail(email: string, password?: string): Promise<AuthResponse> {
  if (!isSupabaseConfigured) {
    // Local demo login check
    const matched = MOCK_STUDENTS.find(s => s.name.toLowerCase().includes(email.split('@')[0].toLowerCase())) || CURRENT_USER;
    return {
      success: true,
      user: {
        id: matched.id,
        email: email,
        user_metadata: { name: matched.name, college: matched.college }
      }
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: password || 'MemaStudent2026!'
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      user: data.user,
      session: data.session
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to sign in' };
  }
}

/**
 * Send Magic Link / OTP to student email
 */
export async function sendMagicLink(email: string): Promise<AuthResponse> {
  if (!isSupabaseConfigured) {
    return {
      success: true,
      user: { email }
    };
  }

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to send magic link' };
  }
}

/**
 * Sign Out active user
 */
export async function signOutUser(): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
  }
}

/**
 * Get current active session
 */
export async function getActiveSession() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch {
    return null;
  }
}
