import { defineConfig, defineDocs } from 'fumadocs-mdx/config'
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins'

// Global config to disable remark-image for external URLs in dev content
export default defineConfig({
  mdxOptions: {
    remarkImageOptions: false,
    remarkPlugins: [remarkMdxMermaid],
  },
})

export const wiki = defineDocs({
  dir: 'content/wiki',
})
