import { defineConfig, defineDocs } from 'fumadocs-mdx/config'

// Global config to disable remark-image for external URLs in dev content
export default defineConfig({
  mdxOptions: {
    remarkImageOptions: false,
  },
})

export const docs = defineDocs({
  dir: 'content/docs',
})

export const dev = defineDocs({
  dir: 'content/dev',
})
