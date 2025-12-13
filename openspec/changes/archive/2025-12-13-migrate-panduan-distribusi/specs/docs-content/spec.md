## ADDED Requirements

### Requirement: Documentation Content Migration Script

The system SHALL provide a migration script to fetch and transform documentation content and images from the panduan-distribusi GitHub repository into MDX format compatible with Fumadocs.

#### Scenario: Fetch chapter content from GitHub

- **WHEN** the migration script is executed
- **THEN** it SHALL fetch all 15 chapter Markdown files from `https://raw.githubusercontent.com/BlankOn/panduan-distribusi/master/contents/`

#### Scenario: Fetch images from GitHub

- **WHEN** the migration script is executed
- **THEN** it SHALL recursively fetch all image files from `contents/Gambar/` and `contents/CuplikanLayar/` directories
- **AND** it SHALL download images to `public/docs/` preserving the directory structure

#### Scenario: Transform Markdown to MDX

- **GIVEN** the source files are Markdown (`.md`) with embedded LaTeX commands (designed for Pandoc PDF generation)
- **WHEN** a Markdown file is fetched successfully
- **THEN** the script SHALL apply these transformations:
  - Remove LaTeX commands (`\newpage`)
  - Convert HTML entities to characters (`=&gt;` to `=>`, `&amp;` to `&`, `&lt;` to `<`, `&gt;` to `>`)
  - Remove anchor span tags (`<span id="anchor-*"></span>`)
  - Convert or remove HTML comments (`<!-- -->` removed, others to `{/* */}`)
  - Remove backslash escapes (`\_`, `\~`, `\$`, `\#`, `\*`)
  - Convert autolink URLs (`<http://...>` to `[url](url)`)
  - Convert autolink emails (`<email@domain>` to `[email](mailto:email)`)
  - Escape JSX-like placeholder tags (`<name>` to `` `<name>` ``)
  - Escape asterisk patterns (`<***>` to `` `<***>` ``)
  - Convert code block language `terminal` to `bash`
  - Transform image paths from relative to absolute (`/docs/...`)
  - Extract title from first H1 heading for frontmatter
  - Remove the first H1 heading (moved to frontmatter)
  - Normalize multiple blank lines to double newlines

#### Scenario: Create directory structure

- **WHEN** content transformation is complete
- **THEN** the script SHALL create a directory under `content/docs/` using the slug derived from the source filename (e.g., `BAB-002-Pengenalan.md` becomes `pengenalan/`)

#### Scenario: Write MDX files

- **WHEN** a chapter directory is created
- **THEN** the script SHALL write the transformed content to `index.mdx` within that directory

#### Scenario: Generate navigation metadata

- **WHEN** all chapters are processed
- **THEN** the script SHALL generate a `meta.json` file in `content/docs/` using Fumadocs object format: `{ "pages": [...] }`

### Requirement: Documentation Content Structure

The documentation content SHALL follow the Fumadocs MDX content structure conventions.

#### Scenario: MDX frontmatter format

- **WHEN** an MDX file is created
- **THEN** it SHALL contain YAML frontmatter with at least a `title` field

#### Scenario: Chapter organization

- **WHEN** documentation is migrated
- **THEN** each chapter SHALL reside in its own directory under `content/docs/` with an `index.mdx` file

#### Scenario: Navigation ordering with category separators

- **WHEN** `meta.json` is generated
- **THEN** it SHALL list chapters grouped by category using Fumadocs separator syntax (`---Label---`)
- **AND** it SHALL include `index` as the first entry
- **AND** chapters SHALL be organized into 5 categories matching the Daftar Isi structure:
  - **Pengenalan**: ihwalbuku, pengenalan
  - **Memulai**: pemasangan, destop, peramban-berkas
  - **Aplikasi**: aplikasi-internet, aplikasi-perkantoran, aplikasi-grafis, aplikasi-multimedia-hiburan, aplikasi-aksesoris
  - **Pengaturan Lanjutan**: manajemen-paket, pengaturan-antarmuka-teks, pengaturan-piranti-keras, manajemen-pengguna-dan-kelompok
  - **Penutup**: penutup

### Requirement: Image Asset Migration

The system SHALL migrate all documentation images to the public directory.

#### Scenario: Image directory structure

- **WHEN** images are migrated
- **THEN** they SHALL be placed in `public/docs/` preserving the source directory structure
- **AND** images from `contents/Gambar/` SHALL be in `public/docs/Gambar/`
- **AND** images from `contents/CuplikanLayar/` SHALL be in `public/docs/CuplikanLayar/`

#### Scenario: Image path transformation

- **WHEN** MDX content references images
- **THEN** relative paths like `./CuplikanLayar/file.png` or `Gambar/file.png` SHALL be transformed to `/docs/CuplikanLayar/file.png` or `/docs/Gambar/file.png`

#### Scenario: Supported image formats

- **WHEN** fetching images from GitHub
- **THEN** the script SHALL download files with extensions: `png`, `jpg`, `jpeg`, `gif`, `svg`, `ico`, `webp`
