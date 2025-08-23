'use client'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple regex-based markdown parser that handles HTML better
  const parseMarkdown = (text: string): string => {
    return text
      // Clean up problematic HTML attributes that might break rendering
      .replace(/style="[^"]*"/g, '')
      .replace(/width="\d+"/g, '')
      .replace(/height="\d+"/g, '')
      
      // Handle headers
      .replace(/^# (.+)$/gm, '<h1 class="text-sm font-semibold font-virtue mb-2 mt-4 first:mt-0 text-foreground">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-sm font-semibold font-virtue mb-2 mt-3 text-foreground">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-xs font-semibold font-virtue mb-1 mt-2 text-foreground">$1</h3>')
      
      // Handle code blocks
      .replace(/```([^`\n]*)\n([\s\S]*?)```/g, '<pre class="bg-muted border text-xs p-3 rounded overflow-x-auto my-2"><code>$2</code></pre>')
      
      // Handle inline code
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs font-mono text-foreground">$1</code>')
      
      // Handle bold and italic
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="text-muted-foreground">$1</em>')
      
      // Handle links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary no-underline hover:underline font-normal" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Handle unordered lists
      .replace(/^\- (.+)$/gm, '<li class="text-muted-foreground my-0.5 text-xs">$1</li>')
      .replace(/(<li>.*<\/li>)/g, '<ul class="text-xs my-2 list-disc list-inside">$1</ul>')
      
      // Handle ordered lists
      .replace(/^\d+\. (.+)$/gm, '<li class="text-muted-foreground my-0.5 text-xs">$1</li>')
      .replace(/(<li>.*<\/li>)/g, '<ol class="text-xs my-2 list-decimal list-inside">$1</ol>')
      
      // Handle paragraphs (convert double newlines to paragraph breaks)
      .replace(/\n\n+/g, '</p><p class="text-xs leading-relaxed text-muted-foreground my-2">')
      .replace(/^(?!<[hul]|<pre|<\/)/gm, '<p class="text-xs leading-relaxed text-muted-foreground my-2">')
      .replace(/<p[^>]*>(<[hul]|<pre)/g, '$1')
      .replace(/(<\/[hul]>|<\/pre>)<p[^>]*>/g, '$1')
      .replace(/<p[^>]*>\s*$/g, '')
  }

  return (
    <div 
      className="prose-custom max-w-none"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  )
}