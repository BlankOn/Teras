#!/usr/bin/env node

/**
 * Migration script for panduan-distribusi content
 *
 * Fetches BlankOn user documentation and images from GitHub and transforms
 * content to MDX format compatible with Fumadocs.
 *
 * Usage: node scripts/migrate-docs.mjs
 *
 * Source: https://github.com/BlankOn/panduan-distribusi/tree/master/contents
 * Target: content/docs/ (MDX files), public/docs/ (images)
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, '..')
const DOCS_DIR = join(PROJECT_ROOT, 'content', 'docs')
const IMAGES_DIR = join(PROJECT_ROOT, 'public', 'docs')

const BASE_URL =
  'https://raw.githubusercontent.com/BlankOn/panduan-distribusi/master/contents/'
const API_URL =
  'https://api.github.com/repos/BlankOn/panduan-distribusi/contents/contents/'

// Source files in order (15 chapters)
const SOURCE_FILES = [
  'BAB-001-IhwalBuku.md',
  'BAB-002-Pengenalan.md',
  'BAB-003-Pemasangan.md',
  'BAB-004-Manajemen-paket.md',
  'BAB-005-Destop.md',
  'BAB-006-Peramban-berkas.md',
  'BAB-007-Aplikasi-Internet.md',
  'BAB-008-Aplikasi-Perkantoran.md',
  'BAB-009-Aplikasi-Grafis.md',
  'BAB-010-Aplikasi-multimedia-hiburan.md',
  'BAB-011-Aplikasi-Aksesoris.md',
  'BAB-012-Pengaturan-Antarmuka-Teks.md',
  'BAB-013-Pengaturan-Piranti-Keras.md',
  'BAB-014-Manajemen-Pengguna-Dan-Kelompok.md',
  'BAB-015-Penutup.md',
]

// Image directories to migrate
const IMAGE_DIRS = ['Gambar', 'CuplikanLayar']

// Sidebar category organization (matching Daftar Isi structure)
const SIDEBAR_CATEGORIES = [
  {
    label: 'Pengenalan',
    chapters: ['ihwalbuku', 'pengenalan'],
  },
  {
    label: 'Memulai',
    chapters: ['pemasangan', 'destop', 'peramban-berkas'],
  },
  {
    label: 'Aplikasi',
    chapters: [
      'aplikasi-internet',
      'aplikasi-perkantoran',
      'aplikasi-grafis',
      'aplikasi-multimedia-hiburan',
      'aplikasi-aksesoris',
    ],
  },
  {
    label: 'Pengaturan Lanjutan',
    chapters: [
      'manajemen-paket',
      'pengaturan-antarmuka-teks',
      'pengaturan-piranti-keras',
      'manajemen-pengguna-dan-kelompok',
    ],
  },
  {
    label: 'Penutup',
    chapters: ['penutup'],
  },
]

/**
 * Extract slug from filename
 * e.g., "BAB-002-Pengenalan.md" -> "pengenalan"
 */
function extractSlug(filename) {
  const withoutExt = filename.replace(/\.md$/, '')
  const slug = withoutExt.replace(/^BAB-\d+-/, '').toLowerCase()
  return slug.replace(/[-_]+/g, '-')
}

/**
 * Extract title from first H1 heading
 */
function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : 'Untitled'
}

/**
 * Transform image paths from relative to absolute
 * e.g., ./CuplikanLayar/Pasang/3PilihBahasa.png -> /docs/CuplikanLayar/Pasang/3PilihBahasa.png
 */
function transformImagePaths(content) {
  // Handle various image path patterns:
  // ![alt](./path) -> ![alt](/docs/path)
  // ![alt](path) -> ![alt](/docs/path)
  // ![](Gambar/file.png) -> ![](/docs/Gambar/file.png)
  return content.replace(
    /!\[([^\]]*)\]\(\.?\/?((Gambar|CuplikanLayar)[^)]+)\)/g,
    '![$1](/docs/$2)',
  )
}

/**
 * Transform markdown content to MDX
 */
