'use client'

import { useState, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MarkdownEditor } from "@/components/dkkd/MarkdownEditor"
import { FileImage, Tag, X } from 'lucide-react'
import type { Post, Category, Tag as TagType } from "@/lib/api/blog"
import { blogApi } from "@/lib/api/supabase-blog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const postFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  status: z.enum(["draft", "published"]),
  featured: z.boolean().default(false),
  cover_image: z.any().optional(),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  tags: z.array(z.string()),
})

type PostFormValues = z.infer<typeof postFormSchema>

interface PostFormProps {
  post: Post | null;
  onSave: (data: PostFormValues) => void;
}

export function PostForm({ post, onSave }: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<TagType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categorySearch, setCategorySearch] = useState("")
  const [tagSearch, setTagSearch] = useState("")

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      excerpt: post?.excerpt || "",
      status: post?.status || "draft",
      featured: post?.featured || false,
      categories: post?.categories || [],
      tags: post?.tags || [],
    },
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          blogApi.getCategories(),
          blogApi.getTags()
        ])
        if (categoriesData?.results) {
          setCategories(categoriesData.results)
        } else if (Array.isArray(categoriesData)) {
          setCategories(categoriesData)
        } else {
          setCategories([])
        }
        
        if (tagsData?.results) {
          setTags(tagsData.results)
        } else if (Array.isArray(tagsData)) {
          setTags(tagsData)
        } else {
          setTags([])
        }
      } catch (error) {
        console.error('Failed to load categories and tags:', error)
        toast.error('Failed to load form data')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredCategories = useMemo(() => {
    const search = categorySearch.trim().toLowerCase()
    if (!search) return []
    return categories.filter(c => c.name.toLowerCase().includes(search))
  }, [categories, categorySearch])

  const filteredTags = useMemo(() => {
    const search = tagSearch.trim().toLowerCase()
    if (!search) return []
    return tags.filter(t => t.name.toLowerCase().includes(search))
  }, [tags, tagSearch])

  async function onSubmit(data: PostFormValues) {
    setIsSubmitting(true)
    try {
      await onSave(data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to save post')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Loading form data...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load categories and tags</p>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="your-post-slug" {...field} />
                    </FormControl>
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
                        placeholder="Brief description of your post"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select post status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Featured Post
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cover_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileImage className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload cover image
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                field.onChange(file)
                              }
                            }}
                          />
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Categories & Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((id) => {
                          const category = categories.find(c => c.id === id)
                          if (!category) return null
                          return (
                            <Badge
                              key={category.id}
                              variant="default"
                              className="h-7 px-3 cursor-pointer hover:bg-primary/90"
                              onClick={() => {
                                field.onChange(field.value.filter(v => v !== id))
                              }}
                            >
                              {category.name}
                              <X className="w-3 h-3 ml-2" />
                            </Badge>
                          )
                        })}
                      </div>
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            placeholder="Add or search categories..."
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            onKeyDown={async (e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                const search = categorySearch.trim()
                                if (!search) return

                                const existingCategory = categories.find(
                                  c => c.name.toLowerCase() === search.toLowerCase()
                                )
                                
                                if (existingCategory) {
                                  if (!field.value.includes(existingCategory.id)) {
                                    field.onChange([...field.value, existingCategory.id])
                                  }
                                } else {
                                  try {
                                    const newCategory = await blogApi.createCategory({ name: search })
                                    setCategories(prev => [...prev, newCategory])
                                    field.onChange([...field.value, newCategory.id])
                                    toast.success('Category created')
                                  } catch (error) {
                                    toast.error('Failed to create category')
                                  }
                                }
                                setCategorySearch('')
                              }
                            }}
                          />
                          {categorySearch && filteredCategories.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md">
                              <div className="p-2">
                                {filteredCategories.map((category) => (
                                  <div
                                    key={category.id}
                                    className="flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => {
                                      if (!field.value.includes(category.id)) {
                                        field.onChange([...field.value, category.id])
                                      }
                                      setCategorySearch('')
                                    }}
                                  >
                                    {category.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {categorySearch && filteredCategories.length === 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md">
                              <div className="p-2">
                                <div
                                  className="flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                  onClick={async () => {
                                    const search = categorySearch.trim()
                                    if (!search) return
                                    try {
                                      const newCategory = await blogApi.createCategory({ name: search })
                                      setCategories(prev => [...prev, newCategory])
                                      field.onChange([...field.value, newCategory.id])
                                      setCategorySearch('')
                                      toast.success('Category created')
                                    } catch (error) {
                                      toast.error('Failed to create category')
                                    }
                                  }}
                                >
                                  Create category "{categorySearch.trim()}"
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((id) => {
                          const tag = tags.find(t => t.id === id)
                          if (!tag) return null
                          return (
                            <Badge
                              key={tag.id}
                              variant="secondary"
                              className="h-7 px-3 cursor-pointer hover:bg-secondary/80"
                              onClick={() => {
                                field.onChange(field.value.filter(v => v !== id))
                              }}
                            >
                              {tag.name}
                              <X className="w-3 h-3 ml-2" />
                            </Badge>
                          )
                        })}
                      </div>
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            placeholder="Add or search tags..."
                            value={tagSearch}
                            onChange={(e) => setTagSearch(e.target.value)}
                            onKeyDown={async (e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                const search = tagSearch.trim()
                                if (!search) return

                                const existingTag = tags.find(
                                  t => t.name.toLowerCase() === search.toLowerCase()
                                )
                                
                                if (existingTag) {
                                  if (!field.value.includes(existingTag.id)) {
                                    field.onChange([...field.value, existingTag.id])
                                  }
                                } else {
                                  try {
                                    const newTag = await blogApi.createTag({ name: search })
                                    setTags(prev => [...prev, newTag])
                                    field.onChange([...field.value, newTag.id])
                                    toast.success('Tag created')
                                  } catch (error) {
                                    toast.error('Failed to create tag')
                                  }
                                }
                                setTagSearch('')
                              }
                            }}
                          />
                          {tagSearch && filteredTags.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md">
                              <div className="p-2">
                                {filteredTags.map((tag) => (
                                  <div
                                    key={tag.id}
                                    className="flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => {
                                      if (!field.value.includes(tag.id)) {
                                        field.onChange([...field.value, tag.id])
                                      }
                                      setTagSearch('')
                                    }}
                                  >
                                    {tag.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {tagSearch && filteredTags.length === 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md">
                              <div className="p-2">
                                <div
                                  className="flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                  onClick={async () => {
                                    const search = tagSearch.trim()
                                    if (!search) return
                                    try {
                                      const newTag = await blogApi.createTag({ name: search })
                                      setTags(prev => [...prev, newTag])
                                      field.onChange([...field.value, newTag.id])
                                      setTagSearch('')
                                      toast.success('Tag created')
                                    } catch (error) {
                                      toast.error('Failed to create tag')
                                    }
                                  }}
                                >
                                  Create tag "{tagSearch.trim()}"
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MarkdownEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Post"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
