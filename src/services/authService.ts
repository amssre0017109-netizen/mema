// =========================================================================
// Supabase Authentication Service for MEMA (Production Ready)
// =========================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { supabaseService } from './supabaseService';
import { UserProfile } from '../types';
import { CURRENT_USER, MOCK_STUDENTS } from '../data/mockData';

export interface AuthResponse {
  success: boolean;
  user?: any;
  error?: string;
  session?: any;
  requiresEmailConfirmation?: boolean;
}

export interface SignUpData {
  email: string;
  password?: string;
  name: string;
  location?: string;
  college?: string;
  degree?: string;
  year?: string;
  occupationType?: 'school_student' | 'creator_freelancer' | 'working_professional';
  avatar?: string;
  skills?: string[];
}

/**
 * Format auth error messages into clear, actionable, user-friendly language
 */
function formatAuthError(errorMsg: string): string {
  const lower = errorMsg.toLowerCase();
  if (lower.includes('user already registered') || lower.includes('already exists')) {
    return 'An account with this email already exists. Please switch to Sign In.';
  }
  if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
    return 'Incorrect email or password. Please verify your details and try again.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Your email has not been verified yet. Please check your inbox for the confirmation link.';
  }
  if (lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'Too many attempts. Please wait a minute and try again.';
  }
  if (lower.includes('password should be at least') || lower.includes('password is too short')) {
    return 'Password must be at least 6 characters long.';
  }
  if (lower.includes('failed to fetch') || lower.includes('network error')) {
    return 'Network connection issue. Please check your internet connection or try again shortly.';
  }
  return errorMsg;
}

/**
 * Sign up a new campus user with Email and Password
 */
export async function signUpWithEmail(data: SignUpData): Promise<AuthResponse> {
  const userLoc = data.location?.trim() || 'Connaught Place, New Delhi';
  const trimmedEmail = data.email.trim();
  const trimmedPassword = data.password?.trim() || 'MemaStudent2026!';
  const trimmedName = data.name.trim();

  if (!isSupabaseConfigured) {
    // Local demo / simulated registration
    const simulatedProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: trimmedName,
      age: 21,
      college: data.college || userLoc || 'Delhi Technological University (DTU)',
      degree: data.degree || 'Student',
      year: data.year || '3rd Year',
      location: userLoc,
      locationZone: userLoc,
      distanceKm: 0.5,
      distanceDisplay: 'Nearby (~500m)',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      verifiedCollege: true,
      studentIdVerified: true,
      skills: data.skills || ['Sports', 'Coding', 'Design'],
      interests: ['Campus Activities', 'Meetups'],
      activitiesCompleted: 0,
      requestsPosted: 0,
      bio: `Member at ${userLoc}`,
      onlineStatus: 'active_now'
    };

    return {
      success: true,
      user: {
        id: simulatedProfile.id,
        email: trimmedEmail,
        user_metadata: {
          name: trimmedName,
          location: userLoc,
          locationZone: userLoc,
          college: simulatedProfile.college,
          occupation_type: data.occupationType || 'school_student',
          avatar: simulatedProfile.avatar
        }
      },
      requiresEmailConfirmation: false
    };
  }

  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: trimmedPassword,
      options: {
        data: {
          name: trimmedName,
          location: userLoc,
          locationZone: userLoc,
          college: data.college || userLoc || 'Delhi Technological University (DTU)',
          degree: data.degree || 'Student',
          year: data.year || '3rd Year',
          occupation_type: data.occupationType || 'school_student',
          avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          skills: data.skills || []
        },
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      return { success: false, error: formatAuthError(error.message) };
    }

    if (!authData.user) {
      return { success: false, error: 'Registration could not be completed. Please try again.' };
    }

    // Check if email confirmation is required by Supabase Auth configuration
    const isEmailConfirmed = Boolean(authData.session || authData.user.confirmed_at);
    const requiresEmailConfirmation = !isEmailConfirmed;

    // If already confirmed or auto-confirmed, ensure profile row is created idempotently
    if (isEmailConfirmed) {
      await supabaseService.upsertProfile({
        id: authData.user.id,
        name: trimmedName,
        location: userLoc,
        locationZone: userLoc,
        college: data.college || userLoc,
        occupationType: data.occupationType || 'school_student',
        avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        skills: data.skills || [],
        bio: `Active on MEMA in ${userLoc}`
      });
    }

    return {
      success: true,
      user: authData.user,
      session: authData.session,
      requiresEmailConfirmation
    };
  } catch (err: any) {
    console.error('Supabase sign up exception:', err);
    return {
      success: false,
      error: formatAuthError(err.message || 'An unexpected error occurred during signup.')
    };
  }
}

/**
 * Sign in existing user with Email and Password
 */
export async function signInWithEmail(email: string, password?: string): Promise<AuthResponse> {
  const trimmedEmail = email.trim();
  const trimmedPassword = password?.trim() || '';

  if (!isSupabaseConfigured) {
    // Local demo login check
    const matched = MOCK_STUDENTS.find(s => s.name.toLowerCase().includes(trimmedEmail.split('@')[0].toLowerCase())) || CURRENT_USER;
    return {
      success: true,
      user: {
        id: matched.id,
        email: trimmedEmail,
        user_metadata: { name: matched.name, college: matched.college, location: matched.location }
      }
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword
    });

    if (error) {
      return { success: false, error: formatAuthError(error.message) };
    }

    if (!data.user) {
      return { success: false, error: 'Sign in failed. No user record returned.' };
    }

    // Ensure profile row exists in public.profiles table
    const existingProfile = await supabaseService.getProfileById(data.user.id);
    if (!existingProfile) {
      const meta = data.user.user_metadata || {};
      await supabaseService.upsertProfile({
        id: data.user.id,
        name: meta.name || trimmedEmail.split('@')[0] || 'Member',
        location: meta.location || 'Connaught Place, New Delhi',
        college: meta.college || meta.location || 'Delhi Technological University (DTU)',
        avatar: meta.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        skills: meta.skills || ['Coding', 'Design', 'Sports']
      });
    }

    return {
      success: true,
      user: data.user,
      session: data.session
    };
  } catch (err: any) {
    console.error('Supabase sign in exception:', err);
    return {
      success: false,
      error: formatAuthError(err.message || 'Network connection issue during sign in.')
    };
  }
}

/**
 * Resend verification confirmation email to user
 */
export async function resendVerificationEmail(email: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      return { success: false, error: formatAuthError(error.message) };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: formatAuthError(err.message || 'Failed to resend confirmation email.') };
  }
}

/**
 * Send password reset link to user's email
 */
export async function resetPasswordForEmail(email: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin
    });

    if (error) {
      return { success: false, error: formatAuthError(error.message) };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: formatAuthError(err.message || 'Failed to send password reset email.') };
  }
}

/**
 * Send Magic Link / OTP to student email
 */
export async function sendMagicLink(email: string): Promise<AuthResponse> {
  if (!isSupabaseConfigured) {
    return {
      success: true,
      user: { email: email.trim() }
    };
  }

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      return { success: false, error: formatAuthError(error.message) };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: formatAuthError(err.message || 'Failed to send magic link.') };
  }
}

/**
 * Sign Out active user and clear session
 */
export async function signOutUser(): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out notice:', err);
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

