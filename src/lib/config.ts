// API URLs based on environment
export const API_URL = process.env.NEXT_PUBLIC_API_URL || (
  process.env.NODE_ENV === 'production' 
    ? 'http://34.70.134.127:8000/api'  // Production URL
    : 'http://localhost:8000/api'      // Development URL
);
