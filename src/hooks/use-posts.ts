import { useState, useCallback } from 'react';
import { blogApi, Post, Category, Tag } from '@/lib/api/supabase-blog';
import { toast } from 'sonner';

interface UsePostsReturn {
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  loading: boolean;
  error: Error | null;
  fetchPosts: () => Promise<void>;
  fetchCategories: () => Promise<boolean>;
  fetchTags: () => Promise<boolean>;
  createPost: (data: Partial<Post>) => Promise<Post | null>;
  updatePost: (slug: string, data: Partial<Post>) => Promise<Post | null>;
  deletePost: (slug: string) => Promise<boolean>;
  createCategory: (name: string) => Promise<Category | null>;
  createTag: (name: string) => Promise<Tag | null>;
}

export function usePosts(): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogApi.getPosts();
      setPosts(response);
    } catch (err) {
      setError(err as Error);
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching categories from Supabase');
      const response = await blogApi.getCategories();
      console.log('Categories response:', response);
      
      if (response && response.data) {
        const categoriesData = response.data;
        
        if (Array.isArray(categoriesData)) {
          console.log('Setting categories from Supabase response:', categoriesData);
          setCategories(categoriesData);
        } else {
          console.error('Invalid categories data format:', categoriesData);
          setCategories([]);
        }
      } else {
        console.error('Invalid categories response:', response);
        setCategories([]);
      }
      return true;
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching categories:', err);
      setCategories([]);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching tags from Supabase');
      const response = await blogApi.getTags();
      console.log('Tags response:', response);
      
      if (response && response.data) {
        const tagsData = response.data;
        
        if (Array.isArray(tagsData)) {
          console.log('Setting tags from Supabase response:', tagsData);
          setTags(tagsData);
        } else {
          console.error('Invalid tags data format:', tagsData);
          setTags([]);
        }
      } else {
        console.error('Invalid tags response:', response);
        setTags([]);
      }
      return true;
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching tags:', err);
      setTags([]);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (data: Partial<Post>) => {
    try {
      setLoading(true);
      console.log('Creating post with data:', data);
      const result = await blogApi.createPost(data);
      console.log('Post created successfully:', result);
      setPosts((prev) => [...prev, result]);
      toast.success('Post created successfully');
      return result;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating post:', err);
      toast.error(`Failed to create post: ${(err as Error).message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (slug: string, data: Partial<Post>) => {
    try {
      setLoading(true);
      console.log(`Updating post with slug ${slug} and data:`, data);
      const result = await blogApi.updatePost(slug, data);
      console.log('Post updated successfully:', result);
      setPosts((prev) => prev.map((post) => (post.slug === slug ? result : post)));
      toast.success('Post updated successfully');
      return result;
    } catch (err) {
      setError(err as Error);
      console.error(`Error updating post with slug ${slug}:`, err);
      toast.error(`Failed to update post: ${(err as Error).message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (slug: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await blogApi.deletePost(slug);
      setPosts((prev) => prev.filter((post) => post.slug !== slug));
      toast.success('Post deleted successfully');
      return true;
    } catch (err) {
      setError(err as Error);
      toast.error('Failed to delete post');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (name: string): Promise<Category | null> => {
    try {
      console.log('Creating category with name:', name);
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      console.log('Creating category with data:', { name, slug });
      const response = await blogApi.createCategory({ name, slug });
      console.log('Category creation response:', response);
      setCategories((prev) => [...prev, response]);
      toast.success('Category created successfully');
      return response;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating category:', err);
      toast.error('Failed to create category');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTag = useCallback(async (name: string): Promise<Tag | null> => {
    try {
      console.log('Creating tag with name:', name);
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      console.log('Creating tag with data:', { name, slug });
      const response = await blogApi.createTag({ name, slug });
      console.log('Tag creation response:', response);
      setTags((prev) => [...prev, response]);
      toast.success('Tag created successfully');
      return response;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating tag:', err);
      toast.error('Failed to create tag');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    posts,
    categories,
    tags,
    loading,
    error,
    fetchPosts,
    fetchCategories,
    fetchTags,
    createPost,
    updatePost,
    deletePost,
    createCategory,
    createTag,
  };
}