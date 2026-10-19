#!/usr/bin/env node

/**
 * Sync Wiki Content Script
 *
 * This script clones the BlankOn revival repository and converts
 * its markdown files to MDX format for use in the Teras wiki.
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { getSlug, rewriteWikiLinks } from './wiki-links.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REPO_URL = 'https://github.com/blankon/blankon-linux.git'
const TEMP_DIR = path.join(__dirname, '../.temp/blankon-linux')
const WIKI_DIR = path.join(__dirname, '../content/wiki')

// Directories to ignore when processing
const IGNORE_DIRS = ['.git', '.github', 'node_modules']

/**
 * Execute shell command
 */
function exec(command, options = {}) {
  console.log(`→ ${command}`)
  return execSync(command, { stdio: 'inherit', ...options })
}

/**
 * Clone or update the revival repository
 */
async function cloneRepo() {
  console.log('\n📦 Cloning revival repository...')

  // Clean up temp directory
  await fs.rm(TEMP_DIR, { recursive: true, force: true })
  await fs.mkdir(path.dirname(TEMP_DIR), { recursive: true })

  // Clone the repository
  exec(`git clone --depth 1 ${REPO_URL} ${TEMP_DIR}`)

  console.log('✓ Repository cloned successfully')
}

/**
 * Turn a CamelCase name into spaced words (QualityAssurance → Quality Assurance)
 */
function humanize(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
}

/**
 * Extract frontmatter from markdown content
 */
