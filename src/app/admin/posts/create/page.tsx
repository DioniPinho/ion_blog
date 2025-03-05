'use client';

import React from 'react';
import { PostEditor } from '@/components/blog/PostEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreatePostPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Create New Post</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Post Editor</CardTitle>
          <CardDescription>
            Create a new blog post. Fill in the details and save when ready.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostEditor />
        </CardContent>
      </Card>
    </div>
  );
}
