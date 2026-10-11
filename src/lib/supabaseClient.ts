import { createClient } from '@supabase/supabase-js';

// Default Supabase project endpoints provided for MEMA production
const DEFAULT_SUPABASE_URL = 'https://ovlmmitgcmptigzegzef.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_sBSxO79bgqLkVXGAAl8LnQ_Tqo2CfDZ';

const rawUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  DEFAULT_SUPABASE_URL
).trim();

const rawKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_ANON_KEY
).trim();

const isInvalidOrPlaceholderUrl = (url: string) => {
  if (!url) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes('placeholder') ||
    lower.includes('your-project-id') ||
    lower.includes('your-supabase') ||
    lower.includes('example.com') ||
    lower.includes('your-anon-key') ||
    lower === 'https://.supabase.co' ||
    !lower.startsWith('https://')
  );
};

const isInvalidOrPlaceholderKey = (key: string) => {
  if (!key) return true;
  const lower = key.toLowerCase();
  return (
    lower.includes('placeholder') ||
    lower.includes('your-supabase') ||
    lower.includes('anon-key-here') ||
    lower.includes('your-anon-key') ||
    key.length < 20
  );
};

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  !isInvalidOrPlaceholderUrl(rawUrl) &&
  !isInvalidOrPlaceholderKey(rawKey)
);

const supabaseUrl = isSupabaseConfigured ? rawUrl : DEFAULT_SUPABASE_URL;
const supabaseAnonKey = isSupabaseConfigured ? rawKey : DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