function transformContent(content) {
  let transformed = content

  // 1. Remove \newpage LaTeX commands
  transformed = transformed.replace(/\\newpage\s*/g, '')

  // 2. Fix HTML entities
  transformed = transformed
    .replace(/=&gt;/g, '=>')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')

  // 3. Remove anchor span tags
  transformed = transformed.replace(/<span\s+id="anchor[^"]*">\s*<\/span>/g, '')

  // 4. Convert HTML comments to MDX comments or remove empty ones
  transformed = transformed.replace(/<!--\s*-->/g, '')
  transformed = transformed.replace(/<!--(.+?)-->/gs, '{/* $1 */}')

  // 5. Remove backslash escapes (used for Pandoc/LaTeX)
  transformed = transformed.replace(/\\([_~$#*])/g, '$1')

  // 6. Convert autolink URLs <http://...> to proper markdown links
  transformed = transformed.replace(/<(https?:\/\/[^>]+)>/g, '[$1]($1)')

  // 7. Convert autolink emails <email@domain> to proper markdown links
  transformed = transformed.replace(
    /<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>/g,
    '[$1](mailto:$1)',
  )

  // 8. Escape angle brackets that look like JSX tags but aren't
  transformed = transformed.replace(/<([a-zA-Z_][a-zA-Z0-9_./ -]*)>/g, '`<$1>`')

  // 9. Handle special placeholder patterns like <***> or <*>
  transformed = transformed.replace(/<(\*+)>/g, '`<$1>`')

  // 10. Convert unsupported code block languages to supported ones
  transformed = transformed.replace(/```terminal/g, '```bash')

  // 11. Transform image paths to use public directory
  transformed = transformImagePaths(transformed)

  // 12. Remove first H1 heading (will be in frontmatter)
  transformed = transformed.replace(/^#\s+.+\n+/, '')

  // 13. Normalize multiple blank lines to double newlines
  transformed = transformed.replace(/\n{3,}/g, '\n\n')

  // 14. Trim leading/trailing whitespace
  transformed = transformed.trim()

  return transformed
}

/**
 * Generate MDX content with frontmatter
 */
function generateMdx(title, content) {
  return `---
title: ${title}
---

${content}
`
}

/**
 * Fetch text content from GitHub
 */
async function fetchContent(filename) {
  const url = BASE_URL + filename
  console.log(`  Fetching: ${filename}`)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }

  return response.text()
}

/**
 * Fetch binary content (images) from GitHub
 */
async function fetchBinary(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }

  return Buffer.from(await response.arrayBuffer())
}

/**
 * List files in a GitHub directory using API
 */
async function listGitHubDirectory(path) {
  const url = API_URL + path
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'panduan-distribusi-migration',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to list ${path}: ${response.status}`)
  }

  return response.json()
}

/**
 * Recursively fetch all image files from a directory
 */
async function fetchImageList(dirPath, basePath = '') {
  const files = []
  const items = await listGitHubDirectory(dirPath)

  for (const item of items) {
    const relativePath = basePath ? `${basePath}/${item.name}` : item.name

    if (item.type === 'dir') {
      // Recursively fetch subdirectory
      const subFiles = await fetchImageList(
        `${dirPath}/${item.name}`,
        relativePath,
      )
      files.push(...subFiles)
    } else if (item.type === 'file' && item.download_url) {
      // Check if it's an image file
      const ext = item.name.toLowerCase().split('.').pop()
      if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'webp'].includes(ext)) {
        files.push({
          name: item.name,
          path: relativePath,
          downloadUrl: item.download_url,
          size: item.size,
        })
      }
    }
  }

  return files
}

/**
 * Download and save an image
 */
async function downloadImage(image, baseDir) {
  const targetPath = join(baseDir, image.path)
  const targetDir = dirname(targetPath)

  // Create directory if needed
  await mkdir(targetDir, { recursive: true })

  // Download and save
  const data = await fetchBinary(image.downloadUrl)
  await writeFile(targetPath, data)

  return targetPath
}

/**
 * Process a single chapter
 */
async function processChapter(filename) {
  const slug = extractSlug(filename)
  const rawContent = await fetchContent(filename)
  const title = extractTitle(rawContent)
  const transformedContent = transformContent(rawContent)
  const mdxContent = generateMdx(title, transformedContent)

  // Create directory
  const chapterDir = join(DOCS_DIR, slug)
  await mkdir(chapterDir, { recursive: true })

  // Write MDX file
  const mdxPath = join(chapterDir, 'index.mdx')
  await writeFile(mdxPath, mdxContent, 'utf-8')

  console.log(`  Created: ${slug}/index.mdx (${title})`)

  return { slug, title }
}

/**
 * Generate meta.json for navigation ordering with category separators
 * Uses Fumadocs separator syntax: "---Label---" for visual grouping
 * See: https://fumadocs.vercel.app/docs/headless/page-conventions#pages
 */
async function generateMetaJson() {
  const pages = ['index']

  for (const category of SIDEBAR_CATEGORIES) {
    // Add separator with category label
    pages.push(`---${category.label}---`)
    // Add all chapters in this category
    pages.push(...category.chapters)
  }

  const meta = { pages }
  const metaContent = JSON.stringify(meta, null, 2) + '\n'
  const metaPath = join(DOCS_DIR, 'meta.json')

  await writeFile(metaPath, metaContent, 'utf-8')
  console.log(
    `\nGenerated: meta.json with ${pages.length} entries (${SIDEBAR_CATEGORIES.length} categories)`,
  )
}

/**
 * Migrate all images from a directory
 */
async function migrateImages(dirName) {
  console.log(`\nMigrating images from ${dirName}/...`)

  try {
    const images = await fetchImageList(dirName, dirName)
    console.log(`  Found ${images.length} images`)

    let downloaded = 0
    for (const image of images) {
      try {
        await downloadImage(image, IMAGES_DIR)
        downloaded++
        // Show progress every 10 images
        if (downloaded % 10 === 0) {
          console.log(`  Downloaded ${downloaded}/${images.length}...`)
        }
      } catch (error) {
        console.error(`  Error downloading ${image.path}: ${error.message}`)
      }
    }

    console.log(`  Completed: ${downloaded}/${images.length} images`)
    return downloaded
  } catch (error) {
    console.error(`  Error listing ${dirName}: ${error.message}`)
    return 0
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('Starting migration from panduan-distribusi...\n')
  console.log(`Source: ${BASE_URL}`)
  console.log(`Target (MDX): ${DOCS_DIR}`)
  console.log(`Target (Images): ${IMAGES_DIR}\n`)

  // Create images directory
  await mkdir(IMAGES_DIR, { recursive: true })

  // Migrate chapters
  console.log('Migrating chapters...')
  const chapters = []

  for (const filename of SOURCE_FILES) {
    try {
      const chapter = await processChapter(filename)
      chapters.push(chapter)
    } catch (error) {
      console.error(`  Error processing ${filename}: ${error.message}`)
    }
  }

  console.log(`\nProcessed ${chapters.length}/${SOURCE_FILES.length} chapters`)

  // Generate meta.json with category separators
  await generateMetaJson()

  // Migrate images
  let totalImages = 0
  for (const dir of IMAGE_DIRS) {
    totalImages += await migrateImages(dir)
  }

  console.log(`\nTotal images migrated: ${totalImages}`)

  console.log('\nMigration complete!')
  console.log('\nNext steps:')
  console.log('1. Run `npm run dev` to preview the documentation')
  console.log('2. Navigate to /id/docs to see the migrated content')
  console.log('3. Run `npm run build` to verify no MDX parsing errors')
}

// CLI argument handling
const args = process.argv.slice(2)

if (args.includes('--meta-only')) {
  // Only regenerate meta.json
  console.log('Regenerating meta.json only...')
  generateMetaJson()
    .then(() => console.log('Done!'))
    .catch((error) => {
      console.error('Failed:', error)
      process.exit(1)
    })
} else {
  // Run full migration
  migrate().catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
}
