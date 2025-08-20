import React from 'react'

type MDXComponents = {
  [key: string]: React.ComponentType<Record<string, unknown>>
}
import { mdxComponents } from '@/components/blog/MDXComponents'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  }
}