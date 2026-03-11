#!/usr/bin/env node

/**
 * Sync Wiki Content Script
 *
 * This script clones the BlankOn revival repository and converts
 * its markdown files to MDX format for use in the Teras wiki.
 */

import { execSync } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REPO_URL = 'https://github.com/blankon/revival.git'
const TEMP_DIR = path.join(__dirname, '../.temp/revival')
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
 * Extract frontmatter from markdown content
 */
function extractTitle(content, filename) {
  // Try to find first heading
  const headingMatch = content.match(/^#\s+(.+)$/m)
  if (headingMatch) {
    return headingMatch[1].trim()
  }

  // Fallback to filename
  return filename.replace(/\.mdx?$/, '').replace(/[-_]/g, ' ')
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
function convertToMdx(content, filename, editPath) {
  const title = extractTitle(content, filename)

  // Escape special MDX characters
  let processedContent = escapeMdxContent(content)

  if (processedContent.startsWith('---')) {
    // Inject editPath into existing frontmatter
    return processedContent.replace(/^---\n/, `---\neditPath: ${editPath}\n`)
  }

  const frontmatter = `---
title: ${title}
editPath: ${editPath}
---

`
  return frontmatter + processedContent
}

/**
 * Get URL slug from file path
 */
function getSlug(filePath) {
  return path.basename(filePath, path.extname(filePath))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

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
      await processDirectory(sourcePath, newTargetDir, path.join(basePath, slug), path.join(originalBasePath, entry.name))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // Convert markdown file to MDX
      const originalRelPath = path.join(originalBasePath, entry.name).replace(/\\/g, '/')
      const content = await fs.readFile(sourcePath, 'utf-8')
      const mdxContent = convertToMdx(content, entry.name, originalRelPath)

      // Determine target filename
      let targetFilename
      if (entry.name.toLowerCase() === 'readme.md') {
        targetFilename = 'index.mdx'
      } else {
        const slug = getSlug(entry.name)
        const subDir = path.join(targetDir, slug)
        await fs.mkdir(subDir, { recursive: true })
        targetFilename = path.join(subDir, 'index.mdx')
      }

      const targetPath = entry.name.toLowerCase() === 'readme.md'
        ? path.join(targetDir, targetFilename)
        : targetFilename

      await fs.writeFile(targetPath, mdxContent, 'utf-8')
      console.log(`  ✓ ${path.relative(WIKI_DIR, targetPath)}`)
    }
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
