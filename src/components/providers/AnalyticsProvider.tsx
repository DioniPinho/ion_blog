'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import analyticsApi from '@/lib/api/analytics';

// Define the context type
interface AnalyticsContextType {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  trackPageView: (postId?: string) => void;
}

// Create the context with default values
const AnalyticsContext = createContext<AnalyticsContextType>({
  trackEvent: () => {},
  trackPageView: () => {},
});

// Hook to use analytics
export const useAnalytics = () => useContext(AnalyticsContext);

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views automatically
  useEffect(() => {
    // Don't track page views in development
    if (process.env.NODE_ENV === 'development') return;

    // Track page view
    const handlePageView = async () => {
      // Extract post ID from URL if it's a post page
      // Example: /posts/my-post-slug
      const postSlug = pathname.split('/').pop();
      
      if (pathname.includes('/posts/') && postSlug) {
        try {
          // Get post by slug to find its ID
          const post = await fetch(`/api/posts/${postSlug}`)
            .then(res => res.json())
            .catch(() => null);

          if (post?.id) {
            // Track the page view with the post ID
            analyticsApi.trackPageView(post.id);
          }
        } catch (error) {
          console.error('Error tracking post view:', error);
        }
      }

      // Send to Vercel Analytics if available
      if (typeof window !== 'undefined' && 'va' in window) {
        // @ts-ignore - Vercel Analytics is added via script
        window.va?.track('pageview');
      }
    };

    handlePageView();
  }, [pathname, searchParams]);

  // Custom event tracking function
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    // Don't track events in development
    if (process.env.NODE_ENV === 'development') return;

    // Send to Vercel Analytics if available
    if (typeof window !== 'undefined' && 'va' in window) {
      // @ts-ignore - Vercel Analytics is added via script
      window.va?.track(eventName, properties);
    }

    // Log event for debugging
    console.log(`[Analytics] Event: ${eventName}`, properties);
  };

  // Custom page view tracking function (for manual tracking)
  const trackPageView = (postId?: string) => {
    // Don't track page views in development
    if (process.env.NODE_ENV === 'development') return;

    // Track post view if post ID is provided
    if (postId) {
      analyticsApi.trackPageView(postId);
    }

    // Send to Vercel Analytics if available
    if (typeof window !== 'undefined' && 'va' in window) {
      // @ts-ignore - Vercel Analytics is added via script
      window.va?.track('pageview');
    }
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent, trackPageView }}>
      {children}
    </AnalyticsContext.Provider>
  );
}