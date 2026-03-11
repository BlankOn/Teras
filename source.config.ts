import { defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config'
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins'
import { z } from 'zod/v4'

// Global config to disable remark-image for external URLs in dev content
export default defineConfig({
  mdxOptions: {
    remarkImageOptions: false,
    remarkPlugins: [remarkMdxMermaid],
  },
})

export const wiki = defineDocs({
  dir: 'content/wiki',
  docs: {
    schema: frontmatterSchema.extend({
      editPath: z.string().optional(),
    }),
  },
})
