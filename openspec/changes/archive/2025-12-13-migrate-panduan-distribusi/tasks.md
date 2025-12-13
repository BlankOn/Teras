# Tasks: Migrate panduan-distribusi

## 1. Create Migration Script

- [x] 1.1 Create `scripts/migrate-docs.mjs` with Node.js ESM syntax
- [x] 1.2 Define source file list (15 chapters from `contents/`)
- [x] 1.3 Implement `fetch` to download raw markdown from GitHub
- [x] 1.4 Implement slug extraction from filename (e.g., `BAB-002-Pengenalan.md` -> `pengenalan`)
- [x] 1.5 Implement title extraction from first H1 heading
- [x] 1.6 Implement content transformations:
  - [x] 1.6.1 Remove `\newpage` LaTeX commands
  - [x] 1.6.2 Fix HTML entities (`=&gt;`, `&amp;`, `&lt;`, `&gt;`)
  - [x] 1.6.3 Remove `<span id="anchor-*"></span>` tags
  - [x] 1.6.4 Convert/remove HTML comments
  - [x] 1.6.5 Remove backslash escapes (`\_`, `\~`, `\$`, `\#`, `\*`)
  - [x] 1.6.6 Convert autolink URLs and emails
  - [x] 1.6.7 Escape JSX-like placeholder tags
  - [x] 1.6.8 Convert code block language `terminal` to `bash`
  - [x] 1.6.9 Transform image paths to `/docs/` prefix
  - [x] 1.6.10 Normalize multiple blank lines
  - [x] 1.6.11 Remove first H1 (title moves to frontmatter)
- [x] 1.7 Implement MDX generation with frontmatter (`title` field)
- [x] 1.8 Implement directory creation (`content/docs/{slug}/`)
- [x] 1.9 Implement file writing (`index.mdx` per chapter)
- [x] 1.10 Implement `meta.json` generation with Fumadocs object format and category separators
- [x] 1.11 Add `SIDEBAR_CATEGORIES` mapping for 5 category groups (Pengenalan, Memulai, Aplikasi, Pengaturan Lanjutan, Penutup)
- [x] 1.12 Add `--meta-only` CLI argument for regenerating only meta.json

## 2. Create Image Migration

- [x] 2.1 Implement GitHub API integration to list directory contents
- [x] 2.2 Implement recursive directory traversal for subdirectories
- [x] 2.3 Implement binary file download for images
- [x] 2.4 Implement image saving to `public/docs/` with preserved structure
- [x] 2.5 Support image formats: png, jpg, jpeg, gif, svg, ico, webp

## 3. Run Migration

- [x] 3.1 Execute migration script: `node scripts/migrate-docs.mjs`
- [x] 3.2 Verify all 15 chapter directories are created
- [x] 3.3 Verify `meta.json` is generated with correct page order and category separators
- [x] 3.4 Verify 90 images migrated (5 from Gambar/, 85 from CuplikanLayar/)
- [x] 3.5 Spot-check MDX files for proper frontmatter and content

## 4. Validation

- [x] 4.1 Run build: `npm run build` to ensure no MDX parsing errors
- [ ] 4.2 Run dev server: `npm run dev` and verify chapters appear in sidebar
- [ ] 4.3 Open chapters and verify content and images render correctly
- [ ] 4.4 Test search functionality with Indonesian terms

## 5. Cleanup

- [x] 5.1 Update `content/docs/index.mdx` with links to migrated chapters
- [x] 5.2 Update `content/docs/index.en.mdx` with English chapter links
- [x] 5.3 Document migration script with JSDoc comments

## Dependencies

- Task 2 depends on Task 1 completion
- Task 3 depends on Tasks 1 and 2 completion
- Task 4 depends on Task 3 completion
- Task 5 can be parallelized with Task 4

## Migration Statistics

- **Chapters migrated**: 15/15
- **Images migrated**: 90 (5 Gambar + 85 CuplikanLayar)
- **Content transformations**: 14 types
- **Sidebar categories**: 5 (Pengenalan, Memulai, Aplikasi, Pengaturan Lanjutan, Penutup)
- **Build status**: Passing
