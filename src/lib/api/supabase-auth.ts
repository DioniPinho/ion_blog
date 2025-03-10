import { supabase, handleSupabaseError } from '../supabase';
import { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

// Convert Supabase user to our AuthUser format
const formatUser = (user: User): AuthUser => {
  // Extract name parts from user metadata if available
  const metadata = user.user_metadata || {};
  const firstName = metadata.first_name || '';
  const lastName = metadata.last_name || '';
  
  return {
    id: user.id,
    username: metadata.username || user.email?.split('@')[0] || '',
    email: user.email || '',
    first_name: firstName,
    last_name: lastName,
    is_staff: metadata.is_staff || false,
    is_superuser: metadata.is_superuser || false,
  };
};

// Mock user for development
const mockUser = {
  id: '1',
  username: 'admin',
  email: 'admin@example.com',
  first_name: 'Admin',
  last_name: 'User',
  is_staff: true,
  is_superuser: true,
};

// Use mock data in development mode, but allow bypassing with environment variable
const isDevelopment = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'false';

export const auth = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    if (isDevelopment) {
      console.log('Using mock login in development mode');
      return { access: 'mock_access_token', refresh: 'mock_refresh_token', user: mockUser };
    }
    
    try {
      console.log('Attempting login for user:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw handleSupabaseError(error);
      
      if (!data.user) {
        throw new Error('Login failed: No user returned');
      }
      
      console.log('Login successful');
      
      // Format user data to match our expected format
      const formattedUser = formatUser(data.user);
      
      return {
        access: data.session?.access_token || '',
        refresh: data.session?.refresh_token || '',
        user: formattedUser,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    if (isDevelopment) {
      console.log('Using mock logout in development mode');
      return;
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw handleSupabaseError(error);
      
      // Redirect is handled by the calling component
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getMe: async (): Promise<AuthUser> => {
    if (isDevelopment) {
      console.log('Using mock user in development mode');
      return mockUser;
    }
    
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw handleSupabaseError(error);
      
      if (!data.user) {
        throw new Error('Not authenticated');
      }
      
      return formatUser(data.user);
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      if (isDevelopment) return true;
      
      const { data } = await supabase.auth.getSession();
      return !!data.session;
    } catch {
      return false;
    }
  },
  
  // Register a new user
  register: async (email: string, password: string, userData: Partial<AuthUser>): Promise<LoginResponse> => {
    if (isDevelopment) {
      console.log('Using mock registration in development mode');
      return { access: 'mock_access_token', refresh: 'mock_refresh_token', user: mockUser };
    }
    
    try {
      console.log('Registering new user:', email);
      
      // Create the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username || email.split('@')[0],
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            is_staff: userData.is_staff || false,
            is_superuser: userData.is_superuser || false,
          },
        },
      });
      
      if (error) throw handleSupabaseError(error);
      
      if (!data.user) {
        throw new Error('Registration failed: No user returned');
      }
      
      console.log('Registration successful');
      
      // Format user data to match our expected format
      const formattedUser = formatUser(data.user);
      
      return {
        access: data.session?.access_token || '',
        refresh: data.session?.refresh_token || '',
        user: formattedUser,
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
};

export default auth;