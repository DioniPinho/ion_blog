'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePosts } from '@/hooks/use-posts';
import { Post } from '@/lib/api/supabase-blog';
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
import { Loader2, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Form validation schema
const postSchema = z.object({
  // English content
  title_en: z.string().min(1, 'English title is required').max(200, 'Title is too long'),
  content_en: z.string().min(1, 'English content is required'),
  excerpt_en: z.string().max(160, 'Excerpt must be less than 160 characters'),
  
  // Portuguese content
  title_pt: z.string().min(1, 'Portuguese title is required').max(200, 'Title is too long'),
  content_pt: z.string().min(1, 'Portuguese content is required'),
  excerpt_pt: z.string().max(160, 'Excerpt must be less than 160 characters'),
  
  // Common fields
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
  const [activeTab, setActiveTab] = React.useState('en');

  // Extract language-specific content from initialData if available
  const getInitialData = () => {
    if (!initialData) return {};
    
    // Check if we have a post with locale information
    const isEnglish = !initialData.locale || initialData.locale === 'en';
    
    return {
      title_en: isEnglish ? initialData.title : '',
      content_en: isEnglish ? initialData.content : '',
      excerpt_en: isEnglish ? initialData.excerpt : '',
      
      title_pt: initialData.locale === 'pt' ? initialData.title : '',
      content_pt: initialData.locale === 'pt' ? initialData.content : '',
      excerpt_pt: initialData.locale === 'pt' ? initialData.excerpt : '',
      
      status: initialData.status || 'draft',
      visibility: 'public',
      categories: initialData.categories || [],
      tags: initialData.tags || [],
    };
  };

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title_en: '',
      content_en: '',
      excerpt_en: '',
      title_pt: '',
      content_pt: '',
      excerpt_pt: '',
      status: 'draft',
      visibility: 'public',
      categories: [],
      tags: [],
      ...getInitialData(),
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
      if (!data.title_en || !data.title_pt) {
        toast.error('Title is required in both languages');
        return;
      }
      
      // Generate a common slug from the English title if not provided
      const slug = initialData?.slug || data.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      // Create or update the English version
      const enPostData = {
        title: data.title_en,
        content: data.content_en || '',
        excerpt: data.excerpt_en || '',
        status: data.status || 'draft',
        slug: slug,
        locale: 'en',
        categories: Array.isArray(data.categories) ? data.categories : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
      };

      // Create or update the Portuguese version
      const ptPostData = {
        title: data.title_pt,
        content: data.content_pt || '',
        excerpt: data.excerpt_pt || '',
        status: data.status || 'draft',
        slug: slug,
        locale: 'pt',
        categories: Array.isArray(data.categories) ? data.categories : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
      };

      console.log('Formatted English post data for API:', enPostData);
      console.log('Formatted Portuguese post data for API:', ptPostData);

      let enResult, ptResult;
      
      if (initialData) {
        console.log('Updating existing post with slug:', initialData.slug);
        // For update, we need to determine which language version we're updating
        if (initialData.locale === 'pt') {
          ptResult = await updatePost(initialData.slug, ptPostData);
          enResult = await createPost(enPostData);
        } else {
          enResult = await updatePost(initialData.slug, enPostData);
          ptResult = await createPost(ptPostData);
        }
      } else {
        console.log('Creating new post in both languages');
        enResult = await createPost(enPostData);
        ptResult = await createPost(ptPostData);
      }
      
      if (enResult && ptResult) {
        toast.success(initialData ? 'Post updated successfully in both languages' : 'Post created successfully in both languages');
        router.push('/admin/posts');
      } else {
        toast.error(initialData ? 'Failed to update post in one or both languages' : 'Failed to create post in one or both languages');
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
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium">Multilingual Content</h2>
          </div>
          
          <Tabs defaultValue="en" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="pt">Portuguese</TabsTrigger>
            </TabsList>
            
            <TabsContent value="en" className="space-y-4">
              <FormField
                control={form.control}
                name="title_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (English)</FormLabel>
                    <FormControl>
                      <Input placeholder="Post title in English" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (English)</FormLabel>
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
                            placeholder="Write your post content in English using Markdown..."
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
                name="excerpt_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt (English)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your post in English..."
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
            </TabsContent>
            
            <TabsContent value="pt" className="space-y-4">
              <FormField
                control={form.control}
                name="title_pt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (Portuguese)</FormLabel>
                    <FormControl>
                      <Input placeholder="Post title in Portuguese" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content_pt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (Portuguese)</FormLabel>
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
                            placeholder="Write your post content in Portuguese using Markdown..."
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
                name="excerpt_pt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt (Portuguese)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your post in Portuguese..."
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
            </TabsContent>
          </Tabs>

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
              variant="outline"
              onClick={() => router.push('/admin/posts')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}