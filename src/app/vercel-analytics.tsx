'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

export function VercelAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Skip in development
    if (process.env.NODE_ENV === 'development') return;
    
    // Track page view when route changes
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Send to Vercel Analytics if available
    if (typeof window !== 'undefined' && 'va' in window) {
      // @ts-ignore - Vercel Analytics is added via script
      window.va?.track('pageview', { url });
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* Vercel Analytics Script */}
      <Script strategy="afterInteractive" id="vercel-analytics">
        {`
          window.va = window.va || function () { (window.va.q = window.va.q || []).push(arguments); };
          window.va('init', {
            // Replace with your Vercel Analytics ID
            analyticsId: 'vercel-analytics-id',
            // Optional: Customize data collection
            debug: false,
            // Optional: Disable automatic pageview tracking
            disableAutoTrack: true,
          });
        `}
      </Script>
      <Script 
        strategy="afterInteractive" 
        src="https://va.vercel-scripts.com/v1/script.js" 
        id="vercel-analytics-script"
      />
    </>
  );
}