function extractTitle(content, filename) {
  // Try to find first heading
  const headingMatch = content.match(/^#\s+(.+)$/m)
  if (headingMatch) {
    const heading = headingMatch[1].trim()
    // A single CamelCase word is a file/folder name, not a real title
    return /^[A-Za-z0-9]+$/.test(heading) ? humanize(heading) : heading
  }

  // Fallback to filename
  return humanize(filename.replace(/\.mdx?$/, '').replace(/\.[a-z]{2}$/, ''))
}

/**
 * Escape special characters for MDX
 */
function escapeMdxContent(content) {
  // Split content by code blocks to avoid escaping inside them
  const codeBlockRegex = /```[\s\S]*?```|`[^`\n]+`/g

  const codeBlocks = []
  let match
  while ((match = codeBlockRegex.exec(content)) !== null) {
    codeBlocks.push({
      start: match.index,
      end: match.index + match[0].length,
      content: match[0]
    })
  }

  // Process content between code blocks
  let result = ''
  let lastEnd = 0

  for (const block of codeBlocks) {
    // Get text before this code block
    let textBefore = content.slice(lastEnd, block.start)

    // Escape <email@domain> angle-bracket form to prevent MDX treating it as JSX
    textBefore = textBefore.replace(/<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})>/g, (_, email) => {
      return `&lt;${email}&gt;`
    })

    // Escape standalone @ symbols (Twitter handles, etc) with backslash
    // but not when they're part of an email address
    textBefore = textBefore.replace(/(?<![a-zA-Z0-9._%+-])@([a-zA-Z0-9_-]+)/g, '\\@$1')

    result += textBefore + block.content
    lastEnd = block.end
  }

  // Add remaining text after last code block
  let remainingText = content.slice(lastEnd)
  remainingText = remainingText.replace(/<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})>/g, (_, email) => {
    return `&lt;${email}&gt;`
  })
  remainingText = remainingText.replace(/(?<![a-zA-Z0-9._%+-])@([a-zA-Z0-9_-]+)/g, '\\@$1')
  result += remainingText

  return result
}

/**
 * Convert markdown to MDX with frontmatter
 */
function convertToMdx(content, filename, editPath, titleOverride) {
  const title = titleOverride || extractTitle(content, filename)

  // Remove the first # heading from the body — it will be rendered by DocsTitle via frontmatter
  let bodyContent = content.replace(/^#\s+.+\n?/m, '')

  const localeMatch = filename.match(/^.+\.([a-z]{2})\.md$/)
  bodyContent = rewriteWikiLinks(bodyContent, editPath, {
    locale: localeMatch && KNOWN_LOCALES.includes(localeMatch[1]) ? localeMatch[1] : 'en',
    knownLocales: KNOWN_LOCALES,
    exists: (repoPath) => existsSync(path.join(TEMP_DIR, repoPath)),
    onMissing: (target) => console.warn(`  ⚠ ${editPath}: link target not found: ${target}`),
  })

  // Escape special MDX characters
  let processedContent = escapeMdxContent(bodyContent)

  if (processedContent.startsWith('---')) {
    // Inject editPath into existing frontmatter
    return processedContent.replace(/^---\n/, `---\neditPath: ${JSON.stringify(editPath)}\n`)
  }

  // Quote values so titles containing YAML syntax (e.g. ": ") stay valid
  const frontmatter = `---
title: ${JSON.stringify(title)}
editPath: ${JSON.stringify(editPath)}
---

`
  return frontmatter + processedContent
}

// Locale codes supported by the i18n config
const KNOWN_LOCALES = ['en', 'id']

/**
 * Process directory recursively
 */
async function processDirectory(sourceDir, targetDir, basePath = '', originalBasePath = '') {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true })

  for (const entry of entries) {
    // Skip ignored directories
    if (IGNORE_DIRS.includes(entry.name)) {
      continue
    }

    const sourcePath = path.join(sourceDir, entry.name)

    if (entry.isDirectory()) {
      // Process subdirectory
      const slug = getSlug(entry.name)
      const newTargetDir = path.join(targetDir, slug)
      await fs.mkdir(newTargetDir, { recursive: true })
      // Folder titles come from the original CamelCase name, since slugs are lowercased
      await fs.writeFile(
        path.join(newTargetDir, 'meta.json'),
        JSON.stringify({ title: humanize(entry.name) }, null, 2),
        'utf-8'
      )
      await processDirectory(sourcePath, newTargetDir, path.join(basePath, slug), path.join(originalBasePath, entry.name))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // Convert markdown file to MDX
      const originalRelPath = path.join(originalBasePath, entry.name).replace(/\\/g, '/')
      const content = await fs.readFile(sourcePath, 'utf-8')
      const isReadme = entry.name.toLowerCase() === 'readme.md'
      const dirTitle = isReadme && originalBasePath ? humanize(path.basename(originalBasePath)) : undefined
      const mdxContent = convertToMdx(content, entry.name, originalRelPath, dirTitle)

      // Detect locale suffix: e.g. WikiGuidelines.id.md → base=wikiguidelines, locale=id
      const localeMatch = entry.name.match(/^(.+)\.([a-z]{2})\.md$/)
      const isLocaleFile = localeMatch && KNOWN_LOCALES.includes(localeMatch[2])

      let targetPath
      if (isReadme) {
        targetPath = path.join(targetDir, 'index.mdx')
      } else if (isLocaleFile) {
        // Place as index.{locale}.mdx inside the base slug directory
        const baseSlug = getSlug(localeMatch[1])
        const locale = localeMatch[2]
        const subDir = path.join(targetDir, baseSlug)
        await fs.mkdir(subDir, { recursive: true })
        targetPath = path.join(subDir, `index.${locale}.mdx`)
      } else {
        const slug = getSlug(entry.name)
        const subDir = path.join(targetDir, slug)
        await fs.mkdir(subDir, { recursive: true })
        targetPath = path.join(subDir, 'index.mdx')
      }

      await fs.writeFile(targetPath, mdxContent, 'utf-8')
      console.log(`  ✓ ${path.relative(WIKI_DIR, targetPath)}`)
    }
  }
}

// Wiki sections whose README is replaced by an auto-generated list of their pages
const AUTO_INDEX_DIRS = ['UserGuides']

/**
 * Replace the body of each section index with a list of the pages under it
 */
async function generateIndexes() {
  console.log('\n📑 Generating section indexes...')

  for (const dir of AUTO_INDEX_DIRS) {
    const sectionDir = path.join(WIKI_DIR, dir)
    const indexPath = path.join(sectionDir, 'index.mdx')

    let index
    try {
      index = await fs.readFile(indexPath, 'utf-8')
    } catch (error) {
      if (error.code === 'ENOENT') continue
      throw error
    }

    const entries = await fs.readdir(sectionDir, { withFileTypes: true })
    const items = []
    for (const entry of entries.filter((e) => e.isDirectory())) {
      try {
        const page = await fs.readFile(path.join(sectionDir, entry.name, 'index.mdx'), 'utf-8')
        const title = page.match(/^title:\s*(.+)$/m)?.[1].trim() ?? humanize(entry.name)
        items.push({ title, href: `/en/wiki/${dir}/${entry.name}` })
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
    }
    items.sort((a, b) => a.title.localeCompare(b.title))

    const frontmatter = index.match(/^---\n[\s\S]*?\n---\n/)[0]
    const list = items.map((item) => `- [${item.title}](${item.href})`).join('\n')
    await fs.writeFile(indexPath, `${frontmatter}\n${list}\n`, 'utf-8')
    console.log(`  ✓ ${dir}/index.mdx lists ${items.length} pages`)
  }
}

/**
 * Copy assets
 */
async function copyAssets() {
  console.log('\n📁 Copying assets...')

  const assetsSource = path.join(TEMP_DIR, 'assets')
  const assetsTarget = path.join(__dirname, '../public/wiki/assets')

  try {
    await fs.access(assetsSource)
    await fs.rm(assetsTarget, { recursive: true, force: true })
    await fs.mkdir(path.dirname(assetsTarget), { recursive: true })
    await fs.cp(assetsSource, assetsTarget, { recursive: true })
    console.log('  ✓ Assets copied to public/wiki/assets')
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
    console.log('  ⚠ No assets directory found in source')
  }
}

/**
 * Generate meta.json for navigation
 */
async function generateMeta() {
  console.log('\n📝 Generating meta.json...')

  // Get all subdirectories (pages) in the wiki directory, excluding assets
  const entries = await fs.readdir(WIKI_DIR, { withFileTypes: true })
  const pages = entries
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'assets')
    .map(entry => entry.name)
    .sort()

  const meta = {
    title: 'Wiki',
    pages: pages
  }

  await fs.writeFile(
    path.join(WIKI_DIR, 'meta.json'),
    JSON.stringify(meta, null, 2),
    'utf-8'
  )

  console.log(`  ✓ meta.json generated with ${pages.length} pages`)
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting wiki sync...\n')

  try {
    // Step 1: Clone repository
    await cloneRepo()

    // Step 2: Clean wiki directory
    console.log('\n🧹 Cleaning wiki directory...')
    await fs.rm(WIKI_DIR, { recursive: true, force: true })
    await fs.mkdir(WIKI_DIR, { recursive: true })
    console.log('  ✓ Wiki directory cleaned')

    // Step 3: Process markdown files
    console.log('\n📝 Converting markdown files to MDX...')
    await processDirectory(TEMP_DIR, WIKI_DIR)

    // Step 3b: Auto-generate section indexes
    await generateIndexes()

    // Step 4: Copy assets
    await copyAssets()

    // Step 5: Generate meta.json
    await generateMeta()

    // Step 6: Clean up temp directory
    console.log('\n🧹 Cleaning up...')
    await fs.rm(TEMP_DIR, { recursive: true, force: true })
    console.log('  ✓ Temporary files removed')

    console.log('\n✅ Wiki sync completed successfully!\n')
  } catch (error) {
    console.error('\n❌ Error syncing wiki:', error.message)
    process.exit(1)
  }
}

main()
