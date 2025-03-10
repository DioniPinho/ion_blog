import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Loader2 } from 'lucide-react';
import { Category, Tag } from '@/lib/api/supabase-blog';
import { usePosts } from '@/hooks/use-posts';

interface PostFormValues {
  categories: string[];
  tags: string[];
}

interface PostMetadataFieldsProps {
  control: Control<PostFormValues>;
  categories: string[];
  tags: string[];
  onAddCategory: (category: string) => void;
  onRemoveCategory: (category: string) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export function PostMetadataFields({
  control,
  categories: selectedCategories,
  tags: selectedTags,
  onAddCategory,
  onRemoveCategory,
  onAddTag,
  onRemoveTag,
}: PostMetadataFieldsProps) {
  const { categories, tags, loading, fetchCategories, fetchTags, createCategory, createTag } = usePosts();
  const [newCategory, setNewCategory] = React.useState('');
  const [tagInput, setTagInput] = React.useState('');
  const [showTagSuggestions, setShowTagSuggestions] = React.useState(false);
  const [filteredTags, setFilteredTags] = React.useState<string[]>([]);
  const [isCreatingCategory, setIsCreatingCategory] = React.useState(false);
  const [isCreatingTag, setIsCreatingTag] = React.useState(false);
  const [categoryInput, setCategoryInput] = React.useState('');
  const [filteredCategories, setFilteredCategories] = React.useState<Category[]>([]);
  const [showCategorySuggestions, setShowCategorySuggestions] = React.useState(false);

  // Effect to load tags and categories on component mount
  React.useEffect(() => {
    console.log('PostMetadataFields mounted');
    console.log('Initial tags:', tags);
    console.log('Initial categories:', categories);
  }, []);

  // Effect to update when tags or categories change
  React.useEffect(() => {
    console.log('Tags or categories updated');
    console.log('Current tags:', tags);
    console.log('Current categories:', categories);
  }, [tags, categories]);

  React.useEffect(() => {
    // Fetch categories and tags when component mounts
    const fetchData = async () => {
      console.log('Fetching categories and tags in PostMetadataFields');
      try {
        const tagsSuccess = await fetchTags();
        console.log('Tags loaded successfully:', tagsSuccess);
        
        const categoriesSuccess = await fetchCategories();
        console.log('Categories loaded successfully:', categoriesSuccess);
        
        if (!tagsSuccess || !categoriesSuccess) {
          console.error('Failed to load tags or categories');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [fetchCategories, fetchTags]);

  // Handle tag input change
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    
    // If input is not empty, show suggestions
    if (value.trim() !== '') {
      console.log('Setting showTagSuggestions to true');
      // Force re-filtering of tags
      const filtered = tags
        .filter(tag => 
          tag && typeof tag === 'object' && 'name' in tag && 
          typeof tag.name === 'string' &&
          tag.name.toLowerCase().includes(value.toLowerCase()) && 
          !selectedTags.includes(tag.name)
        )
        .slice(0, 5);
      
      setFilteredTags(filtered);
      setShowTagSuggestions(filtered.length > 0);
    } else {
      setShowTagSuggestions(false);
    }
  };

  // Handle category input change
  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategoryInput(value);
    
    // If input is not empty, show suggestions
    if (value.trim() !== '') {
      console.log('Setting showCategorySuggestions to true');
      // Force re-filtering of categories
      const filtered = categories
        .filter(category => 
          category && typeof category === 'object' && 'name' in category && 
          typeof category.name === 'string' &&
          category.name.toLowerCase().includes(value.toLowerCase()) && 
          !selectedCategories.includes(category.name)
        )
        .slice(0, 5);
      
      setFilteredCategories(filtered);
      setShowCategorySuggestions(filtered.length > 0);
    } else {
      setShowCategorySuggestions(false);
    }
  };

  // Handle tag input keydown
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      
      // If we have a matching suggestion selected, use that
      if (showTagSuggestions && filteredTags.length > 0) {
        addTag(filteredTags[0].name);
      } else {
        // Otherwise add the new tag
        addTag(tagInput.trim());
      }
    } else if (e.key === 'Escape') {
      setShowTagSuggestions(false);
    }
  };

  // Handle category input keydown
  const handleCategoryInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && categoryInput.trim() !== '') {
      e.preventDefault();
      
      // If we have a matching suggestion selected, use that
      if (showCategorySuggestions && filteredCategories.length > 0) {
        addCategory(filteredCategories[0].name);
      } else {
        // Otherwise add the new category
        addCategory(categoryInput.trim());
      }
    } else if (e.key === 'Escape') {
      setShowCategorySuggestions(false);
    }
  };

  // Add a tag
  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      try {
        // Check if tag already exists in the tags list
        const existingTag = tags.find(t => t.name.toLowerCase() === tag.toLowerCase());
        
        if (existingTag) {
          console.log('Using existing tag:', existingTag.name);
          onAddTag(existingTag.name);
        } else {
          console.log('Creating new tag:', tag);
          // Create new tag with proper data format
          createTag({ 
            name: tag,
            slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          }).then(newTag => {
            if (newTag) {
              console.log('Created new tag:', newTag);
              onAddTag(newTag.name);
              // Refresh tags list
              fetchTags();
            }
          }).catch(err => {
            console.error('Error creating tag:', err);
          });
        }
      } catch (error) {
        console.error('Error in addTag:', error);
      }
    }
    setTagInput('');
    setShowTagSuggestions(false);
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    onRemoveTag(tagToRemove);
    console.log('Removed tag:', tagToRemove);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      setIsCreatingCategory(true);
      try {
        // Check if category already exists
        const existingCategory = categories.find(c => c.name.toLowerCase() === newCategory.trim().toLowerCase());
        
        if (existingCategory) {
          console.log('Using existing category:', existingCategory.name);
          onAddCategory(existingCategory.name);
          setNewCategory('');
        } else {
          console.log('Creating new category:', newCategory.trim());
          const categoryData = {
            name: newCategory.trim(),
            slug: newCategory.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          };
          console.log('Category data:', categoryData);
          const category = await createCategory(categoryData);
          console.log('Created category:', category);
          if (category) {
            onAddCategory(category.name);
            // Refresh categories list
            fetchCategories();
          }
          setNewCategory('');
        }
      } catch (error) {
        console.error('Error creating category:', error);
      } finally {
        setIsCreatingCategory(false);
      }
    }
  };

  const addCategory = (category: string) => {
    if (category && !selectedCategories.includes(category)) {
      try {
        // Check if category already exists in the categories list
        const existingCategory = categories.find(c => c.name.toLowerCase() === category.toLowerCase());
        
        if (existingCategory) {
          console.log('Using existing category:', existingCategory.name);
          onAddCategory(existingCategory.name);
        } else {
          console.log('Creating new category:', category);
          // Create new category with proper data format
          createCategory({ 
            name: category,
            slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          }).then(newCategory => {
            if (newCategory) {
              console.log('Created new category:', newCategory);
              onAddCategory(newCategory.name);
              // Refresh categories list
              fetchCategories();
            }
          }).catch(err => {
            console.error('Error creating category:', err);
          });
        }
      } catch (error) {
        console.error('Error in addCategory:', error);
      }
    }
    setCategoryInput('');
    setShowCategorySuggestions(false);
  };

  const removeCategory = (categoryToRemove: string) => {
    onRemoveCategory(categoryToRemove);
    console.log('Removed category:', categoryToRemove);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="categories"
        render={() => (
          <FormItem>
            <FormLabel>Categories</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : categories.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    No categories available. Create one below.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedCategories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedCategories.map((category) => (
                          <div
                            key={category}
                            className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                          >
                            {category}
                            <button
                              type="button"
                              onClick={() => removeCategory(category)}
                              className="ml-1 rounded-full p-1 hover:bg-primary/20"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <Input
                        id="categoryInput"
                        placeholder="Add or search categories..."
                        value={categoryInput}
                        onChange={handleCategoryInputChange}
                        onKeyDown={handleCategoryInputKeyDown}
                        onFocus={() => categoryInput.trim() !== '' && setShowCategorySuggestions(true)}
                        onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 200)}
                      />
                      
                      {/* Category suggestions dropdown */}
                      {showCategorySuggestions && filteredCategories.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                          <ul className="py-1">
                            {filteredCategories.map((category) => (
                              <li
                                key={category.id}
                                className="px-4 py-2 hover:bg-muted cursor-pointer"
                                onClick={() => addCategory(category.name)}
                              >
                                {category.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <form onSubmit={handleAddCategory} className="flex space-x-2">
                      <Input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Add a new category..."
                        className="flex-1"
                        disabled={isCreatingCategory}
                      />
                      <Button type="submit" size="sm" disabled={isCreatingCategory}>
                        {isCreatingCategory ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Add'
                        )}
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="tags"
        render={() => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : tags.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    No tags available. Create one below.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedTags.map((tag) => (
                          <div
                            key={tag}
                            className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 rounded-full p-1 hover:bg-primary/20"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <Input
                        id="tagInput"
                        placeholder="Add or search tags..."
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onKeyDown={handleTagInputKeyDown}
                        onFocus={() => tagInput.trim() !== '' && setShowTagSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                      />
                      
                      {/* Tag suggestions dropdown */}
                      {showTagSuggestions && filteredTags.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                          <ul className="py-1">
                            {filteredTags.map((tag) => (
                              <li
                                key={tag.id}
                                className="px-4 py-2 hover:bg-muted cursor-pointer"
                                onClick={() => addTag(tag.name)}
                              >
                                {tag.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}