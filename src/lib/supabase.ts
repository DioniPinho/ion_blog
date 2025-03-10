import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Helper function to handle Supabase errors consistently
export const handleSupabaseError = (error: any): Error => {
  console.error('Supabase error:', error);
  
  // Handle authentication errors specifically
  if (error.status === 400 && error.message?.includes('Invalid login credentials')) {
    return new Error('Invalid email or password. Please check your credentials and try again.');
  }
  
  if (error.message) {
    return new Error(error.message);
  } else if (error.error_description) {
    return new Error(error.error_description);
  } else {
    return new Error('An unknown error occurred');
  }
};