import { supabase, handleSupabaseError } from '../supabase';
import { v4 as uuidv4 } from 'uuid';

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
  locale?: string;
  original_post_id?: string;
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

// Helper function to generate a slug from a title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Helper function to get current user
const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw handleSupabaseError(error);
  
  if (!data.user) {
    throw new Error('Not authenticated');
  }
  
  return {
    id: data.user.id,
    username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'anonymous',
  };
};

export const blogApi = {
  // Posts
  getPosts: async () => {
    try {
      console.log('Fetching posts from Supabase');
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw handleSupabaseError(error);
      
      console.log(`Retrieved ${data?.length || 0} posts`);
      return data || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  getPost: async (slug: string) => {
    try {
      console.log(`Fetching post with slug: ${slug}`);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw handleSupabaseError(error);
      
      console.log('Retrieved post:', data);
      return data;
    } catch (error) {
      console.error(`Error fetching post with slug ${slug}:`, error);
      throw error;
    }
  },

  createPost: async (data: Partial<Post>) => {
    try {
      console.log('Creating post with data:', data);
      
      // Generate a slug if not provided
      if (!data.slug && data.title) {
        data.slug = generateSlug(data.title);
      }
      
      // Get current user for author information
      const author = await getCurrentUser();
      
      // Prepare post data
      const postData = {
        ...data,
        id: uuidv4(),
        author_id: author.id,
        author_username: author.username,
        categories: Array.isArray(data.categories) ? data.categories : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views_count: 0,
      };
      
      // Handle file upload for cover_image if it's a File object
      let coverImageUrl = data.cover_image;
      if (data.cover_image instanceof File) {
        const file = data.cover_image;
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `cover_images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('blog')
          .upload(filePath, file);
        
        if (uploadError) throw handleSupabaseError(uploadError);
        
        const { data: urlData } = supabase.storage
          .from('blog')
          .getPublicUrl(filePath);
        
        coverImageUrl = urlData.publicUrl;
      }
      
      // Insert post with cover image URL if available
      const { data: post, error } = await supabase
        .from('posts')
        .insert({
          ...postData,
          cover_image: coverImageUrl,
          author: { id: author.id, username: author.username },
        })
        .select()
        .single();
      
      if (error) throw handleSupabaseError(error);
      
      console.log('Post created successfully:', post);
      return post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  updatePost: async (slug: string, data: Partial<Post>) => {
    try {
      console.log(`Updating post with slug ${slug} and data:`, data);
      
      // Get the post to update
      const { data: existingPost, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (fetchError) throw handleSupabaseError(fetchError);
      
      // Handle file upload for cover_image if it's a File object
      let coverImageUrl = data.cover_image;
      if (data.cover_image instanceof File) {
        const file = data.cover_image;
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `cover_images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('blog')
          .upload(filePath, file);
        
        if (uploadError) throw handleSupabaseError(uploadError);
        
        const { data: urlData } = supabase.storage
          .from('blog')
          .getPublicUrl(filePath);
        
        coverImageUrl = urlData.publicUrl;
      }
      
      // Update post data
      const updateData = {
        ...data,
        cover_image: coverImageUrl,
        updated_at: new Date().toISOString(),
        categories: Array.isArray(data.categories) ? data.categories : existingPost.categories,
        tags: Array.isArray(data.tags) ? data.tags : existingPost.tags,
      };
      
      // Update the post
      const { data: updatedPost, error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('slug', slug)
        .select()
        .single();
      
      if (error) throw handleSupabaseError(error);
      
      console.log('Post updated successfully:', updatedPost);
      return updatedPost;
    } catch (error) {
      console.error(`Error updating post with slug ${slug}:`, error);
      throw error;
    }
  },

  deletePost: async (slug: string) => {
    try {
      console.log(`Deleting post with slug: ${slug}`);
      
      // Delete the post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('slug', slug);
      
      if (error) throw handleSupabaseError(error);
      
      console.log(`Post with slug ${slug} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting post with slug ${slug}:`, error);
      throw error;
    }
  },

  // Categories
  getCategories: async () => {
    try {
      console.log('Fetching categories from Supabase');
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw handleSupabaseError(error);
      
      console.log(`Retrieved ${data?.length || 0} categories`);
      return { data };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  getCategory: async (slug: string) => {
    try {
      console.log(`Fetching category with slug: ${slug}`);
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw handleSupabaseError(error);
      
      console.log('Retrieved category:', data);
      return data;
    } catch (error) {
      console.error(`Error fetching category with slug ${slug}:`, error);
      throw error;
    }
  },

  createCategory: async (data: Partial<Category>) => {
    try {
      console.log('Creating category with data:', data);
      
      // Generate a slug if not provided
      if (!data.slug && data.name) {
        data.slug = generateSlug(data.name);
      }
      
      // Insert the category
      const { data: category, error } = await supabase
        .from('categories')
        .insert({
          ...data,
          id: uuidv4(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw handleSupabaseError(error);
      
      console.log('Category created successfully:', category);
      return category;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (slug: string, data: Partial<Category>) => {
    try {
      console.log(`Updating category with slug ${slug} and data:`, data);
      
      // Update the category
      const { data: category, error } = await supabase
        .from('categories')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('slug', slug)
        .select()
        .single();
      
      if (error) throw handleSupabaseError(error);
      
      console.log('Category updated successfully:', category);
      return category;
    } catch (error) {
      console.error(`Error updating category with slug ${slug}:`, error);
      throw error;
    }
  },

  deleteCategory: async (slug: string) => {
    try {
      console.log(`Deleting category with slug: ${slug}`);
      
      // Delete the category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('slug', slug);
      
      if (error) throw handleSupabaseError(error);
      
      console.log(`Category with slug ${slug} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting category with slug ${slug}:`, error);
      throw error;
    }
  },

  // Tags
  getTags: async () => {
    try {
      console.log('Fetching tags from Supabase');
      
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      
      if (error) throw handleSupabaseError(error);
      
      console.log(`Retrieved ${data?.length || 0} tags`);
      return { data };
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  },

  getTag: async (slug: string) => {
    try {
      console.log(`Fetching tag with slug: ${slug}`);
      
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw handleSupabaseError(error);
      
      console.log('Retrieved tag:', data);
      return data;
    } catch (error) {
      console.error(`Error fetching tag with slug ${slug}:`, error);
      throw error;
    }
  },

  createTag: async (data: Partial<Tag>) => {
    try {
      console.log('Creating tag with data:', data);
      
      // Generate a slug if not provided
      if (!data.slug && data.name) {
        data.slug = generateSlug(data.name);
      }
      
      // Insert the tag
      const { data: tag, error } = await supabase
        .from('tags')
        .insert({
          ...data,
          id: uuidv4(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw handleSupabaseError(error);
      
      console.log('Tag created successfully:', tag);
      return tag;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  },

  updateTag: async (slug: string, data: Partial<Tag>) => {
    try {
      console.log(`Updating tag with slug ${slug} and data:`, data);
      
      // Update the tag
      const { data: tag, error } = await supabase
        .from('tags')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('slug', slug)
        .select()
        .single();
      
      if (error) throw handleSupabaseError(error);
      
      console.log('Tag updated successfully:', tag);
      return tag;
    } catch (error) {
      console.error(`Error updating tag with slug ${slug}:`, error);
      throw error;
    }
  },

  deleteTag: async (slug: string) => {
    try {
      console.log(`Deleting tag with slug: ${slug}`);
      
      // Delete the tag
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('slug', slug);
      
      if (error) throw handleSupabaseError(error);
      
      console.log(`Tag with slug ${slug} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting tag with slug ${slug}:`, error);
      throw error;
    }
  },
};