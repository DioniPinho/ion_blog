import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Globe, Lock } from 'lucide-react';

interface PostFormValues {
  visibility: 'public' | 'private';
}

interface PostVisibilityOptionsProps {
  control: Control<PostFormValues>;
}

export function PostVisibilityOptions({ control }: PostVisibilityOptionsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="visibility"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Visibility</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="public"
                    id="public"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="public"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Globe className="mb-2 h-6 w-6" />
                    <div className="space-y-1 text-center">
                      <p className="font-medium leading-none">Public</p>
                      <p className="text-sm text-muted-foreground">
                        Visible to everyone
                      </p>
                    </div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="private"
                    id="private"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="private"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Lock className="mb-2 h-6 w-6" />
                    <div className="space-y-1 text-center">
                      <p className="font-medium leading-none">Private</p>
                      <p className="text-sm text-muted-foreground">
                        Only visible to you
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormDescription>
              Choose who can see your post
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
} 