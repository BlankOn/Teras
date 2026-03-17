import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import mdx from 'fumadocs-mdx/vite'
import * as MdxConfig from './source.config'
import { checksumPlugin } from './src/plugins/checksum'

const config = defineConfig({
  plugins: [
    checksumPlugin(),
    mdx(MdxConfig),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      preset: 'node',
    }),
    viteReact(),
  ],
})

export default config
