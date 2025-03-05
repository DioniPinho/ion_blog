'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PostEditor } from '@/components/blog/PostEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { blogApi, Post } from '@/lib/api/blog';
import { toast } from 'react-hot-toast';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const slug = params.slug as string;

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const data = await blogApi.getPost(slug);
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err as Error);
        toast.error('Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto py-6 text-center">
        <h1 className="text-3xl font-bold text-destructive">Error Loading Post</h1>
        <p className="mt-4 text-muted-foreground">
          Could not load the post. It may have been deleted or you don't have permission to view it.
        </p>
        <button
          onClick={() => router.push('/admin/posts')}
          className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Back to Posts
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Edit Post</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Post Editor</CardTitle>
          <CardDescription>
            Edit your blog post. Make changes and save when ready.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostEditor initialData={post} />
        </CardContent>
      </Card>
    </div>
  );
}
