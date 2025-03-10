import { supabase, handleSupabaseError } from '../supabase';
import { Post } from './blog';

// Types for analytics data
export interface PostAnalytics {
  post_id: string;
  views: number;
  unique_visitors: number;
  avg_time_on_page: number;
  bounce_rate: number;
  referrers: Record<string, number>; // e.g., { "google": 120, "twitter": 45 }
  period: string; // e.g., "daily", "weekly", "monthly"
  date: string;
}

export interface MonetizationData {
  total_revenue: number;
  ad_revenue: number;
  affiliate_revenue: number;
  period: string; // e.g., "daily", "weekly", "monthly"
  date: string;
  sources: Record<string, number>; // e.g., { "adsense": 120, "amazon": 45 }
}

export interface VisitorData {
  date: string;
  value: number;
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

export interface CategoryAnalytics {
  name: string;
  value: number;
  color: string;
}

// Color palette for charts
const CHART_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#f97316', // orange
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#14b8a6', // teal
];

// Helper function to get a color from the palette
const getColorFromPalette = (index: number): string => {
  return CHART_COLORS[index % CHART_COLORS.length];
};

export const analyticsApi = {
  // Get post views data
  getPostViews: async (postId?: string, period: string = 'monthly'): Promise<number> => {
    try {
      console.log(`Fetching post views for ${postId || 'all posts'} with period ${period}`);
      
      // If no specific post, get total views
      if (!postId) {
        const { data, error } = await supabase
          .from('posts')
          .select('views_count');
        
        if (error) throw handleSupabaseError(error);
        
        const totalViews = data.reduce((sum, post) => sum + (post.views_count || 0), 0);
        return totalViews;
      }
      
      // Get views for specific post
      const { data, error } = await supabase
        .from('posts')
        .select('views_count')
        .eq('id', postId)
        .single();
      
      if (error) throw handleSupabaseError(error);
      
      return data.views_count || 0;
    } catch (error) {
      console.error('Error fetching post views:', error);
      return 0;
    }
  },
  
  // Get visitor data for charts
  getVisitorsData: async (period: string = 'monthly'): Promise<VisitorData[]> => {
    try {
      console.log(`Fetching visitors data with period ${period}`);
      
      // Query posts table to get real post count data
      const { data: posts, error } = await supabase
        .from('posts')
        .select('views_count, created_at');
      
      if (error) throw handleSupabaseError(error);
      
      // If we have posts data, process it
      if (posts && posts.length > 0) {
        // Group posts by month and sum views
        const postsByMonth: Record<string, number> = {};
        
        posts.forEach(post => {
          const date = new Date(post.created_at);
          const month = date.toLocaleString('default', { month: 'short' });
          
          if (!postsByMonth[month]) {
            postsByMonth[month] = 0;
          }
          
          postsByMonth[month] += post.views_count || 0;
        });
        
        // Get last 7 months including current month
        const months = Array.from({length: 7}, (_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          return d.toLocaleString('default', { month: 'short' });
        }).reverse();
        
        // Convert to array format needed for charts
        return months.map(month => ({
          date: month,
          value: postsByMonth[month] || 0
        }));
      }
      
      // Return empty data if no posts
      return Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return {
          date: d.toLocaleString('default', { month: 'short' }),
          value: 0
        };
      }).reverse();
    } catch (error) {
      console.error('Error fetching visitors data:', error);
      return [];
    }
  },
  
  // Get traffic sources data
  getTrafficSources: async (): Promise<TrafficSource[]> => {
    try {
      console.log('Fetching traffic sources data');
      
      // Return empty array since we don't have real traffic source tracking yet
      return [];
    } catch (error) {
      console.error('Error fetching traffic sources:', error);
      return [];
    }
  },
  
  // Get post categories analytics
  getPostCategoriesAnalytics: async (): Promise<CategoryAnalytics[]> => {
    try {
      console.log('Fetching post categories analytics');
      
      // Query posts to get real categories data
      const { data: posts, error } = await supabase
        .from('posts')
        .select('categories, views_count');
      
      if (error) throw handleSupabaseError(error);
      
      if (posts && posts.length > 0) {
        // Count views by category
        const categoryCounts: Record<string, number> = {};
        let totalViews = 0;
        
        posts.forEach(post => {
          const categories = post.categories || [];
          const views = post.views_count || 0;
          totalViews += views;
          
          categories.forEach((category: string) => {
            if (!categoryCounts[category]) {
              categoryCounts[category] = 0;
            }
            categoryCounts[category] += views;
          });
        });
        
        // Convert to percentage and format for chart
        return Object.entries(categoryCounts)
          .map(([name, views], index) => ({
            name,
            value: Math.round((views / totalViews) * 100),
            color: getColorFromPalette(index)
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5); // Top 5 categories
      }
      
      // Fallback to mock data
      return [
        { name: 'DevOps', value: 40, color: '#3b82f6' },
        { name: 'Cloud', value: 30, color: '#10b981' },
        { name: 'Segurança', value: 15, color: '#f59e0b' },
        { name: 'Automação', value: 10, color: '#f97316' },
        { name: 'Outros', value: 5, color: '#8b5cf6' },
      ];
    } catch (error) {
      console.error('Error fetching post categories analytics:', error);
      return [];
    }
  },
  
  // Get monetization data
  getMonetizationData: async (period: string = 'monthly'): Promise<MonetizationData> => {
    try {
      console.log(`Fetching monetization data with period ${period}`);
      
      // Return zero values since we don't have real monetization data yet
      return {
        total_revenue: 0,
        ad_revenue: 0,
        affiliate_revenue: 0,
        period: period,
        date: new Date().toISOString(),
        sources: {}
      };
    } catch (error) {
      console.error('Error fetching monetization data:', error);
      return {
        total_revenue: 0,
        ad_revenue: 0,
        affiliate_revenue: 0,
        period: period,
        date: new Date().toISOString(),
        sources: {}
      };
    }
  },
  
  // Get revenue chart data
  getRevenueChartData: async (period: string = 'monthly'): Promise<VisitorData[]> => {
    try {
      console.log(`Fetching revenue chart data with period ${period}`);
      
      // Return empty array since we don't have real revenue data yet
      return [];
    } catch (error) {
      console.error('Error fetching revenue chart data:', error);
      return [];
    }
  },
  
  // Track a page view
  trackPageView: async (postId: string): Promise<void> => {
    try {
      console.log(`Tracking page view for post ${postId}`);
      
      // Get current post views
      const { data, error } = await supabase
        .from('posts')
        .select('views_count')
        .eq('id', postId)
        .single();
      
      if (error) throw handleSupabaseError(error);
      
      // Increment views count
      const newViewsCount = (data.views_count || 0) + 1;
      
      // Update post with new views count
      const { error: updateError } = await supabase
        .from('posts')
        .update({ views_count: newViewsCount })
        .eq('id', postId);
      
      if (updateError) throw handleSupabaseError(updateError);
      
      console.log(`Updated views count for post ${postId} to ${newViewsCount}`);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  },
  
  // Get popular posts
  getPopularPosts: async (limit: number = 5): Promise<Post[]> => {
    try {
      console.log(`Fetching top ${limit} popular posts`);
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('views_count', { ascending: false })
        .limit(limit);
      
      if (error) throw handleSupabaseError(error);
      
      return data || [];
    } catch (error) {
      console.error('Error fetching popular posts:', error);
      return [];
    }
  },
};

export default analyticsApi;