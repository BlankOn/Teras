# Change: Migrate panduan-distribusi content to /docs

## Why

The BlankOn user documentation currently exists in a separate repository (https://github.com/BlankOn/panduan-distribusi). This content needs to be migrated to the Teras website's `/docs` section to provide a unified, searchable, and well-structured documentation experience using Fumadocs MDX.

## What Changes

- Add a Node.js migration script (`scripts/migrate-docs.mjs`) to automate content and image fetching
- Fetch 15 chapters from the `contents/` directory of panduan-distribusi repository
- Fetch all images from `contents/Gambar/` and `contents/CuplikanLayar/` directories (including subdirectories)
- Transform Markdown to MDX format with proper frontmatter
- Transform image paths to point to the public directory
- Create folder structure under `content/docs/` following Fumadocs conventions
- Generate `meta.json` for navigation ordering with category separators (Pengenalan, Memulai, Aplikasi, Pengaturan Lanjutan, Penutup)
- Clean up content (HTML entities, LaTeX artifacts, anchor spans, HTML comments, autolinks, code block languages)

## Impact

- Affected specs: `docs-content` (modified capability)
- Affected code:
  - `content/docs/` - New MDX files for each chapter
  - `public/docs/` - Migrated images (Gambar/, CuplikanLayar/)
  - `scripts/migrate-docs.mjs` - New migration script
  - `content/docs/meta.json` - Navigation configuration
  - `content/docs/index.mdx` - Updated with chapter links

## Source Format Clarification

The panduan-distribusi repository shows "100% TeX" on GitHub, but this is misleading:

- **Actual content format**: Markdown (`.md`) files in `contents/` directory
- **Why GitHub detects TeX**: The `Template/` directory contains Pandoc LaTeX templates (`mytemplate.tex`, `artivisi.tex`) used to generate PDF output
- **Markdown with LaTeX artifacts**: The `.md` files contain embedded LaTeX commands (e.g., `\newpage`) because they were designed to be processed by Pandoc with LaTeX templates

The migration script strips these LaTeX artifacts during transformation to MDX.

## Source Content Structure

The panduan-distribusi repository contains:

### Chapter Files (`contents/*.md`)

15 chapters written for BlankOn XI Uluwatu:

| Source File                                | Topic                         |
| ------------------------------------------ | ----------------------------- |
| BAB-001-IhwalBuku.md                       | About this book               |
| BAB-002-Pengenalan.md                      | Introduction to Linux/BlankOn |
| BAB-003-Pemasangan.md                      | Installation guide            |
| BAB-004-Manajemen-paket.md                 | Package management            |
| BAB-005-Destop.md                          | Desktop environment           |
| BAB-006-Peramban-berkas.md                 | File browser                  |
| BAB-007-Aplikasi-Internet.md               | Internet applications         |
| BAB-008-Aplikasi-Perkantoran.md            | Office applications           |
| BAB-009-Aplikasi-Grafis.md                 | Graphics applications         |
| BAB-010-Aplikasi-multimedia-hiburan.md     | Multimedia                    |
| BAB-011-Aplikasi-Aksesoris.md              | Accessories                   |
| BAB-012-Pengaturan-Antarmuka-Teks.md       | CLI settings                  |
| BAB-013-Pengaturan-Piranti-Keras.md        | Hardware settings             |
| BAB-014-Manajemen-Pengguna-Dan-Kelompok.md | User management               |
| BAB-015-Penutup.md                         | Closing                       |

### Image Directories

The repository contains image assets that are migrated:

- `contents/Gambar/` - General images (logos, diagrams) - 5 files
- `contents/CuplikanLayar/` - Screenshots with subdirectories - 85 files
  - `CuplikanLayar/Paket/` - Package manager screenshots
  - `CuplikanLayar/Pasang/` - Installation screenshots
  - `CuplikanLayar/Rincian/` - Details screenshots
  - `CuplikanLayar/Telegram/` - Telegram screenshots
  - `CuplikanLayar/live/` - Live mode screenshots

### Other Directories (Not Migrated)

- `5/` - Alternative chapter set (older version)
- `Template/` - Pandoc LaTeX templates for PDF generation
- `Hasil/` - Generated output files (PDF, ODT)

## Content Transformations

The migration script applies these transformations:

1. **Remove LaTeX commands** - `\newpage`
2. **Fix HTML entities** - `=&gt;` to `=>`, `&amp;` to `&`, `&lt;` to `<`, `&gt;` to `>`
3. **Remove anchor spans** - `<span id="anchor-*"></span>`
4. **Convert HTML comments** - Empty `<!-- -->` removed, others converted to MDX `{/* */}`
5. **Remove backslash escapes** - `\_`, `\~`, `\$`, `\#`, `\*` to plain characters
6. **Convert autolink URLs** - `<http://...>` to `[url](url)` format
7. **Convert autolink emails** - `<email@domain>` to `[email](mailto:email)` format
8. **Escape JSX-like tags** - `<placeholder>` to `` `<placeholder>` ``
9. **Escape asterisk patterns** - `<***>` to `` `<***>` ``
10. **Convert code block languages** - `terminal` to `bash`
11. **Transform image paths** - Relative paths to `/docs/` absolute paths
12. **Add MDX frontmatter** - Extract title from first H1 heading
13. **Remove first H1** - Title moves to frontmatter
14. **Normalize whitespace** - Multiple blank lines to double newlines

## Notes

- Content is written for BlankOn XI Uluwatu (documentation mentions Gnome 3.26.2, kernel 4.14.13, LibreOffice 6.0.1.1, Firefox 58.0.1)
- Total 90 images migrated (5 from Gambar/, 85 from CuplikanLayar/)
- BAB-014 is a placeholder file (only 43 bytes)
- The `5/` directory appears to be an older version of chapters and is not migrated
- `meta.json` uses Fumadocs object format with separator syntax: `{ "pages": ["index", "---Category---", "slug", ...] }`
- Sidebar organized into 5 categories: Pengenalan, Memulai, Aplikasi, Pengaturan Lanjutan, Penutup
