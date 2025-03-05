'use client'

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function MarkdownEditor({
  value,
  onChange,
  className,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState("write")

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      className={cn("w-full", className)}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="write" className="mt-0">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your content in Markdown..."
          className="min-h-[500px] font-mono"
        />
      </TabsContent>
      <TabsContent value="preview" className="mt-0">
        <div className="min-h-[500px] rounded-md border bg-background p-4">
          <ReactMarkdown>{value || "Nothing to preview"}</ReactMarkdown>
        </div>
      </TabsContent>
    </Tabs>
  )
}
