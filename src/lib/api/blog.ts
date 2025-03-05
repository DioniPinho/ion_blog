import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Types
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published';
  featured: boolean;
  cover_image?: string;
  categories: string[];
  tags: string[];
  views_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    username: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// API Configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.70.134.127:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Adding authorization token to request');
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to an expired token and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log('Token expired, attempting to refresh');
        // Implement your token refresh logic here
        // const refreshResponse = await refreshToken();
        // const newToken = refreshResponse.data.token;
        // localStorage.setItem('token', newToken);
        // originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        // return api(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // Redirect to login or handle as needed
      }
    }
    
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const blogApi = {
  // Posts
  getPosts: async () => {
    try {
      console.log('Fetching posts from API');
      const response = await api.get('/posts/');
      console.log('API response for posts:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  getPost: async (slug: string) => {
    try {
      console.log(`Fetching post with slug: ${slug}`);
      const response = await api.get(`/posts/${slug}/`);
      console.log('API response for post:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post with slug ${slug}:`, error);
      throw error;
    }
  },

  createPost: async (data: Partial<Post>) => {
    try {
      console.log('Creating post with data:', data);
      
      // Check if we have a file to upload
      const hasFile = data.cover_image instanceof File;
      
      let response;
      
      if (hasFile) {
        // Use FormData for file uploads
        const formData = new FormData();
        
        // Add all non-file fields to FormData
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'cover_image' && value instanceof File) {
            formData.append('cover_image', value);
          } else if (key === 'categories' || key === 'tags') {
            // Handle arrays - convert to JSON string if needed
            if (Array.isArray(value)) {
              value.forEach((item, index) => {
                formData.append(`${key}`, item);
              });
            }
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        
        console.log('Using FormData for post creation (file upload)');
        response = await api.post('/posts/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Use JSON for regular data
        const jsonData = {
          ...data,
          // Ensure categories and tags are properly formatted
          categories: Array.isArray(data.categories) ? data.categories : [],
          tags: Array.isArray(data.tags) ? data.tags : [],
        };
        
        console.log('Using JSON for post creation');
        console.log('JSON data for post creation:', jsonData);
        
        response = await api.post('/posts/', jsonData);
      }
      
      console.log('API response for post creation:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  updatePost: async (slug: string, data: Partial<Post>) => {
    try {
      console.log(`Updating post with slug ${slug} and data:`, data);
      
      // Check if we have a file to upload
      const hasFile = data.cover_image instanceof File;
      
      let response;
      
      if (hasFile) {
        // Use FormData for file uploads
        const formData = new FormData();
        
        // Add all non-file fields to FormData
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'cover_image' && value instanceof File) {
            formData.append('cover_image', value);
          } else if (key === 'categories' || key === 'tags') {
            // Handle arrays - convert to JSON string
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            }
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        
        console.log('FormData entries:');
        for (const pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
        
        console.log('Using FormData for post update (file upload)');
        response = await api.put(`/posts/${slug}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Use JSON for regular data
        const jsonData = {
          ...data,
          // Ensure categories and tags are properly formatted
          categories: Array.isArray(data.categories) ? data.categories : [],
          tags: Array.isArray(data.tags) ? data.tags : [],
        };
        
        console.log('Using JSON for post update');
        console.log('JSON data for post update:', jsonData);
        
        response = await api.put(`/posts/${slug}/`, jsonData);
      }
      
      console.log('API response for post update:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating post with slug ${slug}:`, error);
      throw error;
    }
  },

  deletePost: async (slug: string) => {
    try {
      console.log(`Deleting post with slug: ${slug}`);
      await api.delete(`/posts/${slug}/`);
      console.log(`Post with slug ${slug} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting post with slug ${slug}:`, error);
      throw error;
    }
  },

  // Categories
  getCategories: async () => {
    try {
      console.log('Fetching categories from API');
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://34.70.134.127:8000/api');
      const response = await api.get('/categories/');
      console.log('API Response: /categories/', response.data);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  getCategory: async (slug: string) => {
    try {
      console.log(`Fetching category with slug: ${slug}`);
      const response = await api.get(`/categories/${slug}/`);
      console.log('API response for category:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with slug ${slug}:`, error);
      throw error;
    }
  },

  createCategory: async (data: Partial<Category>) => {
    try {
      console.log('Creating category with data:', data);
      // Ensure we have both name and slug
      if (!data.slug && data.name) {
        data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      const response = await api.post('/categories/', data);
      console.log('API response for category creation:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (slug: string, data: Partial<Category>) => {
    try {
      console.log(`Updating category with slug ${slug} and data:`, data);
      const response = await api.put(`/categories/${slug}/`, data);
      console.log('API response for category update:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating category with slug ${slug}:`, error);
      throw error;
    }
  },

  deleteCategory: async (slug: string) => {
    try {
      console.log(`Deleting category with slug: ${slug}`);
      await api.delete(`/categories/${slug}/`);
      console.log(`Category with slug ${slug} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting category with slug ${slug}:`, error);
      throw error;
    }
  },

  // Tags
  getTags: async () => {
    try {
      console.log('Fetching tags from API');
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://34.70.134.127:8000/api');
      const response = await api.get('/tags/');
      console.log('API Response: /tags/', response.data);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      return response;
    } catch (error) {
      console.error('Error fetching tags:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  getTag: async (slug: string) => {
    try {
      console.log(`Fetching tag with slug: ${slug}`);
      const response = await api.get(`/tags/${slug}/`);
      console.log('API response for tag:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tag with slug ${slug}:`, error);
      throw error;
    }
  },

  createTag: async (data: Partial<Tag>) => {
    try {
      console.log('Creating tag with data:', data);
      // Ensure we have both name and slug
      if (!data.slug && data.name) {
        data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      const response = await api.post('/tags/', data);
      console.log('API response for tag creation:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  },

  updateTag: async (slug: string, data: Partial<Tag>) => {
    try {
      console.log(`Updating tag with slug ${slug} and data:`, data);
      const response = await api.put(`/tags/${slug}/`, data);
      console.log('API response for tag update:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating tag with slug ${slug}:`, error);
      throw error;
    }
  },

  deleteTag: async (slug: string) => {
    try {
      console.log(`Deleting tag with slug: ${slug}`);
      await api.delete(`/tags/${slug}/`);
      console.log(`Tag with slug ${slug} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting tag with slug ${slug}:`, error);
      throw error;
    }
  },
};