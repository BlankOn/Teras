import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
// import { cloudflare } from '@cloudflare/vite-plugin'
import mdx from 'fumadocs-mdx/vite'
import * as MdxConfig from './source.config'
import { checksumPlugin } from './src/plugins/checksum'
import { rawNewsPlugin } from './src/plugins/raw-news'

const config = defineConfig({
  plugins: [
    checksumPlugin(),
    mdx(MdxConfig),
    rawNewsPlugin(),
    devtools(),
    // cloudflare({ viteEnvironment: { name: 'ssr' } }),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      preset: 'static',
      // The crawler only follows <a> links, so seed every language root.
      pages: [{ path: '/en' }, { path: '/id' }],
      prerender: {
        enabled: true,
        autoSubfolderIndex: true,
      },
      // Static hosts fall back to /index.html for paths that were not
      // prerendered. Make it a data-less SPA shell so the client renders the
      // requested route instead of failing to hydrate another page's markup.
      spa: {
        enabled: true,
        prerender: { outputPath: '/index' },
      },
    }),
    viteReact(),
  ],
})

export default config
