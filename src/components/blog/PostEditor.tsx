'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePosts } from '@/hooks/use-posts';
import { Post } from '@/lib/api/blog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PostMetadataFields } from './PostMetadataFields';
import { PostContent } from './PostContent';
import { PostVisibilityOptions } from './PostVisibilityOptions';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Form validation schema
const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(160, 'Excerpt must be less than 160 characters'),
  status: z.enum(['draft', 'published']),
  visibility: z.enum(['public', 'private']),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
});

type PostFormValues = z.infer<typeof postSchema>;

interface PostEditorProps {
  initialData?: Post;
  className?: string;
}

export function PostEditor({ initialData, className }: PostEditorProps) {
  const router = useRouter();
  const { createPost, updatePost, fetchTags, fetchCategories } = usePosts();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      excerpt: initialData?.excerpt || '',
      status: initialData?.status || 'draft',
      visibility: 'public',
      categories: initialData?.categories || [],
      tags: initialData?.tags || [],
    },
  });

  // Load tags and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      console.log('Loading tags and categories');
      try {
        const tagsSuccess = await fetchTags();
        console.log('Tags loaded successfully:', tagsSuccess);
        
        const categoriesSuccess = await fetchCategories();
        console.log('Categories loaded successfully:', categoriesSuccess);
        
        if (!tagsSuccess || !categoriesSuccess) {
          console.error('Failed to load tags or categories');
          toast.error('Failed to load tags or categories');
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error loading data');
      }
    };
    
    loadData();
  }, [fetchTags, fetchCategories]);

  // Handle form submission
  const onSubmit = async (data: PostFormValues) => {
    try {
      setIsSubmitting(true);
      console.log('Form submitted with data:', data);
      
      // Validate the form data
      if (!data.title) {
        toast.error('Title is required');
        return;
      }
      
      // Format the data for the API
      const postData = {
        title: data.title,
        content: data.content || '',
        excerpt: data.excerpt || '',
        status: data.status || 'draft',
        // Generate a slug from the title if not provided
        slug: initialData?.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        // Include categories and tags
        categories: Array.isArray(data.categories) ? data.categories : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
      };

      console.log('Formatted post data for API:', postData);

      let result;
      if (initialData) {
        console.log('Updating existing post with slug:', initialData.slug);
        result = await updatePost(initialData.slug, postData);
        console.log('Update result:', result);
      } else {
        console.log('Creating new post');
        result = await createPost(postData);
        console.log('Create result:', result);
      }
      
      if (result) {
        toast.success(initialData ? 'Post updated successfully' : 'Post created successfully');
        router.push('/admin/posts');
      } else {
        toast.error(initialData ? 'Failed to update post' : 'Failed to create post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      if (error.response?.data) {
        console.error('API error details:', error.response.data);
        // Display specific error messages from the API
        const errorMessages = Object.entries(error.response.data)
          .map(([field, messages]) => `${field}: ${messages}`)
          .join(', ');
        toast.error(`Failed to save post: ${errorMessages}`);
      } else {
        toast.error(`Failed to save post: ${(error as Error).message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("space-y-8", className)}>
      <Form {...form}>
        <form onSubmit={(e) => {
          e.preventDefault();
          console.log('Form submitted');
          form.handleSubmit(onSubmit)();
        }} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Post title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPreviewMode(!previewMode)}
                    >
                      {previewMode ? "Edit" : "Preview"}
                    </Button>
                  </div>
                  <FormControl>
                    {previewMode ? (
                      <div className="min-h-[400px] w-full rounded-md border border-input bg-transparent px-3 py-2">
                        <PostContent content={field.value} />
                      </div>
                    ) : (
                      <Textarea
                        placeholder="Write your post content in Markdown..."
                        className="min-h-[400px] font-mono"
                        {...field}
                      />
                    )}
                  </FormControl>
                </div>
                <FormDescription>
                  Write your post content using Markdown syntax
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of your post..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A short description that will appear in post previews (max 160 characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <PostMetadataFields
            control={form.control}
            categories={form.watch('categories')}
            tags={form.watch('tags')}
            onAddCategory={(category) => {
              console.log('Adding category:', category);
              const current = form.getValues('categories') || [];
              if (!current.includes(category)) {
                form.setValue('categories', [...current, category]);
                console.log('Updated categories:', form.getValues('categories'));
              }
            }}
            onRemoveCategory={(category) => {
              console.log('Removing category:', category);
              const current = form.getValues('categories') || [];
              form.setValue('categories', current.filter((c) => c !== category));
              console.log('Updated categories:', form.getValues('categories'));
            }}
            onAddTag={(tag) => {
              console.log('Adding tag:', tag);
              const current = form.getValues('tags') || [];
              if (!current.includes(tag)) {
                form.setValue('tags', [...current, tag]);
                console.log('Updated tags:', form.getValues('tags'));
              }
            }}
            onRemoveTag={(tag) => {
              console.log('Removing tag:', tag);
              const current = form.getValues('tags') || [];
              form.setValue('tags', current.filter((t) => t !== tag));
              console.log('Updated tags:', form.getValues('tags'));
            }}
          />

          <PostVisibilityOptions control={form.control} />

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => {
                console.log('Save button clicked');
                console.log('Form values:', form.getValues());
                
                // Validate form before submitting
                form.trigger().then(isValid => {
                  if (isValid) {
                    console.log('Form is valid, submitting...');
                    const values = form.getValues();
                    console.log('Manually calling onSubmit with values:', values);
                    onSubmit(values);
                  } else {
                    console.error('Form validation failed');
                    toast.error('Please fix the form errors before submitting');
                  }
                });
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
            <Button
              type="button"
              onClick={() => {
                console.log('Publish button clicked');
                
                // Validate form before submitting
                form.trigger().then(isValid => {
                  if (isValid) {
                    console.log('Form is valid, submitting...');
                    const values = form.getValues();
                    values.status = 'published';
                    console.log('Updated form values:', values);
                    
                    // Manually call onSubmit with the form values
                    console.log('Manually calling onSubmit with values:', values);
                    onSubmit(values);
                  } else {
                    console.error('Form validation failed');
                    toast.error('Please fix the form errors before submitting');
                  }
                });
              }}
              disabled={isSubmitting}
              variant="default"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 