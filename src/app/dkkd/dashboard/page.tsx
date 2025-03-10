'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Pencil, Trash, Eye, FileText, Tag, BarChart2, Calendar, ArrowUp, ArrowDown, Settings, LogOut } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PostForm } from '@/components/dkkd/PostForm'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import authApi from '@/lib/api/supabase-auth'
import { blogApi } from '@/lib/api/supabase-blog'
import type { Post } from '@/lib/api/blog'
import { toast } from 'sonner'

interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // First check if user is authenticated
        const isAuth = await authApi.isAuthenticated()
        if (!isAuth) {
          // Redirect to login if not authenticated
          window.location.href = '/dkkd/login?from=/dkkd/dashboard'
          return
        }
        
        // Only load data if authenticated
        const [userData, postsData] = await Promise.all([
          authApi.getMe(),
          blogApi.getPosts()
        ])
        setUser(userData)
        setPosts(Array.isArray(postsData) ? postsData : postsData.results || [])
      } catch (error) {
        console.error('Failed to load data:', error)
        toast.error('Failed to load data')
        
        // If we get an auth error, redirect to login
        if (error instanceof Error && 
            (error.message.includes('Auth session missing') || 
             error.message.includes('Not authenticated'))) {
          window.location.href = '/dkkd/login?from=/dkkd/dashboard'
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSavePost = async (data: any) => {
    try {
      let savedPost
      if (isEditing && selectedPost) {
        savedPost = await blogApi.updatePost(selectedPost.slug, data)
        setPosts(posts.map(p => p.id === savedPost.id ? savedPost : p))
        toast.success('Post updated successfully')
      } else {
        savedPost = await blogApi.createPost(data)
        setPosts([...posts, savedPost])
        toast.success('Post created successfully')
      }
      setActiveTab('posts')
    } catch (error) {
      console.error('Failed to save post:', error)
      toast.error('Failed to save post')
    }
  }

  const handleDeletePost = async (post: Post) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await blogApi.deletePost(post.slug)
      setPosts(posts.filter(p => p.id !== post.id))
      toast.success('Post deleted successfully')
    } catch (error) {
      console.error('Failed to delete post:', error)
      toast.error('Failed to delete post')
    }
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
      // Redirect is handled in the auth API
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (!user || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load your dashboard</p>
        </div>
      </div>
    )
  }

  const publishedPosts = posts.filter(p => p.status === 'published')
  const draftPosts = posts.filter(p => p.status === 'draft')
  const totalViews = posts.reduce((sum, post) => sum + post.views_count, 0)
  const recentPosts = [...posts].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-8">
          <h1 className="text-2xl font-bold">Blog Dashboard</h1>
          <div className="ml-auto flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
                <AvatarFallback>{user.first_name?.[0] || user.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.first_name || user.username}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-[400px] grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <BarChart2 className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="posts" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Posts</span>
              </TabsTrigger>
              <TabsTrigger value="editor" className="flex items-center space-x-2">
                {isEditing ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                <span>{isEditing ? "Edit" : "New"}</span>
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{posts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {posts.length > 0 ? `+${posts.length} from last month` : 'No posts yet'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{publishedPosts.length}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ArrowUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+{publishedPosts.length}</span>
                    <span className="ml-1">published</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Draft Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{draftPosts.length}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ArrowDown className="h-3 w-3 text-yellow-500" />
                    <span className="text-yellow-500">{draftPosts.length}</span>
                    <span className="ml-1">in draft</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalViews}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all published posts
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>Your latest blog posts and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                        <div className="flex items-center space-x-4">
                          <div className={`w-2 h-2 rounded-full ${
                            post.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          <div>
                            <p className="font-medium">{post.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(post.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span>{post.views_count} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>All Posts</CardTitle>
                  <CardDescription>Manage your blog posts</CardDescription>
                </div>
                <Button onClick={() => {
                  setSelectedPost(null)
                  setIsEditing(false)
                  setActiveTab('editor')
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Post
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              post.status === 'published' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                            }`}>
                              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                            </div>
                          </TableCell>
                          <TableCell>{new Date(post.published_at || post.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{post.views_count}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setSelectedPost(post)
                                  setIsEditing(true)
                                  setActiveTab('editor')
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeletePost(post)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editor">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>{isEditing ? "Edit Post" : "Create New Post"}</CardTitle>
                  <CardDescription>
                    {isEditing 
                      ? "Update your blog post content and settings" 
                      : "Create a new blog post with rich content"}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('posts')}
                >
                  Cancel
                </Button>
              </CardHeader>
              <CardContent>
                <PostForm
                  post={selectedPost}
                  onSave={handleSavePost}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
